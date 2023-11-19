import { ApiProperty } from '@nestjs/swagger';
import { RocketDTO } from '../dto/rocket.dto';

export class StatusUpdateDto {
    @ApiProperty()
    rocket: RocketDTO;
  
    @ApiProperty()
    status: string;
  }