// src/events/dtos/update-event.dto.ts
import { IsOptional, IsString, IsDate, IsEnum } from 'class-validator';
import {  EventType } from '../enums/event.enum';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  eventTitle: string;

  @IsOptional()
  @IsString()
  eventDescription: string;

  @IsOptional()
  @IsEnum(EventType)
  eventType: EventType;

  @IsOptional()
  @IsDate()
  eventEndDate: Date;

  @IsOptional()
  @IsString()
  eventUniqueId: string;
}
