import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsArray, IsNumber, isNotEmpty, IsNotEmptyObject } from 'class-validator';

// id: number;
//     fuel: number;
//     altitude: number;
//     status: string;
//     speed: number;
//     v0: number;
//     a: number;


export class StageDto {
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
