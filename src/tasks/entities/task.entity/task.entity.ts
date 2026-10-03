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

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  status: string;

  @Column()
  dueDate: Date;

  @ManyToOne(() => ProjectEntity)
  project: ProjectEntity;
}