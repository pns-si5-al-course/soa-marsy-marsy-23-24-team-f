
export class Stage {
    id: number;
    fuel: number;
    altitude: number;
    status: string;
    speed: number;
    v0: number;
    s0: number;
    a: number;
    time: number;

    constructor(id: number, fuel: number, altitude: number, status: string, speed: number, v0: number, s0: number, a: number, time: number) {
        this.id = id;
        this.fuel = fuel;
        this.altitude = altitude;
        this.status = status;
        this.speed = speed;
        this.v0 = v0;       // initial velocity
        this.s0 = s0;       // initial position
        this.a = a;
        this.time = time;
    }
    
}