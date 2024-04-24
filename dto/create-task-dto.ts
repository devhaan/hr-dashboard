// src/tasks/dtos/create-task.dto.ts
import { IsString, IsNotEmpty, IsDate, IsEnum } from 'class-validator';
import { TaskStatus, TaskType } from '../enums/task.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  taskTitle: string;

  @IsString()
  taskDescription: string;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  taskStatus: TaskStatus;

  @IsNotEmpty()
  @IsEnum(TaskType)
  taskType : TaskType
}
