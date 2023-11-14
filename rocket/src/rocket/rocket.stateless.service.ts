import { Inject, Injectable } from "@nestjs/common";
import { PublisherService } from '../publisher/publisher.service';
import { Rocket} from '../entities/rocket.entity';
import { Stage } from "../entities/stage.entity";
import { RocketSimulation } from "../entities/rocket.simulation.entity";


// const landingSequence = {
//     "Flip maneuver": 3,  
//     "Entry burn":5,
//     "Guidance": 5, 
//     "Landing burn": 5,  
//     "Landing legs deployed": 5,
//     "Landing":3
//   }

Injectable()
export class RocketStatelessService {
    private rocketSim: RocketSimulation = new RocketSimulation();
    constructor(private publisherService : PublisherService) {}

    async getPositionAt(rocket: Rocket, t: number): Promise<Rocket> {
        this.rocketSim.positionAt(rocket, t);
        await this.sendTelemetryData('rocket.telemetrics.topic', rocket);
        await this.sendTelemetryData('payload.telemetrics.topic', rocket.payload);
        await this.sendTelemetryData('logs.topic', rocket);
        return rocket;
    }  

    async getStageAt(stage: Stage, t: number): Promise<Stage> {
        this.rocketSim.stageAt(stage, t);
        await this.sendTelemetryData('rocket.telemetrics.topic', stage);
        await this.sendTelemetryData('logs.topic', stage);
        return stage;
    }

    async receiveStatusUpdate(rocket: Rocket, status: string, time: number): Promise<Rocket> {
        switch(status) {
            case "Rocket preparation":
            case "Rocket on internal power":
            case "Startup":
            case "Main engine start":
                break;
            case "Main engine cut-off":
                rocket.a = 0;
                break
            case "Liftoff":  
                rocket.a = 11.77;
                break;
            case "In flight":
                rocket.a = 29.43;
                break;
            case "Stage separation":
                rocket.stages = rocket.stages.filter(s => s.id !== 0);
                rocket.a = 0;
                break;
            case "MaxQ":
                rocket.a = 24.53;
                break;
            case "Second engine start":
                rocket.a = 29.43;
                break;
            case "Fairing separation":
            case "Second engine cut-off":
                rocket.a = 0;
                break;          
            case "Payload deployed":
                rocket.a = 0;
                break;
            case "First Stage Separation Failed":
                break;
            case "Wrong orbit":
                break;
            default:
                break;
            }
            this.rocketSim.positionAt(rocket, 0);
            rocket.status = status;
            rocket.payload.status = status;
            await this.sendTelemetryData('rocket.telemetrics.topic', rocket);
            await this.sendTelemetryData('payload.telemetrics.topic', rocket.payload);
            await this.sendTelemetryData('logs.topic', rocket);
            return rocket;
    }

    async receiveStageStatusUpdate(stage: Stage, status: string, time: number): Promise<Stage> {
        switch (status) {
            case "Flip maneuver":
            case "Entry burn":
            case "Guidance":
            case "Landing burn":
            case "Landing legs deployed":
            case "Landing":
              break;
            default:
              break;
            }
            stage.status = status;
            return stage;
    }


    async sendTelemetryData(topic:string, data?: any): Promise<void> {
        await this.publisherService.sendTelemetrics(topic, data);
    }
}