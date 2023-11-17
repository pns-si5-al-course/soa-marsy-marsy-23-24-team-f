import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RocketDTO } from '../dto/rocket.dto';
import { StatusUpdateDto } from '../dto/statusUpdate.dto';
import { ApiService } from '../../common/api/api.service';
import { PayloadDTO } from '../dto/payload.dto';

@Injectable()
export class RocketService {

  constructor(
    private httpService: HttpService,
    private apiService: ApiService
  ) {}

  /**
   * @description initiateStartupSequence
   * @param rocket
   * @returns Promise<RocketDTO>
   * @memberof RocketService
  */
  async initiateStartupSequence(rocket: RocketDTO): Promise<RocketDTO> {
    try {
      return await this.updateRocketStatus(rocket, "Startup");
    } catch (error) {
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
        return this.apiService.post('http://rocket-object-service:3005/rocket/status', statusUpdate);
    } catch (error) {
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
      console.log(response.status);
      return rocket;
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
