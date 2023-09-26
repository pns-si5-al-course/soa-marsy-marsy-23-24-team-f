import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Telemetrics } from "../../../schema/telemetrics.schema";
import { TelemetricsDto } from "../../../dto/create-telemetrics.dto";


@Injectable()
export class RocketService {
    constructor(@InjectModel(Telemetrics.name) private telemetricsModel: Model<Telemetrics>) {}

    async createTelemetrics(telemetrics: TelemetricsDto): Promise<Telemetrics> {
        const newTelemetrics = new this.telemetricsModel(telemetrics);
        return newTelemetrics.save();
    }

    async getTelemetrics(): Promise<Telemetrics[]> {
        return this.telemetricsModel.find().exec();
    }

    async getLastTelemetrics(): Promise<Telemetrics> {
        return this.telemetricsModel.findOne().sort({$natural:-1}).limit(1);
    }
}