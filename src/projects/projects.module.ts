import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity/project.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
  TypeOrmModule.forFeature([ProjectEntity]),
  AuthModule,
],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
