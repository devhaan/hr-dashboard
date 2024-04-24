import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task-dto';
import { CreateTaskDto } from './dto/create-task-dto';
import { Task } from './schemas/tasks.schemas';
import { Event } from './schemas/event.schemas';
import { UpdateEventDto } from './dto/update-event-dto';
import { CreateEventDto } from './dto/create-event-dto';
import { TaskService } from './services/task.service';
import { EventService } from './services/event.service';
import { FeedbackService } from './services/feedback.service';
import { Feedback } from './schemas/Feedback.schemas';
import { CreateFeedbackDto } from './dto/create-Feedback-dto';
import { UpdateFeedbackDto } from './dto/update-Feedback-dto';

const ObjectId = mongoose.Types.ObjectId;
@Resolver('HrDashboardResolver')
export class HrDashboardResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly eventService: EventService,
    private readonly feedbackService: FeedbackService,
  ) {}

  @Query(() => [Task])
  async getTasks(
    @Args('page', { type: () => Int! }) page: number,
    @Args('limit', { type: () => Int! }) limit: number,
    @Args('taskStatus', { type: () => String }) taskStatus: string,
    @Args('taskType', { type: () => String }) taskType: string,
    @Args('startDate', { type: () => String }) startDate: string,
    @Args('endDate', { type: () => Int }) endDate: string,
  ): Promise<Task[]> {
    return this.taskService.getTasks({
      page,
      limit,
      startDate,
      endDate,
      taskStatus,
      taskType,
    });
  }

  @Query(() => Task)
  async getTaskById(@Args('id', { type: () => ID }) id: string): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Mutation(() => Task)
  async createTask(
    @Args('createTaskDto') createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @Mutation(() => Task)
  async updateTask(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateTaskDto') updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Mutation(() => Task)
  async deleteTask(@Args('id', { type: () => ID }) id: string): Promise<Task> {
    return this.taskService.deleteTask(id);
  }

  //Events

  @Query(() => [Event])
  async getEvents(
    @Args('page', { type: () => Int! }) page: number,
    @Args('limit', { type: () => Int! }) limit: number,
    @Args('startDate', { type: () => String }) startDate: string,
    @Args('endDate', { type: () => String }) endDate: string,
    @Args('eventType', { type: () => String }) eventType: string,
  ): Promise<Event[]> {
    return this.eventService.getEvents({
      page,
      limit,
      startDate,
      endDate,
      eventType,
    });
  }

  @Query(() => Event)
  async getEventById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Event> {
    return this.eventService.getEventById(id);
  }

  @Mutation(() => Event)
  async createEvent(
    @Args('createEventDto') createEventDto: CreateEventDto,
  ): Promise<Event> {
    return this.eventService.createEvent(createEventDto);
  }

  @Mutation(() => Event)
  async updateEvent(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateEventDto') updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventService.updateEvent(id, updateEventDto);
  }

  @Mutation(() => Event)
  async deleteEvent(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Event> {
    return this.eventService.deleteEvent(id);
  }

  //Feedbacks

  @Query(() => [Feedback])
  async getFeedbacks(
    @Args('page', { type: () => Int! }) page: number,
    @Args('limit', { type: () => Int! }) limit: number,
    @Args('startDate', { type: () => String }) startDate: string,
    @Args('endDate', { type: () => String }) endDate: string,
  ): Promise<Feedback[]> {
    return this.feedbackService.getFeedbacks({
      page,
      limit,
      startDate,
      endDate,
    });
  }

  @Query(() => Feedback)
  async getFeedbackById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Feedback> {
    return this.feedbackService.getFeedbackById(id);
  }

  @Mutation(() => Feedback)
  async createFeedback(
    @Args('createFeedbackDto') createFeedbackDto: CreateFeedbackDto,
  ): Promise<Feedback> {
    return this.feedbackService.createFeedback(createFeedbackDto);
  }

  @Mutation(() => Feedback)
  async updateFeedback(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateFeedbackDto') updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    return this.feedbackService.updateFeedback(id, updateFeedbackDto);
  }

  @Mutation(() => Feedback)
  async deleteFeedback(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Feedback> {
    return this.feedbackService.deleteFeedback(id);
  }
}
