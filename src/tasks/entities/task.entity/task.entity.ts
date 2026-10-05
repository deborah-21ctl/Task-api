import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import { ProjectEntity } from '../../../projects/entities/project.entity/project.entity.js';

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @ManyToOne(() => ProjectEntity)
  project: ProjectEntity;
}