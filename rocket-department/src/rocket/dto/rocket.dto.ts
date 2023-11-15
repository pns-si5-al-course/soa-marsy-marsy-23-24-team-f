import { IsString, IsArray, ValidateNested, IsNumber, IsObject, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';
import { StageDTO } from './stage.dto'
import { PayloadDTO } from './payload.dto';

export class RocketDTO {
    
    @IsString()
    name: string;

    @IsString()
    status: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StageDTO)
    stages: StageDTO[];

    @IsNumber()
    altitude: number;

    @IsObject()
    @ValidateNested()
    @Type(() => PayloadDTO)
    payload: PayloadDTO;

    @IsISO8601()
    timestamp: string;

    @IsNumber()
    v0: number;

    @IsNumber()
    a: number;

    @IsNumber()
    m: number;

    @IsNumber()
    angle: number;

    @IsNumber()
    time: number;
}
