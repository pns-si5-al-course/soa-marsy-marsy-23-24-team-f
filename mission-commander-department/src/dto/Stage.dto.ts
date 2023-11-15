import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class StageDTO {
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsNumber()
    fuel: number;

    @ApiProperty()
    @IsNumber()
    altitude: number;

    @ApiProperty()
    @IsString()
    status: string;

    @ApiProperty()
    @IsNumber()
    speed: number;

    @ApiProperty()
    @IsNumber()
    v0: number;

    @ApiProperty()
    @IsNumber()
    s0: number;

    @ApiProperty()
    @IsNumber()
    a: number;

    @ApiProperty()
    @IsNumber()
    time: number;
}