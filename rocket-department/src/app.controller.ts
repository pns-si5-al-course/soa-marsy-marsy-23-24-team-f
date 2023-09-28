import { Controller, Get, Post, HttpCode } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller("")
export class AppController {
    constructor(private readonly appService: AppService) {}
    
    @Get()
    @HttpCode(200)
    getRocketStatus() {
        return { status: "ok" };
    }

    @Post('/stop-simulation')
    @HttpCode(200)
    async stopSimulation() {
        const res = await this.appService.stopSimulation()
        return res;
    }
}
