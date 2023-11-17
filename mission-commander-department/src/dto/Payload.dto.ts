import { IsString, IsNumber} from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

ApiTags('Payload')
export class PayloadDTO {
    @ApiProperty()
    @IsNumber()
    passengers: number;

    @ApiProperty()
    @IsNumber()
    altitude: number;

    @ApiProperty()
    @IsNumber()
    speed: number;

    @ApiProperty()
    @IsString()
    status: string;

    @ApiProperty()
    @IsNumber()
    weight: number;
}