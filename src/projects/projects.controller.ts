import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import { CreateProjectDto } from './dto/create-project.dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto/update-project.dto.js';
import type { AuthRequest } from '../auth/types/auth-request/auth-request.interface.js';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProjectEntity } from './entities/project.entity/project.entity.js';

@ApiBearerAuth('access-token')
@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({
    summary: 'List your projects',
    description: 'Returns only projects owned by the authenticated user.',
  })
  @ApiOkResponse({
    description: 'Projects owned by the authenticated user.',
    type: ProjectEntity,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'The access token is invalid or expired.',
  })
  @ApiUnauthorizedResponse({
    description: 'A bearer access token is missing, invalid, or expired.',
  })
  @Get()
  findAll(@Req() request: AuthRequest) {
    return this.projectsService.findAll(request.user.sub);
  }

  @ApiOperation({
    summary: 'Get a project',
    description: 'Returns a project owned by the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Project ID.',
  })
  @ApiOkResponse({
    description: 'The requested project.',
    type: ProjectEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The access token is invalid or expired.',
  })
  @ApiUnauthorizedResponse({
    description: 'A bearer access token is missing, invalid, or expired.',
  })
  @ApiNotFoundResponse({ description: 'The project was not found.' })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: AuthRequest) {
    return this.projectsService.findOne(Number(id), request.user.sub);
  }

  @ApiOperation({
    summary: 'Create a project',
    description: 'Creates a project owned by the authenticated user.',
  })
  @ApiCreatedResponse({
    description: 'The project was created successfully.',
    type: ProjectEntity,
  })
  @ApiBadRequestResponse({ description: 'The request body failed validation.' })
  @ApiUnauthorizedResponse({
    description: 'The access token is invalid or expired.',
  })
  @ApiUnauthorizedResponse({
    description: 'A bearer access token is missing, invalid, or expired.',
  })
  @Post()
  create(@Body() dto: CreateProjectDto, @Req() request: AuthRequest) {
    return this.projectsService.create(dto, request.user.sub);
  }

  @ApiOperation({
    summary: 'Update a project',
    description:
      'Updates the supplied project fields. Omitted fields remain unchanged.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Project ID.',
  })
  @ApiOkResponse({ description: 'The updated project.', type: ProjectEntity })
  @ApiBadRequestResponse({ description: 'The request body failed validation.' })
  @ApiUnauthorizedResponse({
    description: 'The access token is invalid or expired.',
  })
  @ApiUnauthorizedResponse({
    description: 'A bearer access token is missing, invalid, or expired.',
  })
  @ApiNotFoundResponse({ description: 'The project was not found.' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @Req() request: AuthRequest,
  ) {
    return this.projectsService.update(Number(id), dto, request.user.sub);
  }

  @ApiOperation({
    summary: 'Delete a project',
    description:
      'Permanently deletes a project owned by the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Project ID.',
  })
  @ApiOkResponse({
    description: 'Confirmation that the project was deleted.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Project deleted successfully' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'The access token is invalid or expired.',
  })
  @ApiUnauthorizedResponse({
    description: 'A bearer access token is missing, invalid, or expired.',
  })
  @ApiNotFoundResponse({ description: 'The project was not found.' })
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: AuthRequest) {
    return this.projectsService.remove(Number(id), request.user.sub);
  }
}
