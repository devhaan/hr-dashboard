import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AgencyModule } from '../agency/agency.module';
import { ClientModule } from '../client/client.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/tasks.schemas';
import { Event, EventSchema } from './schemas/event.schemas';
import { HrDashboardResolver } from './hr-dashboard.resolver';
import { TaskService } from './services/task.service';
import { EventService } from './services/event.service';
import { JobScheduledService } from './services/jobScheduler.service';
import {
  JobScheduledEvent,
  JobScheduledEventSchema,
} from './schemas/jobScheduledEvents.schemas';
import { Feedback, FeedbackSchema } from './schemas/Feedback.schemas';
import { FeedbackService } from './services/feedback.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([
      { name: JobScheduledEvent.name, schema: JobScheduledEventSchema },
    ]),
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
    ]),
    UserModule,
  ],
  providers: [
    HrDashboardResolver,
    TaskService,
    EventService,
    JobScheduledService,
    FeedbackService,
  ],
  exports: [
    HrDashboardResolver,
    TaskService,
    EventService,
    JobScheduledService,
    FeedbackService,
  ],
})
export class HrDashboardModule {}
