import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class CreateTaskDto {
 @ApiProperty({
  example: 'Fix server issue',
  description: 'The title of the task',
})
@IsNotEmpty()
@IsString()
title: string;


  @ApiPropertyOptional({
  example: 'Investigate the server outage',
  description: 'A detailed description of the task',
})
@IsOptional()
@IsString()
description: string;



 @ApiProperty({
  enum: TaskStatus,
  example: TaskStatus.TODO,
  description: 'The current status of the task',
})
@IsEnum(TaskStatus)
status: TaskStatus;

 @ApiProperty({
  example: '2026-10-10',
  description: 'The date the task is due',
})
@IsDateString()
dueDate: string;
}
