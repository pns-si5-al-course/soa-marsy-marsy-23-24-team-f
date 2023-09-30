import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class RocketService {
    constructor(private readonly httpService: HttpService) {}

    private rocketStatus: string = "unknown";

    async destroyRocket(): Promise<void> {
        try {
            await this.httpService.post('http://rocket-object-service:3005/rocket/destroy').toPromise();
            console.log("Sent destroy command.");
        } catch (error) {
            throw new Error("Failed to send destroy command.");
        }
    }

    async recordRocketFailure(status: string): Promise<void> {
        this.rocketStatus = status;
        console.log("Rocket status recorded as:", status);
    }

    async getCurrentRocketStatus(): Promise<{ status: string }> {
        return { status: this.rocketStatus };
    }
}