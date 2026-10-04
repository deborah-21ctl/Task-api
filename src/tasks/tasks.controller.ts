
import { JwtGuard } from '../auth/guards/jwt/jwt.guard.js';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { AuthRequest } from '../auth/types/auth-request/auth-request.interface.js';

import { Controller, Post, Body, Param , Get, Patch, Delete, UseGuards ,Req,Query} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto.js';
import { TasksService } from './tasks.service.js';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto/update-task.dto.js';

@ApiBearerAuth()
@Controller('projects/:projectId/tasks')
@UseGuards(JwtGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  create(
    @Param('projectId') projectId: string, 
    @Body() dto: CreateTaskDto,
    @Req() request: AuthRequest,
  ) {
    return this.tasksService.create(
      Number(projectId),
      dto,
      request.user.sub,
    );
  }

  

 @Get()
findAll(
  @Param('projectId') projectId: string,
  @Req() request: AuthRequest,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
  @Query('status') status?: string,
 @Query('sort') sort?: string,
) {
  return this.tasksService.findAll(
  Number(projectId),
  request.user.sub,
  Number(page),
  Number(limit),
  status,
  sort,

);
}
    @Get(':taskId')
    findOne(
        @Param('projectId') projectId: string,
        @Param('taskId') taskId: string,
        @Req() request: AuthRequest,
    ) {
        return this.tasksService.findOne(
            Number(projectId),
            Number(taskId),
            request.user.sub,
        );
    }

        @Patch(':taskId')
        update(
            @Param('projectId') projectId: string,
            @Param('taskId') taskId: string,
            @Body() dto: UpdateTaskDto,
            @Req() request: AuthRequest,
        ) {
            return this.tasksService.update(
                Number(projectId),
                Number(taskId),
                dto,
                request.user.sub,
            );
        }

    @Delete(':taskId')
    remove(
        @Param('projectId') projectId: string,
        @Param('taskId') taskId: string,
        @Req() request: AuthRequest,
    ) {
        return this.tasksService.remove(
            Number(projectId),
            Number(taskId),
            request.user.sub,
        );
    }
}