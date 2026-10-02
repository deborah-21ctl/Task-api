import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
description: string;
}
