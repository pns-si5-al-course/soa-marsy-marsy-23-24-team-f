import { Stage } from "./stage.entity";

export class Rocket {
    
    name: string;
    status: string;
    stages: Array<Stage>;
    altitude: number;
    payload: { passengers: number, altitude: number, speed:number, status:string, weight: number};
    timestamp: string;
    v0: number;
    a: number;
    m: number;
    angle: number;

    constructor(name: string, 
        status: string, 
        stages: Array<Stage>, 
        altitude: number, 
        payload: { passengers: number, altitude: number, speed:number, status:string, weight: number}, 
        timestamp: string,
        v0: number,
        a: number,
        m: number,
        angle: number) {
        this.name = name;
        this.status = status;
        this.stages = stages;
        this.altitude = altitude;
        this.payload = payload;
        this.timestamp = timestamp;
        this.v0 = v0;
        this.a = a;
        this.m = m;
        this.angle = angle;
    }
}