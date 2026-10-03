import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity/task.entity.js';
import { TasksService } from './tasks.service.js';
import { TasksController } from './tasks.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity]),
  ],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {
    
}