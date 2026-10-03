import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './entities/task.entity/task.entity.js';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto/update-task.dto.js';
import { ProjectEntity } from '../projects/entities/project.entity/project.entity.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async create(projectId: number, dto: CreateTaskDto, userId: number) {
    
    const project = await this.taskRepository.manager.findOne(ProjectEntity, {
      where: {
        id: projectId,
        user: {
          id: userId,
        },
      },
    });
    if (!project) {
      throw new NotFoundException('Project not found or you do not have access to this project');
    }

    const task = this.taskRepository.create({

        title: dto.title,
        description: dto.description,
        status: dto.status,
        dueDate: new Date(dto.dueDate),
      project: {
        id: project.id,
      },
    });



    return this.taskRepository.save(task);
  }

   async update(
  projectId: number,
  taskId: number,
  dto: UpdateTaskDto,
  userId: number,
) {
  const task = await this.findOne(projectId, taskId, userId);

  if (!task) {
    throw new NotFoundException('Task not found');
  }

  if (dto.title !== undefined) {
    task.title = dto.title;
  }

  if (dto.description !== undefined) {
    task.description = dto.description;
  }

  if (dto.status !== undefined) {
    task.status = dto.status;
  }

  if (dto.dueDate !== undefined) {
    task.dueDate = new Date(dto.dueDate);
  }

  return this.taskRepository.save(task);
}

async remove(projectId: number, taskId: number, userId: number) {
  const task = await this.findOne(projectId, taskId, userId);
if (!task) {
    throw new NotFoundException('Task not found');
  }
  await this.taskRepository.remove(task);

  return {
    message: 'Task deleted successfully',
  };
}
  
  async findAll(projectId: number, userId: number, page: number = 1, limit: number = 10) {
  const project = await this.taskRepository.manager.findOne(ProjectEntity, {
    where: {
      id: projectId,
      user: {
        id: userId,
      },
    },
  });

  if (!project) {
    throw new NotFoundException(
      'Project not found or you do not have access to this project',
    );

  }
 const skip = (page - 1) * limit;

const tasks = await this.taskRepository.find({
  where: {
    project: {
      id: projectId,
    },
  },

  skip,
  take: limit,
});

return tasks;
  }
  
  async findOne(
  projectId: number,
  taskId: number,
  userId: number,
) {
  const task = await this.taskRepository.findOne({
    where: {
      id: taskId,
      project: {
        id: projectId,
        user: {
          id: userId,
        },
      },
    },
  });

  if (!task) {
    throw new NotFoundException('Task not found');
  }

  return task;
}
}
