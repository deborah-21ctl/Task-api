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

  async findAll(userId: number) {
  return this.projectRepository.find({
    where: {
      user: {
        id: userId,
      },
    },
  });
}

  async create(dto: CreateProjectDto, userId: number) {
    const project = this.projectRepository.create({
      ...dto,
      user: { id: userId }, // Associate the project with the user
    });
    return this.projectRepository.save(project);
  }

  async findOne(id: number, userId: number) {
    const project = await this.projectRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: number, dto: UpdateProjectDto, userId: number) {
  const project = await this.findOne(id, userId);
  Object.assign(project, dto);

  return this.projectRepository.save(project);
}



 async remove(id: number, userId: number) {
  const project = await this.findOne(id, userId);

  await this.projectRepository.remove(project);

  return {
    message: 'Project deleted successfully',
  };
}
}
