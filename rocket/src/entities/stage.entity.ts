
export class Stage {
    id: number;
    fuel: number;
    altitude: number;
    status: string;
    speed: number;
    v0: number;
    a: number;

    constructor(id: number, fuel: number, altitude: number, status: string, speed: number, v0: number, a: number) {
        this.id = id;
        this.fuel = fuel;
        this.altitude = altitude;
        this.status = status;
        this.speed = speed;
        this.v0 = v0;
        this.a = a;
    }
    
}