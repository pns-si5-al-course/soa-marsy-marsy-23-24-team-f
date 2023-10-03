import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TelemetricsDocument = HydratedDocument<Telemetrics>;

@Schema()
export class Telemetrics {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    status: string;

    @Prop({ required: true, type: Array })
    stages: Array<{ id: number, fuel: number, altitude: number, status: string }>;

    @Prop({ required: true })
    altitude: number;

    @Prop({ required: true, type: Object })
    payload: { passengers: number, altitude: number, speed:number, status:string, weight: number}

    @Prop({ required: true })
    timestamp: string;

    @Prop({ required: true })
    speed: number;

}

export const TelemetricsSchema = SchemaFactory.createForClass(Telemetrics);