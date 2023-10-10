export class Rocket {
    
    name: string;
    status: string;
    stages: Array<{ id: number, fuel: number, altitude: number, status: string, speed: number }>;
    altitude: number;
    payload: { passengers: number, altitude: number, speed:number, status:string, weight: number};
    timestamp: string;

    constructor(name: string, status: string, stages: Array<{ id: number, fuel: number, altitude: number, status: string, speed: number }>, altitude: number, payload: { passengers: number, altitude: number, speed:number, status:string, weight: number}, timestamp: string) {
        this.name = name;
        this.status = status;
        this.stages = stages;
        this.altitude = altitude;
        this.payload = payload;
        this.timestamp = timestamp;
    }
}