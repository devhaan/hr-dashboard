/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Configuration } from 'openai/dist/configuration';
import { Inject } from '@nestjs/common/decorators';
import { UserService } from '../../user/user.service';
import { Model, Types, PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../schemas/tasks.schemas';
import { CreateTaskDto } from '../dto/create-task-dto';
import { UpdateTaskDto } from '../dto/update-task-dto';
import { uuid } from 'uuid';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly userService: UserService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      this.logger.log('creating Task For ', JSON.stringify(createTaskDto));
      const createdTask = new this.taskModel(createTaskDto);
      return createdTask.save();
    } catch (error) {
      this.logger.log('Failed to create Task', error);
    }
  }

  async getTasks(query: any): Promise<Task[]> {
    const { page, limit, taskStatus, startDate, endDate, taskType } = query;
    let findQueryObject = {};
    if (taskStatus) {
      findQueryObject['taskStatus'] = taskStatus;
    }
    if (taskType) {
      findQueryObject['taskType'] = taskType;
    }
    if (startDate && endDate) {
      findQueryObject['createdAt'] = {
        $gte: new Date(startDate).setUTCHours(0, 0, 0, 0),
        $lte: new Date(endDate).setUTCHours(0, 0, 0, 0),
      };
    }
    const skip = (page - 1) * limit;
    try {
      return this.taskModel
        .find(findQueryObject)
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      this.logger.log('Failed to fetch Task', error);
    }
  }

  async getTaskById(id: string): Promise<Task> {
    return this.taskModel.findById(id).exec();
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
  }

  async deleteTask(id: string): Promise<Task> {
    return this.taskModel.findByIdAndRemove(id).exec();
  }
}
