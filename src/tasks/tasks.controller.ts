import { Controller, Post, Body, Param , Get, Patch, Delete} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto.js';
import { TasksService } from './tasks.service.js';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto/update-task.dto.js';

@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(
      Number(projectId),
      dto,
    );
  }

    @Get()
    findAll(@Param('projectId') projectId: string) {
        return this.tasksService.findAll(Number(projectId));
    }

    @Get(':taskId')
    findOne(
        @Param('projectId') projectId: string,
        @Param('taskId') taskId: string,
    ) {
        return this.tasksService.findOne(
            Number(projectId),
            Number(taskId),
        );
    }

    @Patch(':taskId')
    update(
        @Param('projectId') projectId: string,
        @Param('taskId') taskId: string,
        @Body() dto: UpdateTaskDto,
    ) {
        return this.tasksService.update(
            Number(projectId),
            Number(taskId),
            dto,
        );
    }

    @Delete(':taskId')
    remove(
        @Param('projectId') projectId: string,
        @Param('taskId') taskId: string,
    ) {
        return this.tasksService.remove(
            Number(projectId),
            Number(taskId),
        );
    }
}