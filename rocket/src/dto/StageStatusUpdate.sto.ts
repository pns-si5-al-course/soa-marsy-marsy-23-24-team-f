import { ApiBody, ApiTags, ApiProperty } from '@nestjs/swagger';
import { Stage } from '../entities/stage.entity';

export class StageStatusUpdateDto {
    @ApiProperty()
    stage: Stage;
  
    @ApiProperty()
    status: string;
  }