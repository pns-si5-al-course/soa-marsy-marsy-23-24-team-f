import { Controller, Get, HttpCode } from "@nestjs/common";

@Controller("payload")
export class PayloadController {
    
    @Get()
    @HttpCode(200)
    getPayloadStatus() {
        return { status: "ok" };
    }
}