import { IsString, IsArray, ValidateNested, IsNumber, IsObject, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';
import { StageDTO } from './stage.dto';
import { PayloadDTO } from './payload.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RocketDTO {
    
    @ApiProperty({
      description: 'The name of the rocket',
      example: 'MarsY-1'
    })
    @IsString()
    name: string;

    @ApiProperty({
      description: 'The current status of the rocket',
      example: 'On Ground'
    })
    @IsString()
    status: string;

    @ApiProperty({
      description: 'Array of rocket stages',
      type: [StageDTO],
      example: [
        {
          id: 0,
          fuel: 3000,
          altitude: 0,
          status: "On Ground",
          speed: 0,
          v0: 0,
          s0: 0,
          a: 0,
          time: 0
        },
        {
          id: 1,
          fuel: 3000,
          altitude: 0,
          status: "On Ground",
          speed: 0,
          v0: 0,
          s0: 0,
          a: 0,
          time: 0
        }
      ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StageDTO)
    stages: StageDTO[];

    @ApiProperty({
      description: 'The current altitude of the rocket',
      example: 0
    })
    @IsNumber()
    altitude: number;

    @ApiProperty({
      description: 'The payload of the rocket',
      type: PayloadDTO,
      example: {
        passengers: 0,
        altitude: 0,
        speed: 0,
        status: "Grounded",
        weight: 1000
      }
    })
    @IsObject()
    @ValidateNested()
    @Type(() => PayloadDTO)
    payload: PayloadDTO;

    @ApiProperty({
      description: 'The timestamp of the last status update',
      example: new Date().toISOString()
    })
    @IsISO8601()
    timestamp: string;

    @ApiProperty({
      description: 'The initial velocity of the rocket',
      example: 0
    })
    @IsNumber()
    v0: number;

    @ApiProperty({
      description: 'The current acceleration of the rocket',
      example: 0
    })
    @IsNumber()
    a: number;

    @ApiProperty({
      description: 'The mass of the rocket',
      example: 2000
    })
    @IsNumber()
    m: number;

    @ApiProperty({
      description: 'The angle of the rocket trajectory',
      example: 0
    })
    @IsNumber()
    angle: number;

    @ApiProperty({
      description: 'The time since the last status update',
      example: 0
    })
    @IsNumber()
    time: number;
}
