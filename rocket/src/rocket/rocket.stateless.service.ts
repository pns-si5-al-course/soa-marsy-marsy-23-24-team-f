import { Inject, Injectable } from "@nestjs/common";
import { PublisherService } from '../publisher/publisher.service';
import { Rocket} from '../entities/rocket.entity';
import { Stage } from "../entities/stage.entity";
import { RocketSimulation } from "../entities/rocket.simulation.entity";

Injectable()
export class RocketStatelessService {
    private rocketSim: RocketSimulation = new RocketSimulation();
    constructor(@Inject(PublisherService) private publisherService : PublisherService) {
        console.log(this.publisherService)
    }

    getPositionAt(rocket: Rocket, t: number): void {
        this.rocketSim.positionAt(rocket, t);
    }  

    getStageAt(stage: Stage, t: number): void {
        this.rocketSim.stageAt(stage, t);
    }

    async receiveStatusUpdate(rocket: Rocket, status: string): Promise<Rocket> {
        switch(status) {
            case "Rocket preparation":
            case "Rocket on internal power":
            case "Startup":
                break;
            case "Main engine cut-off":
                rocket.a = 0;
                break
            case "Main engine start":
            case "Liftoff":  
                rocket.a = 11.77;
                break;
            case "In flight":
                rocket.a = 29.43;
                break;
            case "Stage separation":
                rocket.stages[0].a = -9.81;
                rocket.stages[0].status = "Separated";
                rocket.stages[0].altitude = rocket.altitude;
                rocket.stages[0].v0 = rocket.stages[0].speed
                rocket.stages[0].s0 = rocket.stages[0].altitude;
                rocket.stages[0].time = 0;
                this.receiveStageStatusUpdate(rocket.stages[0], "Separated", rocket.stages[0].time);
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
                rocket.a = 0;
                break;
            case "Wrong orbit":
                break;
            case "Destruct":
                rocket.a = 0;
                rocket.payload.speed = 0;
                rocket.status = "Destruct";
                rocket.stages.forEach(s => {
                    s.status = "Destruct";
                    s.a = 0;
                    s.speed = 0;
                })
                break;
            default:
                break;
            }
            this.rocketSim.positionAt(rocket, rocket.time);
            rocket.status = status;
            rocket.payload.status = status;
            rocket.stages.forEach(stage => {
                stage.status = status;
                stage.a = rocket.a;
                stage.time = rocket.time;
            })
            await this.publisherService.sendTelemetrics('rocket.telemetrics.topic', rocket);
            await this.publisherService.sendTelemetrics('payload.telemetrics.topic', rocket.payload);
            await this.publisherService.sendTelemetrics('logs.topic', rocket);
            return rocket;
    }

    async receiveStageStatusUpdate(stage: Stage, status: string, time: number): Promise<Stage> {
        switch (status) {
            case "Flip maneuver":
                break;
            case "Entry burn":
                stage.a = -9.81;
            case "Guidance":
                break;
            case "Landing burn":
                stage.a = -9.81*3;
                break;
            case "Landing legs deployed":
                break;
            case "Landing":
                stage.a = 0;
                break;
            default:
              break;
            }
            stage.status = status;
            this.rocketSim.stageAt(stage, time);
            await this.publisherService.sendTelemetrics('rocket.telemetrics.topic', stage);
            return stage;
    }
}