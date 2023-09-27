export class TelemetricsDto {
    readonly name: string;
    readonly status: string;
    readonly stages: Array<{ id: number, fuel: number }>;
    readonly altitude: number;
    readonly payload: { passengers: number, altitude: number, speed:number, status:string, weight: number};
    readonly timestamp: string;
    readonly speed: number;
}