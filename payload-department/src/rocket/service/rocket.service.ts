import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { InjectModel } from "@nestjs/mongoose";
import { PayloadTelemetricsDto } from "../../../dto/create-payload-telemetrics.dto";
import { PayloadTelemetrics } from "../../../schema/payloadTelemetrics.schema";
import { DataStore } from "../../gateway/DataStore";

const telemetrieServiceUrl = process.env.TELEMETRIE_SERVICE_URL;

@Injectable()
export class RocketService {

    constructor(private httpService: HttpService, @InjectModel(PayloadTelemetrics.name) private payloadTelemetricsModel: Model<PayloadTelemetrics>) {}

    onModuleInit(): void {
      DataStore.eventEmitter.on('dataAdded', (data) => {
        // get the body of the message
        const telemetricsDto: PayloadTelemetrics = JSON.parse(data).body;
        console.log('data added : ', telemetricsDto)
        this.createPayloadTelemetrics(telemetricsDto).then((result) => {
          console.log('Telemetrics created and stored to payload db:', result);
        }).catch((error) => {
          console.error('Error creating telemetrics:', error);
        });
      });
    }


    async createPayloadTelemetrics(payloadTelemetrics: PayloadTelemetricsDto): Promise<any> {
      const newPayloadTelemetrics = new this.payloadTelemetricsModel(payloadTelemetrics);
      return newPayloadTelemetrics.save();
    };

    async getLastPayloadTelemetrics(): Promise<PayloadTelemetrics> {
      // get the size of the collection
      const data = await this.payloadTelemetricsModel.countDocuments()
      .then((count) => {
          if (count === 0) {
              return Promise.reject('No documents found');
          }
          else {
              return this.payloadTelemetricsModel.findOne().sort({$natural:-1}).limit(1);        
          }
      });
      return data;
  }
}