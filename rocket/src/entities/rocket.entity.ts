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
    time: number;

    constructor(name: string, 
        status: string, 
        stages: Array<Stage>, 
        altitude: number, 
        payload: { passengers: number, altitude: number, speed:number, status:string, weight: number}, 
        timestamp: string,
        v0: number,
        a: number,
        m: number,
        angle: number, 
        time: number) {
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
        this.time = time;
    }
}


export const RocketExample = new Rocket('MarsY-1', 'On Ground', [
      new Stage(0, 3000, 0, "On Ground", 0, 0, 0, 0, 0),
      new Stage(1, 3000, 0, "On Ground", 0, 0, 0, 0, 0),
    ], 0, {passengers: 0, altitude: 0, status:"Grounded", speed:0, weight: 1000}, 
    new Date().toISOString(),
    0,0,1000+1000,0, 0)
    