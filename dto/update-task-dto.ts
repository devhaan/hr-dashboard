// src/tasks/dtos/update-task.dto.ts
import { IsOptional, IsString, IsDate, IsEnum } from 'class-validator';
import { TaskStatus, TaskType } from '../enums/task.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  taskTitle: string;

  @IsOptional()
  @IsString()
  taskDescription: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  taskStatus: TaskStatus;

  @IsOptional()
  @IsEnum(TaskType)
  taskType: TaskType;

  @IsOptional()
  @IsDate()
  taskEndDate: Date;

  @IsOptional()
  @IsString()
  taskUniqueId: string;

  @IsOptional()
  taskAssignedTo: string; // Assuming it's a user ID
}
