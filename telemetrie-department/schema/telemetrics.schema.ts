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
    stages: Array<{ id: number, fuel: number }>;

    @Prop({ required: true })
    altitude: number;

    @Prop({ required: true, type: Object })
    payload: { passengers: number, altitude: number, weight: number}

    @Prop({ required: true })
    timestamp: string;
}

export const TelemetricsSchema = SchemaFactory.createForClass(Telemetrics);