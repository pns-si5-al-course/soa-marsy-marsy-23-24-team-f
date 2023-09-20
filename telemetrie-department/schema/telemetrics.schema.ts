import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TelemetricsDocument = HydratedDocument<Telemetrics>;

@Schema()
export class Telemetrics {
    @Prop({ required: true })
    stages: number;

    @Prop({ required: true })
    fuel: number;

    @Prop({ required: true })
    altitude: number;

    @Prop({ required: true })
    timestamp: string;
}

export const TelemetricsSchema = SchemaFactory.createForClass(Telemetrics);