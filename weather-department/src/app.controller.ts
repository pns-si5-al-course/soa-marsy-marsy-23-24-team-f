import { Controller, Get, HttpCode } from "@nestjs/common";

@Controller("weather")
export class WeatherController {
    
    @Get()
    @HttpCode(200)
    getWeatherStatus() {
        return { status: "ok" };
    }
}
