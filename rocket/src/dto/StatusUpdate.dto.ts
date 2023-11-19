import { ApiBody, ApiTags, ApiProperty } from '@nestjs/swagger';
import { Rocket } from '../entities/rocket.entity';

export class StatusUpdateDto {
    @ApiProperty()
    rocket: Rocket;
  
    @ApiProperty()
    status: string;
  }