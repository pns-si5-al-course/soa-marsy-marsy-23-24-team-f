import { Controller, Get, HttpCode } from "@nestjs/common";

@Controller("rocket")
export class RocketController {
    
    @Get()
    @HttpCode(200)
    getRocketStatus() {
        return { status: "ok" };
    }
}
