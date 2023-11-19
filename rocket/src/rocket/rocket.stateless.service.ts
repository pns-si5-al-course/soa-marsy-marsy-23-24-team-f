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
        
    }

    getPositionAt(rocket: Rocket, t: number, s0: number): void {
        this.rocketSim.positionAt(rocket, t, s0);
    }  

    getStageAt(stage: Stage, t: number): void {
        this.rocketSim.stageAt(stage, t);
    }

    async receiveStatusUpdate(satusUpdate: StatusUpdateDto): Promise<Rocket | Stage> {
        let status = satusUpdate.status;
        let rocket = satusUpdate.rocket;
        console.log(status);
        if(status === "Destruct")
            console.log("Destruct received !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        
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
                this.updateAndPush(rocket, status, 0, true);
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
                        rocket.v0 = this.rocketSim.velocityAt(rocket, rocket.time);
                        rocket = await this.updateAndPush(rocket, status, rocket.altitude);
                    }
                    if(rocket.scenario === 3 && rocket.stages[0].fuel > 800 && rocket.stages[0].fuel <= 1700){
                        // fuel tank leak
                        rocket.stages[0].fuel = 800;
                    }
                    break;
                } else {
                    if ( rocket.status.length > 1){
                        rocket = await this.updateAndPush(rocket, status, rocket.altitude);
                        console.log(rocket)
                    } else{
                        break;
                    }
                }
            case "Main engine cut-off":
                rocket.a = 0;
                rocket.v0 = this.rocketSim.velocityAt(rocket, rocket.time);
                status = "Main engine cut-off";
                rocket = await this.updateAndPush(rocket, status, rocket.altitude);
                console.log("Main engine cut-off required")
            case "Stage separation":
                if(rocket.status !== "Main engine cut-off") {
                    throw new Error("Main engine is still running");
                }
                console.log("Booster altitude : "+ rocket.altitude)
                if(rocket.scenario === 2){
                    status = "First Stage Separation Failed";
                    rocket = await this.updateAndPush(rocket, status, 0);
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
                //rocket = await this.updateAndPush(rocket, status);
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
                rocket.v0 = this.rocketSim.velocityAt(rocket, rocket.time);
                rocket = await this.updateAndPush(rocket, status, rocket.altitude);          
            case "Payload deployed":
                if (rocket.status !== "Second engine cut-off") {
                    throw new Error("Second engine is still running");
                }
                status = "Payload deployed";
                rocket.a = 0;
                rocket.v0 = this.rocketSim.velocityAt(rocket, rocket.time);
                break;
            case "First Stage Separation Failed":
                rocket.a = 0;
                rocket.v0 = this.rocketSim.velocityAt(rocket, rocket.time);
                break;
            case "Wrong orbit":
                break;
            case "Destruct":
                rocket.a = 0;
                rocket.v0 = this.rocketSim.velocityAt(rocket, rocket.time);
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
            this.updateAndPush(rocket, status, 0);
            return rocket;
        }
        
        async updateAndPush(rocket: Rocket, status: string, s0: number, MainEngineStart?: boolean){
            rocket = this.rocketSim.positionAt(rocket, rocket.time, s0);

            console.log("----------New update----------");
            console.log(rocket)
            console.log("------------------------------");

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
                if (stage.speed < 0){
                    stage.a += 2;
                    stage.fuel -= 1;
                } else if (stage.speed >= 0){
                    stage.a = 0;
                }
                stage.altitude -= 2000;
                break;
            case "Guidance":
                stage.a = 0;
                stage.altitude -= 100;
                stage.fuel -= 1;
                break;
            case "Landing burn":
                if (Math.abs(stage.speed) > 0){
                    stage.a += 9.81*3;
                    stage.fuel -= 1;
                } else if (stage.speed >= 0){
                    stage.a = 0;
                }
                stage.altitude -= 15;
                if(stage.altitude <= 0){
                    stage.altitude = 0;
                }
                break;
            case "Landing legs deployed":
                if(Math.abs(stage.speed) > 40) {
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
            if(stage.status != "Entry burn" &&  stage.status !="Guidance" && stage.status != "Landing burn")
                this.rocketSim.stageAt(stage, stage.time);
            console.log("Stage altitude : "+stage.altitude);
            await this.publisherService.sendTelemetrics('rocket.telemetrics.topic', stage);
            await this.publisherService.sendTelemetrics('logs.topic', stage);
            return stage;
    }
}