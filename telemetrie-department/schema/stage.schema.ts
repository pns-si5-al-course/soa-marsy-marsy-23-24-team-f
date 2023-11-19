import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TelemetricsDocument = HydratedDocument<Stage>;

@Schema()
export class Stage {
    @Prop({ required: true })
    id: number;

    @Prop({ required: true })
    fuel: number;

    @Prop({ required: true })
    altitude: number;

    @Prop({ required: true })
    status: string;

    @Prop({ required: true })
    speed: number;

    @Prop({ required: true })
    v0: number;

    @Prop({ required: true })
    s0: number;

    @Prop({ required: true })
    a: number;

    @Prop({ required: true })
    time: number;
}

export const StageSchema = SchemaFactory.createForClass(Stage);