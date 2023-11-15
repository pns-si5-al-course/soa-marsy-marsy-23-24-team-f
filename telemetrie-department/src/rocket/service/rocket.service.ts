import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Telemetrics } from "../../../schema/telemetrics.schema";
import { TelemetricsDto } from "../../../dto/create-telemetrics.dto";
import { DataStore } from "../../gateway/DataStore";
import { Stage } from "../../../schema/stage.schema";
import { StageDto } from "../../../dto/create-stage.dto";

@Injectable()
export class RocketService {
    constructor(
        @InjectModel(Telemetrics.name) private telemetricsModel: Model<Telemetrics>,
        @InjectModel(Stage.name) private stageModel: Model<Stage>) {}

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

        DataStore.eventEmitter.on('StageData', (data) => {
            const stageDto: StageDto = JSON.parse(data).body;
            console.log('stage data added : ', stageDto)
            this.createStageTelemectrics(stageDto).then((result) => {
              console.log('Stage created and stored to db:', result);
            }).catch((error) => {
              console.error('Error creating stage:', error);
            });
        });
      }

    async createStageTelemectrics(stage: StageDto): Promise<Stage> {
        const newStage = new this.stageModel(stage);
        return newStage.save();
    }

    async createTelemetrics(telemetrics: TelemetricsDto): Promise<Telemetrics> {
        const newTelemetrics = new this.telemetricsModel(telemetrics);
        return newTelemetrics.save();
    }

    async getTelemetrics(): Promise<Telemetrics[]> {
        return this.telemetricsModel.find().exec();
    }

    async getLastTelemetrics(): Promise<Telemetrics> {
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

    async getLastStage(): Promise<Stage> {
        // get the size of the collection
        const data = await this.stageModel.countDocuments()
        .then((count) => {
            if (count === 0) {
                return Promise.reject('No documents found');
            }
            else {
                return this.stageModel.findOne().sort({$natural:-1}).limit(1);        
            }
        });
        return data;
    }


    async clearTelemetrics(): Promise<any> {
        return this.telemetricsModel.deleteMany({}).exec();
    }
}