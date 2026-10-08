import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../../../auth/entities/user.entity/user.entity.js';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ProjectEntity {
  @ApiProperty({ example: 1, description: 'Unique project identifier.' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Website redesign', maxLength: 100 })
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty({
    example: 'Plan and track the website redesign.',
    description: 'Description of the project.',
  })
  @Column({ type: 'varchar' })
  description: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
