import { IsString, IsNumber} from 'class-validator';

export class PayloadDTO {
    @IsNumber()
    passengers: number;

    @IsNumber()
    altitude: number;

    @IsNumber()
    speed: number;

    @IsString()
    status: string;

    @IsNumber()
    weight: number;
}