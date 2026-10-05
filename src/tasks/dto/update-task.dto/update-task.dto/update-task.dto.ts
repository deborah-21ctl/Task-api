import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { TaskStatus } from '../../create-task.dto/create-task.dto.js';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    example: 'Fix server issue',
    description: 'The updated title of the task',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'Investigate the server outage',
    description: 'The updated description of the task',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.DONE,
    description: 'The updated status of the task',
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    example: '2026-10-10',
    description: 'The updated due date of the task',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
