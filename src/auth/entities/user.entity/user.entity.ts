import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Role } from '../../enums/role.enum.js';

@Entity()
export class UserEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'ebun@example.com' })
  @Column({ type: 'varchar', unique: true })
  email: string;

  @ApiHideProperty()
  @Column({ type: 'varchar' })
  password: string;

  @ApiProperty({ example: 'USER' })
  @Column({ type: 'varchar', default: 'USER' })
  role: Role;

  @ApiHideProperty()
  @Column({ type: 'varchar', nullable: true })
  resetPasswordOtp: string | null;

  @ApiHideProperty()
  @Column({ type: 'varchar', nullable: true })
  resetPasswordOtpExpiresAt: Date | null;
}
