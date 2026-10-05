import { JwtGuard } from '../auth/guards/jwt/jwt.guard.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthRequest } from '../auth/types/auth-request/auth-request.interface.js';

import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto.js';
import { TasksService } from './tasks.service.js';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto/update-task.dto.js';

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('projects/:projectId/tasks')
@UseGuards(JwtGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({
    summary: 'Create a task in a project',
    description:
      'Creates a task under the specified project. Requires a bearer access token and access to the project.',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'ID of the project that will contain the task',
    example: 1,
  })
  @ApiCreatedResponse({ description: 'The task was created successfully.' })
  @ApiBadRequestResponse({ description: 'The request body failed validation.' })
  @ApiUnauthorizedResponse({
    description: 'A valid bearer access token is required.',
  })
  @ApiNotFoundResponse({
    description: 'The project does not exist or is not accessible.',
  })
  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto,
    @Req() request: AuthRequest,
  ) {
    return this.tasksService.create(Number(projectId), dto, request.user.sub);
  }

  @ApiOperation({
    summary: 'List tasks in a project',
    description:
      'Returns a page of tasks. You can optionally filter by status and sort by due date.',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'ID of the project whose tasks will be returned',
    example: 1,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    minimum: 1,
    example: 1,
    description: 'Page number (defaults to 1).',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    minimum: 1,
    example: 10,
    description: 'Maximum number of tasks per page (defaults to 10).',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    example: 'TODO',
    description: 'Return only tasks with this status.',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['duedate'],
    example: 'duedate',
    description: 'Use "duedate" to sort by due date, earliest first.',
  })
  @ApiOkResponse({
    description: 'An array of tasks matching the requested page and filters.',
  })
  @ApiBadRequestResponse({ description: 'The query parameters are invalid.' })
  @ApiUnauthorizedResponse({
    description: 'A valid bearer access token is required.',
  })
  @ApiNotFoundResponse({
    description: 'The project does not exist or is not accessible.',
  })
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

  @ApiOperation({
    summary: 'Get a task',
    description: 'Returns one task belonging to the specified project.',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'ID of the project containing the task',
    example: 1,
  })
  @ApiParam({
    name: 'taskId',
    type: Number,
    description: 'ID of the task to retrieve',
    example: 1,
  })
  @ApiOkResponse({ description: 'The task was found.' })
  @ApiUnauthorizedResponse({
    description: 'A valid bearer access token is required.',
  })
  @ApiNotFoundResponse({
    description: 'The task does not exist or is not accessible.',
  })
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

  @ApiOperation({
    summary: 'Update a task',
    description:
      'Updates only the supplied fields. Omitted fields keep their current values.',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'ID of the project containing the task',
    example: 1,
  })
  @ApiParam({
    name: 'taskId',
    type: Number,
    description: 'ID of the task to update',
    example: 1,
  })
  @ApiOkResponse({ description: 'The updated task.' })
  @ApiBadRequestResponse({ description: 'The request body failed validation.' })
  @ApiUnauthorizedResponse({
    description: 'A valid bearer access token is required.',
  })
  @ApiNotFoundResponse({
    description: 'The task does not exist or is not accessible.',
  })
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

  @ApiOperation({
    summary: 'Delete a task',
    description: 'Permanently deletes a task from the specified project.',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'ID of the project containing the task',
    example: 1,
  })
  @ApiParam({
    name: 'taskId',
    type: Number,
    description: 'ID of the task to delete',
    example: 1,
  })
  @ApiOkResponse({ description: 'The task was deleted successfully.' })
  @ApiUnauthorizedResponse({
    description: 'A valid bearer access token is required.',
  })
  @ApiNotFoundResponse({
    description: 'The task does not exist or is not accessible.',
  })
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
