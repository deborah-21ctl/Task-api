import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ProjectEntity } from '../../../projects/entities/project.entity/project.entity.js';

@Entity()
export class TaskEntity {
  @ApiProperty({ example: 1, description: 'Unique task identifier.' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Fix server issue' })
  @Column({ type: 'varchar' })
  title: string;

  @ApiPropertyOptional({ example: 'Investigate the server outage' })
  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ApiProperty({ enum: ['TODO', 'IN_PROGRESS', 'DONE'], example: 'TODO' })
  @Column({ type: 'varchar' })
  status: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-10-10T00:00:00.000Z',
  })
  @Column({ type: 'timestamp' })
  dueDate: Date;

  @ApiProperty({ type: () => ProjectEntity, description: 'Parent project.' })
  @ManyToOne(() => ProjectEntity)
  project: ProjectEntity;
}