import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

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

  @ApiHideProperty()
  @Column({ type: 'varchar', nullable: true })
  resetPasswordOtp: string | null;

  @ApiHideProperty()
  @Column({ type: 'varchar', nullable: true })
  resetPasswordOtpExpiresAt: Date | null;
}
