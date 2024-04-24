/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Configuration } from 'openai/dist/configuration';
import { Inject } from '@nestjs/common/decorators';
import { UserService } from '../user/user.service';
import { Model, Types, PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/tasks.schemas';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { UpdateEventDto } from './dto/update-event-dto';
import { CreateEventDto } from './dto/create-event-dto';
import { EventDocument } from './schemas/event.schemas';
import { Event } from './schemas/event.schemas';
const ObjectId = Types.ObjectId;
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
@Injectable()
export class HrDashboardService {
    constructor(
        @InjectModel(Task.name)
        private taskModel: Model<TaskDocument>,
        @InjectModel(Event.name)
        private eventModel: Model<EventDocument>,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
        private readonly userService: UserService,
      ) { }
    
      async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const createdTask = new this.taskModel(createTaskDto);
        return createdTask.save();
      }
    
      async getTasks(): Promise<Task[]> {
        return this.taskModel.find().exec();
      }
    
      async getTaskById(id: string): Promise<Task> {
        return this.taskModel.findById(id).exec();
      }
    
      async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
        return this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true }).exec();
      }
    
      async deleteTask(id: string): Promise<Task> {
        return this.taskModel.findByIdAndRemove(id).exec();
      }

      //events

      async createEvent(createEventDto: CreateEventDto): Promise<Event> {
        const createdTask = new this.eventModel(createEventDto);
        return createdTask.save();
      }
    
      async getEvents(): Promise<Event[]> {
        return this.eventModel.find().exec();
      }
    
      async getEventById(id: string): Promise<Event> {
        return this.eventModel.findById(id).exec();
      }
    
      async updateEvent(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
        return this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true }).exec();
      }
    
      async deleteEvent(id: string): Promise<Event> {
        return this.eventModel.findByIdAndRemove(id).exec();
      }
}
