import { IsEmail, IsNotEmpty, IsString, IsArray, IsNumber, isNotEmpty, IsNotEmptyObject } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
export class PayloadTelemetricsDto {
    @ApiProperty()
    @IsNumber()
    readonly passengers: number;

    @ApiProperty()
    @IsNumber()
    readonly altitude: number; 
    
    @ApiProperty()
    @IsNumber()
    readonly speed:number;
    
    @ApiProperty()
    @IsString()
    readonly status:string;
    
    @ApiProperty()
    @IsNumber()
    readonly weight: number;
}