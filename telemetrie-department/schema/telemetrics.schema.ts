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
    stages: Array<{ id: number, fuel: number, altitude: number, status: string, speed: number }>;

    @Prop({ required: true })
    altitude: number;

    @Prop({ required: true, type: Object })
    payload: { passengers: number, altitude: number, speed:number, status:string, weight: number}

    @Prop({ required: true })
    timestamp: string;

    @Prop({ required: true })
    v0: number;

    @Prop({ required: true })
    a: number;

    @Prop({ required: true })
    m: number;

    @Prop({ required: true })
    angle: number;

    @Prop({ required: true })
    time: number;

    @Prop({ required: true })
    scenario: number;
}

export const TelemetricsSchema = SchemaFactory.createForClass(Telemetrics);