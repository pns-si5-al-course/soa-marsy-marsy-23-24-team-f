import { IsObject, IsString } from "class-validator";
import { RocketDTO } from "./Rocket.dto";
import { ApiProperty, ApiTags } from '@nestjs/swagger';

ApiTags('AnomalyReport')
export class AnomalyReportDTO {
    @ApiProperty()
    @IsObject()
    rocket: RocketDTO;

    @ApiProperty()
    @IsString()
    anomaly: string;
  }
  