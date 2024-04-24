import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type JobScheduledEventDocument = HydratedDocument<JobScheduledEvent>;

@Schema({ timestamps: true })
export class JobScheduledEvent {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cronExpression: string;
}

export const JobScheduledEventSchema = SchemaFactory.createForClass(JobScheduledEvent);
