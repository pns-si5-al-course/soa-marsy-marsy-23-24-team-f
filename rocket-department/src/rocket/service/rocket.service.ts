import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RocketDTO } from '../dto/rocket.dto';
import { StatusUpdateDto } from '../dto/statusUpdate.dto';
import { ApiService } from '../../common/api/api.service';
import { PayloadDTO } from '../dto/payload.dto';
import { DataStore } from "../../gateway/DataStore";

import { promises as fsPromises } from 'fs';
import * as fs from 'fs';
import * as path from 'path';
import { AnomalyReportDTO } from '../dto/anomalyReport.dto';

@Injectable()
export class RocketService {

  constructor(
    private httpService: HttpService,
    private apiService: ApiService
  ) {}

  async onModuleInit(): Promise<void> {
    DataStore.eventEmitter.on('dataAdded', async (data) => {
      const telemetricsRocketDto: RocketDTO = JSON.parse(data).body;
      if (telemetricsRocketDto.status != "Destruct") {
        const telemetricsRocketDto: RocketDTO = JSON.parse(data).body;

        // Récupérez toutes les données existantes
        const allTelemetrics = DataStore.getDatas();

        const previousTelemetricsData = allTelemetrics
          .reverse()
          .find(d => JSON.parse(d).body.name === telemetricsRocketDto.name && d !== data);

        let previousTelemetrics: RocketDTO | undefined;
        if (previousTelemetricsData) {
          previousTelemetrics = JSON.parse(previousTelemetricsData).body;
        }

        const anomaly = this.checkAnomaly(telemetricsRocketDto, previousTelemetrics);
        console.log('Anomaly : ', anomaly);
        if (anomaly === "critical" || anomaly === "warning") {
          const anomalyReport: AnomalyReportDTO = {
            rocket: telemetricsRocketDto,
            anomaly: anomaly
          };
          if (anomaly === "critical") {
            this.updateRocketStatus(telemetricsRocketDto, "Destruct")
          }

          try {
            await this.apiService.post('http://mission-commander-service:3006/rocket/anomaly', anomalyReport);
            console.log('Anomaly report sent successfully');
          } catch (error) {
            console.error('Error sending anomaly report:', error);
          }
        }
      }
    });
  }

  /**
   * @description checkAnomaly
   * @param currentTelemetrics previousTelemetrics
   * @returns string
   * @memberof RocketService
  */
  checkAnomaly(currentTelemetrics: RocketDTO, previousTelemetrics?: RocketDTO): string {
    // Check for critical anomalies
    if (currentTelemetrics.status === "First Stage Separation Failed") {
      return "critical";
    }

    // Check for warning-level anomalies
    if (
      previousTelemetrics &&
      currentTelemetrics.stages &&
      previousTelemetrics.stages &&
      currentTelemetrics.stages.length > 0 &&
      previousTelemetrics.stages.length > 0 &&
      currentTelemetrics.stages[0].fuel < previousTelemetrics.stages[0].fuel - 500 &&
      currentTelemetrics.status === previousTelemetrics.status
    ) {
      return "warning";
    }

    // No anomalies detected
    return "ok";
  }

  /**
   * @description initiateStartupSequence
   * @param rocket
   * @returns Promise<RocketDTO>
   * @memberof RocketService
  */
  async initiateStartupSequence(rocket: RocketDTO): Promise<RocketDTO> {
    console.log("Sending startup command.");
    try {
      const nrocket = await this.updateRocketStatus(rocket, "Rocket on internal power");
      return this.updateRocketStatus(nrocket, "Startup");
    } catch (error) {
      console.error('Error fetching rocket status in startup:', error.message);
        throw error;
    }
  }

  /**
   * @description initiatePreLaunchSequence
   * @param rocket
   * @returns Promise<RocketDTO>
   * @memberof RocketService
  */
  async initiateMainEngineStart(rocket: RocketDTO): Promise<RocketDTO> {
    console.log("Sending main engine start command.");
    try {
        return this.updateRocketStatus(rocket, "Main engine start");
    } catch (error) {
        throw error;
    }
  }

  /**
   * @description initiateLiftoff
   * @param rocket
   * @returns Promise<RocketDTO>
   * @memberof RocketService
  */
  async initiateLiftoff(rocket: RocketDTO): Promise<RocketDTO> {
    try {
        return this.updateRocketStatus(rocket, "Liftoff");
    } catch (error) {
        throw error;
    }
  }

  /**
   * @description initiateLiftoff
   * @param rocket
   * @returns Promise<RocketDTO>
   * @memberof RocketService
  */
  private async updateRocketStatus(rocket: RocketDTO, status: string): Promise<RocketDTO> {
    let statusUpdate: StatusUpdateDto = {
      rocket: rocket,
      status: status
    };
    try {
        console.log("Sending status update : "+status);
        return this.apiService.post('http://rocket-object-service:3005/rocket/status', statusUpdate);
    } catch (error) {
        console.error('Error fetching rocket status in update:', error.message);
        throw error;
    }
  }

  /**
   * @description loadRocket
   * @param rocket
   * @returns Promise<RocketDTO>
   * @memberof RocketService
  */
  async loadRocket(rocket: RocketDTO): Promise<RocketDTO> {
    try {
      const payload: PayloadDTO = await this.apiService.get<PayloadDTO>('http://payload-service:3004/rocket');
      rocket.payload = payload;
      const response: any = await this.apiService.post('http://rocket-object-service:3005/rocket/setpayload', rocket);
      console.log("Response after payload loaded: ", response);

      const nrocket = await this.updateRocketStatus(rocket, "Rocket preparation");
      console.log("Response after status update: ", nrocket);
      return nrocket;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * @description askTelemetrieForRocketData
   * @returns Promise<any>
   * @memberof RocketService
   */
  async askTelemetrieForRocketData(): Promise<any> {
      try {
        const response : any = await this.apiService.get('http://telemetrie-service:3003/rocket/telemetrics');
        console.log("Telemetrie response: ", response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching rocket status:', error.message);
      }
  }

}
