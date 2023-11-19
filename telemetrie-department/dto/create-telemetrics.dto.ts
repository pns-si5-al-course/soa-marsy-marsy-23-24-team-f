import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsArray, IsNumber, isNotEmpty, IsNotEmptyObject } from 'class-validator';
import { Stage } from "../schema/stage.schema";

export class TelemetricsDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @ApiProperty()
  @IsArray()
  readonly stages: Array<Stage>;

  @ApiProperty()
  @IsNumber()
  readonly altitude: number;

  @ApiProperty({
    description: 'Payload information',
    type: 'object',
    properties: {
      passengers: { type: 'number', description: 'Number of passengers' },
      altitude: { type: 'number', description: 'Altitude' },
      speed: { type: 'number', description: 'Speed' },
      status: { type: 'string', description: 'Status' },
      weight: { type: 'number', description: 'Weight' },
    },
  })
  readonly payload: {
    passengers: number;
    altitude: number;
    speed: number;
    status: string;
    weight: number;
  };

  @ApiProperty()
  @IsString()
  readonly timestamp: string;

  @ApiProperty()
  @IsNumber()
  readonly v0: number;

  @ApiProperty()
  @IsNumber()
  readonly a: number;

  @ApiProperty()
  @IsNumber()
  readonly m: number;

  @ApiProperty()
  @IsNumber()
  readonly angle: number;

  @ApiProperty()
  @IsNumber()
  readonly time: number;

  @ApiProperty()
  @IsNumber()
  readonly scenario: number;
}
