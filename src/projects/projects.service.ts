import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity/project.entity.js';

import { CreateProjectDto } from './dto/create-project.dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  findAll() {
    return this.projectRepository.find();
  }

  async create(dto: CreateProjectDto) {
   const project = this.projectRepository.create(dto);
    return this.projectRepository.save(project);
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

    async update(id: number, dto: UpdateProjectDto) {
    const project =await this.findOne(id);
    Object.assign(project, dto);

    return this.projectRepository.save(project);
  }



async remove(id: number) {
  const project = await this.findOne(id);

  await this.projectRepository.remove(project);

  return {
    message: 'Project deleted successfully',
  };
}

}