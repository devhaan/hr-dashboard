/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
const schedule = require('node-schedule');
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import { Configuration } from 'openai/dist/configuration';
import { Inject } from '@nestjs/common/decorators';
import { Model, Types, PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateEventDto } from '../dto/update-event-dto';
import { CreateEventDto } from '../dto/create-event-dto';
import { EventDocument } from '../schemas/event.schemas';
import { Event } from '../schemas/event.schemas';
import { JobScheduledService } from './jobScheduler.service';
const ObjectId = Types.ObjectId;
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    @Inject(JobScheduledService)
    private jobScheduledService: JobScheduledService,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    createEventDto['eventUniqueId'] = `${uuidv4()}_${
      createEventDto['eventEndDate'] || new Date()
    }`;
    const createdEvent = new this.eventModel(createEventDto);
    try {
      this.logger.log(
        'Event Create request For',
        JSON.stringify(createdEvent),
      );
      console.log(createEventDto['eventEndDate']);
      const createdTaskResponse = await createdEvent.save();
      // important step do not change or edit without context
      let reminderGap = 8;
      for (let frequency = 0; frequency < 3; frequency++) {
        // console.log(cronExpression);
        await this.jobScheduledService.scheduleAndSaveJob(
          `${createdEvent['eventUniqueId']}_${reminderGap}`,
          new Date(createdEvent['eventEndDate']),
          this.jobScheduledService.sendEventReminder({}),
        );
        reminderGap += 6;
        reminderGap %= 24;
      }

      return createdTaskResponse;
    } catch (error) {
      this.logger.log(
        'Event Create request Failed',
        error,
        JSON.stringify(createEventDto),
      );
    }
  }


  async getEvents(query: any): Promise<Event[]> {
    const { page, limit, startDate, endDate, eventType } = query;
    const skip = (page - 1) * limit;
    let findQueryObject = {};

    if (eventType) {
      findQueryObject['taskType'] = eventType;
    }
    if (startDate && endDate) {
      findQueryObject['createdAt'] = {
        $gte: new Date(startDate).setUTCHours(0, 0, 0, 0),
        $lte: new Date(endDate).setUTCHours(0, 0, 0, 0),
      };
    }
    try {
      return this.eventModel
        .find(findQueryObject)
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      this.logger.log('Failed to create Event', error);
    }
  }

  async getEventById(id: string): Promise<Event> {
    return this.eventModel.findById(id).exec();
  }

  async updateEvent(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();
  }

  async deleteEvent(id: string): Promise<Event> {
    return this.eventModel.findByIdAndRemove(id).exec();
  }
}
