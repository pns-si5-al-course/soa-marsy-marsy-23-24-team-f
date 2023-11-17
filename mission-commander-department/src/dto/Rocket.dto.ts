import { IsString, IsArray, ValidateNested, IsNumber, IsObject, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';
import { StageDTO } from './Stage.dto'
import { ApiTags, ApiProperty } from '@nestjs/swagger';
import { PayloadDTO } from './Payload.dto';

@ApiTags('Rocket')
export class RocketDTO {
    
    @IsString()
    @ApiProperty()
    name: string;

    @IsString()
    @ApiProperty()
    status: string;

    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StageDTO)
    stages: StageDTO[];

    @ApiProperty()
    @IsNumber()
    altitude: number;

    @ApiProperty()
    @IsObject()
    @ValidateNested()
    @Type(() => PayloadDTO)
    payload: PayloadDTO;

    @ApiProperty()
    @IsISO8601()
    timestamp: string;

    @ApiProperty()
    @IsNumber()
    v0: number;

    @ApiProperty()
    @IsNumber()
    a: number;

    @ApiProperty()
    @IsNumber()
    m: number;

    @ApiProperty()
    @IsNumber()
    angle: number;

    @ApiProperty()
    @IsNumber()
    time: number;
}