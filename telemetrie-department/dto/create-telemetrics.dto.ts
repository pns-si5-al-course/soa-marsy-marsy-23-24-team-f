import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsArray, IsNumber, isNotEmpty, IsNotEmptyObject } from 'class-validator';

export class TelemetricsDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @ApiProperty({
    description: 'List of stages',
    type: [
      {
        id: { type: 'number', description: 'Stage ID' },
        fuel: { type: 'number', description: 'Fuel level' },
        altitude: { type: 'number', description: 'Altitude' },
        status: { type: 'string', description: 'Status' },
        speed: { type: 'number', description: 'Speed' },
      },
    ],
  })
  @IsArray()
  readonly stages: Array<{
    id: number;
    fuel: number;
    altitude: number;
    status: string;
    speed: number;
  }>;

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
}
