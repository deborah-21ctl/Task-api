import {Body, Controller,Get, Post, Param, Patch, Delete} from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import { CreateProjectDto } from './dto/create-project.dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto/update-project.dto.js';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}




    @Get()
    findAll() {
        return this.projectsService.findAll();
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectsService.findOne(Number(id));
    }

    @Post()
    create(@Body() dto: CreateProjectDto) {
        return this.projectsService.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: string,
    @Body() dto: UpdateProjectDto) {
        // Implementation for updating a project
    return this.projectsService.update(Number(id), dto);     
       
    }
    @Delete(':id')
    remove(@Param('id') id: string) {
        
        return this.projectsService.remove(Number(id));
    }

    
}
