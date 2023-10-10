import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Telemetrics } from "../../../schema/telemetrics.schema";
import { TelemetricsDto } from "../../../dto/create-telemetrics.dto";
import { DataStore } from "../../gateway/DataStore";

@Injectable()
export class RocketService {
    private stop: boolean = false;
    constructor(@InjectModel(Telemetrics.name) private telemetricsModel: Model<Telemetrics>) {}

    onModuleInit(): void {
        DataStore.eventEmitter.on('dataAdded', (data) => {
          // get the body of the message
          const telemetricsDto: TelemetricsDto = JSON.parse(data).body;
          console.log('data added : ', telemetricsDto)
          this.createTelemetrics(telemetricsDto).then((result) => {
            console.log('Telemetrics created and stored to db:', result);
          }).catch((error) => {
            console.error('Error creating telemetrics:', error);
          });
        });
      }

    async createTelemetrics(telemetrics: TelemetricsDto): Promise<Telemetrics> {
        if (this.stop) return Promise.reject('Simulation stopped');
        const newTelemetrics = new this.telemetricsModel(telemetrics);
        return newTelemetrics.save();
    }

    async getTelemetrics(): Promise<Telemetrics[]> {
        if (this.stop) return Promise.reject('Simulation stopped');
        return this.telemetricsModel.find().exec();
    }

    async getLastTelemetrics(): Promise<Telemetrics> {
        if (this.stop) return Promise.reject('Simulation stopped');
        // get the size of the collection
        const data = await this.telemetricsModel.countDocuments()
        .then((count) => {
            if (count === 0) {
                return Promise.reject('No documents found');
            }
            else {
                return this.telemetricsModel.findOne().sort({$natural:-1}).limit(1);        
            }
        });
        return data;
    }

    async clearTelemetrics(): Promise<any> {
        return this.telemetricsModel.deleteMany({}).exec();
    }

    stopSimulation(): void {
        this.stop = true;
        console.log("Simulation stopped");
    }

    startSimulation(): void {
        this.stop = false;
        console.log("Simulation started");
    }
}