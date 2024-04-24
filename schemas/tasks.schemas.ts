import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Users } from 'src/application/user/entities/user.entity';
export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  taskTitle: string;

  @Prop({ default: 'NA'})
  taskDescription: string;

  @Prop({ required: true })
  taskStatus: string;

  @Prop({ required: true })
  taskType: string;

  @Prop({ required: true })
  taskEndDate: Date;

  @Prop()
  taskUniqueId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  taskAssignedTo: Users;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
