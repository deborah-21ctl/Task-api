import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './entities/task.entity/task.entity.js';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto/update-task.dto.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async create(projectId: number, dto: CreateTaskDto) {
    const task = this.taskRepository.create({

        title: dto.title,
        description: dto.description,
        status: dto.status,
        dueDate: new Date(dto.dueDate),
      project: {
        id: projectId,
      },
    });



    return this.taskRepository.save(task);
  }

   async update(
  projectId: number,
  taskId: number,
  dto: UpdateTaskDto,
) {
  const task = await this.findOne(projectId, taskId);

  if (!task) {
    throw new Error('Task not found');
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

async remove(projectId: number, taskId: number) {
  const task = await this.findOne(projectId, taskId);
if (!task) {
    throw new Error('Task not found');
  }
  await this.taskRepository.remove(task);

  return {
    message: 'Task deleted successfully',
  };
}
  
  async findAll(projectId: number) {
    return this.taskRepository.find({
      where: {
        project: {
          id: projectId,
        },
      },
    });
  }
  async findOne(projectId: number, taskId: number) {
  return this.taskRepository.findOne({
    where: {
      id: taskId,
      project: {
        id: projectId,
      },
    },
  });

//  if (!task) {
//       throw new Error('Task not found');
//     }
//     return task;
//   }
}
}
