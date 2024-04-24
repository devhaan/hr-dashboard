import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  eventTitle: string;

  @Prop({ default: 'NA' })
  eventDescription: string;

  @Prop({ required: true })
  eventType: string;

  @Prop({ required: true })
  eventEndDate: Date;

  @Prop({ required: true })
  eventUniqueId: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
