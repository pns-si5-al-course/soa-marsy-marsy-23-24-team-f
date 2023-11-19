import { RocketDTO } from "./Rocket.dto";
import { IsString, IsNumber} from 'class-validator';
import { ApiTags, ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

@ApiTags('ReadyToLaunch')
export class ReadyToLaunchDTO {

    @ApiProperty()
    @Type(() => RocketDTO)
    rocket: RocketDTO;

    @ApiProperty()
    @IsString()
    weatherDepartmentStatus: string;

    @ApiProperty()
    @IsString()
    rocketDepartmentStatus: string;
}