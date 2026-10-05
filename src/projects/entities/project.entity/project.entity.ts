import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../../../auth/entities/user.entity/user.entity.js';

@Entity()
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

 @Column({ type: 'varchar' })
description: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
