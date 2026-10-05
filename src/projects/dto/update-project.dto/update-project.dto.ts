import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'Website redesign', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: 'Plan and track the website redesign.' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;
}
