import { Inject, Injectable } from "@nestjs/common";
import { PublisherService } from '../publisher/publisher.service';
import { Rocket} from '../entities/rocket.entity';
import { Stage } from "../entities/stage.entity";
import { RocketSimulation } from "../entities/rocket.simulation.entity";
import { StatusUpdateDto } from "../dto/StatusUpdate.dto";
import { StageStatusUpdateDto } from "../dto/StageStatusUpdate.sto";

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

    async receiveStatusUpdate(satusUpdate: StatusUpdateDto): Promise<Rocket | Stage> {
        let status = satusUpdate.status;
        let rocket = satusUpdate.rocket;
        console.log(rocket)
        switch(status) {
            case "Rocket preparation":
                if(rocket.time !== 0 || rocket.status !== "On Ground") {
                    throw new Error("Rocket is already launched");
                }
                break;
            case "Rocket on internal power":
                if(rocket.status !== "Rocket preparation") {
                    throw new Error("Rocket is not prepared");
                } else if (rocket.time !== 0) {
                    throw new Error("Rocket is already launched");
                }
                break;
            case "Startup":
                if(rocket.status !== "Rocket on internal power") {
                    throw new Error("Rocket is not on internal power");
                } else if (rocket.time !== 0) {
                    throw new Error("Rocket is already launched");
                }
                break;
            case "Main engine start":
                if(rocket.status !== "Startup") {
                    throw new Error("Rocket is not on internal power");
                } else if (rocket.time !== 0) {
                    throw new Error("Rocket is already launched");
                }
                this.updateAndPush(rocket, status, true);
                break;
            case "Liftoff":  
                if(rocket.status !== "Main engine start") {
                    throw new Error("Main engine is not started");
                } else if (rocket.time !== 0) {
                    throw new Error("Rocket is already launched");
                }
                rocket.a = 11.77;
                break;
            case "MaxQ":
                rocket.a = 24.53;
                break;
            case "In flight":
                if(rocket.stages[0].fuel > 300){
                    rocket.a = 29.43;

                    if (rocket.payload.altitude >= 130_000){
                        // reached target altitude for payload
                        rocket.a = 0;
                        rocket = await this.updateAndPush(rocket, status);
                    }
                    break;
                } else {
                    if ( rocket.status.length > 1){
                        rocket = await this.updateAndPush(rocket, status);
                    } else{
                        break;
                    }
                }
            case "Main engine cut-off":
                rocket.a = 0;
                status = "Main engine cut-off";
                rocket = await this.updateAndPush(rocket, status);
                console.log("Main engine cut-off required")
                console.log(rocket)
            case "Stage separation":
                if(rocket.status !== "Main engine cut-off") {
                    throw new Error("Main engine is still running");
                }
                rocket = this.rocketSim.positionAt(rocket, rocket.time);
                console.log("Booster altitude : "+ rocket.altitude)
                if(rocket.scenario === 2){
                    status = "First Stage Separation Failed";
                    rocket = await this.updateAndPush(rocket, status);
                    rocket.payload.speed = 0;
                    status = "Destruct";
                    rocket.stages.forEach(s => {
                        s.status = "Destruct";
                        s.a = 0;
                        s.speed = 0;
                    })
                    break;
                }
                rocket.stages[0].a = -9.81;
                rocket.stages[0].status = "Separated";
                rocket.stages[0].v0 = rocket.stages[0].speed
                rocket.stages[0].s0 = rocket.altitude;
                rocket.stages[0].time = 0;
                const stageUpdate: StageStatusUpdateDto = {
                    stage: rocket.stages[0],
                    status: "Separated"
                }
                status = "Stage separation";
                rocket.stages = rocket.stages.filter(s => s.id !== 0);
                rocket.a = 0;
                rocket = await this.updateAndPush(rocket, status);
                await this.receiveStageStatusUpdate(stageUpdate);
            case "Second engine start":
                status = "Second engine start";
                rocket.a = 29.43;
                break;
            case "Fairing separation":
                if (rocket.status !== "Second engine start") {
                    throw new Error("Second engine is not started");
                }
                break;
            case "Second engine cut-off":
                rocket.a = 0;
                rocket = await this.updateAndPush(rocket, status);          
            case "Payload deployed":
                if (rocket.status !== "Second engine cut-off") {
                    throw new Error("Second engine is still running");
                }
                status = "Payload deployed";
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
            this.updateAndPush(rocket, status);
            return rocket;
        }
        
        async updateAndPush(rocket: Rocket, status: string, MainEngineStart?: boolean){
            rocket = this.rocketSim.positionAt(rocket, rocket.time);
            rocket.status = status;
            rocket.payload.status = status;
            rocket.stages.forEach(stage => {
                stage.status = status;
                stage.a = rocket.a;
                stage.time = rocket.time;
            })
            let date = new Date();
            if (MainEngineStart){
                date.setSeconds(date.getSeconds() + 60);
            } else {
                date.setSeconds(date.getSeconds() + 1);
            }
            rocket.timestamp = date.toISOString();
            await this.publisherService.sendTelemetrics('rocket.telemetrics.topic', rocket);
            await this.publisherService.sendTelemetrics('payload.telemetrics.topic', rocket.payload);
            await this.publisherService.sendTelemetrics('logs.topic', rocket);
            return rocket;    
        }
        
    async receiveStageStatusUpdate(stageUpdate: StageStatusUpdateDto): Promise<Stage> {
        const status = stageUpdate.status;
        let stage = stageUpdate.stage;
        switch (status) {
            case "Flip maneuver":
                break;
            case "Entry burn":
                stage.a = -9.81;
                break;
            case "Guidance":
                break;
            case "Landing burn":
                stage.a = -9.81*3;
                break;
            case "Landing legs deployed":
                if(stage.speed > 40) {
                    throw new Error("Speed is too high for landing legs deployment");
                }
                stage.status = status;
                this.rocketSim.stageAt(stage, stage.time);
                await this.publisherService.sendTelemetrics('rocket.telemetrics.topic', stage);
                await this.publisherService.sendTelemetrics('logs.topic', stage);
            case "Landing":
                if (stage.status !== "Landing legs deployed") {
                    throw new Error("Landing legs are not deployed");
                }
                stage.a = 0;
                break;
            default:
              break;
            }
            stage.status = status;
            this.rocketSim.stageAt(stage, stage.time);
            console.log("Stage altitude : "+stage.altitude);
            await this.publisherService.sendTelemetrics('rocket.telemetrics.topic', stage);
            await this.publisherService.sendTelemetrics('logs.topic', stage);
            return stage;
    }
}