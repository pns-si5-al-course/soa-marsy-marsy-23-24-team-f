import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { InjectModel } from "@nestjs/mongoose";
import { PayloadTelemetricsDto } from "../../../dto/create-payload-telemetrics.dto";
import { PayloadTelemetrics } from "../../../schema/payloadTelemetrics.schema";

const telemetrieServiceUrl = process.env.TELEMETRIE_SERVICE_URL;

@Injectable()
export class RocketService {

    constructor(private httpService: HttpService, @InjectModel(PayloadTelemetrics.name) private payloadTelemetricsModel: Model<PayloadTelemetrics>) {}

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