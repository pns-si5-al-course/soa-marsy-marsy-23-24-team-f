import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PayloadTelemetricsDocument = HydratedDocument<PayloadTelemetrics>;

@Schema()
export class PayloadTelemetrics {

    @Prop()
    passengers: number;

    @Prop()
    altitude: number; 

    @Prop()
    speed:number;

    @Prop()
    status:string;

    @Prop()
    weight: number;

}

export const PayloadTelemetricsSchema = SchemaFactory.createForClass(PayloadTelemetrics);