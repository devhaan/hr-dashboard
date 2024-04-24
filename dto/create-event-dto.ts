// src/events/dtos/create-event.dto.ts
import { IsString, IsNotEmpty, IsDate, IsEnum } from 'class-validator';
import { EventType } from '../enums/event.enum';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  eventTitle: string;

  @IsString()
  eventDescription: string;

  @IsNotEmpty()
  @IsEnum(EventType)
  eventType : EventType
}
