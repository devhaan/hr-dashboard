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
import { UpdateFeedbackDto } from '../dto/update-Feedback-dto';
import { CreateFeedbackDto } from '../dto/create-Feedback-dto';
import { FeedbackDocument } from '../schemas/Feedback.schemas';
import { Feedback } from '../schemas/Feedback.schemas';
import { JobScheduledService } from './jobScheduler.service';
const ObjectId = Types.ObjectId;
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name)
    private feedbackModel: Model<FeedbackDocument>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  async createFeedback(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
   
    const createdFeedback = new this.feedbackModel(createFeedbackDto);
    try {
      this.logger.log(
        'Feedback Create request For',
        JSON.stringify(createdFeedback),
      );
      console.log(createFeedbackDto['FeedbackEndDate']);
      const createdTaskResponse = await createdFeedback.save();
      return createdTaskResponse;
    } catch (error) {
      this.logger.log(
        'Feedback Create request Failed',
        error,
        JSON.stringify(createFeedbackDto),
      );
    }
  }


  async getFeedbacks(query: any): Promise<Feedback[]> {
    const { page, limit, startDate, endDate, FeedbackType } = query;
    const skip = (page - 1) * limit;
    let findQueryObject = {};

    if (FeedbackType) {
      findQueryObject['taskType'] = FeedbackType;
    }
    if (startDate && endDate) {
      findQueryObject['createdAt'] = {
        $gte: new Date(startDate).setUTCHours(0, 0, 0, 0),
        $lte: new Date(endDate).setUTCHours(0, 0, 0, 0),
      };
    }
    try {
      return this.feedbackModel
        .find(findQueryObject)
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      this.logger.log('Failed to create Feedback', error);
    }
  }

  async getFeedbackById(id: string): Promise<Feedback> {
    return this.feedbackModel.findById(id).exec();
  }

  async updateFeedback(
    id: string,
    updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    return this.feedbackModel
      .findByIdAndUpdate(id, updateFeedbackDto, { new: true })
      .exec();
  }

  async deleteFeedback(id: string): Promise<Feedback> {
    return this.feedbackModel.findByIdAndRemove(id).exec();
  }
}
