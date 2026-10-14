import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Role } from '../../enums/role.enum.js';

@Entity()
export class UserEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Jordan Smith' })
  @Column({ type: 'varchar', nullable: true })
  fullName: string | null;

  @ApiProperty({ example: '+14155552671' })
  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string | null;

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

  @ApiProperty({ example: false })
  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @ApiHideProperty()
  @Column({ type: 'varchar', nullable: true })
  emailVerificationOtp: string | null;

  @ApiHideProperty()
  @Column({ type: 'timestamp', nullable: true })
  emailVerificationOtpExpiresAt: Date | null;
}
