import {Body, Controller,Get, Post, Param, Patch, Delete,Req, UseGuards} from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import { CreateProjectDto } from './dto/create-project.dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto/update-project.dto.js';
import type { AuthRequest } from '../auth/types/auth-request/auth-request.interface.js';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard.js';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('projects')
@UseGuards(JwtGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}




    @Get()
    findAll(@Req() request: AuthRequest) {
        return this.projectsService.findAll(request.user.sub);
    }
    @Get(':id')
findOne(
    @Param('id') id: string,
    @Req() request: AuthRequest,
) {
    return this.projectsService.findOne(
        Number(id),
        request.user.sub,
    );
}

@Post()
create(
  @Body() dto: CreateProjectDto,
  @Req() request: AuthRequest,
) {
  return this.projectsService.create(dto, request.user.sub);
}

   @Patch(':id')
update(
  @Param('id') id: string,
  @Body() dto: UpdateProjectDto,
  @Req() request: AuthRequest,
) {
  return this.projectsService.update(
    Number(id),
    dto,
    request.user.sub,
  );
}
    @Delete(':id')
remove(
  @Param('id') id: string,
  @Req() request: AuthRequest,
) {
  return this.projectsService.remove(
    Number(id),
    request.user.sub,
  );
}
    
}
