import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Users } from 'aws-sdk/clients/budgets';
import mongoose, { HydratedDocument } from 'mongoose';
export type FeedbackDocument = HydratedDocument<Feedback>;

// Define a class for the nested feedback objects
class FeedbackDetails {
  @Prop({ required: true })
  regardingTeamWelcoming: string;

  @Prop({ required: true })
  trainingModule: string;

  @Prop({ required: true })
  NotClearUnderstandingAboutWorkRole: string;

  @Prop({ required: true })

  regardingColleague: string;

  @Prop({ required: true })

  companyCulture: string;
}

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ required: true })
  feedbackFirst: FeedbackDetails;

  @Prop({ required: false })
  feedbackSecond: FeedbackDetails;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  newJoin: Users;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
