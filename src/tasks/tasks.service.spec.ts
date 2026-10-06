
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service.js';
import { TaskStatus } from './dto/create-task.dto/create-task.dto.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity/task.entity.js';
import { vi } from 'vitest';

describe('TasksService', () => {
  let service: TasksService;
  let repository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,

        {
          provide: getRepositoryToken(TaskEntity),
          useValue: {
            find: vi.fn(),
            findOne: vi.fn(),
            create: vi.fn(),
            save: vi.fn(),
            remove: vi.fn(),

            manager: {
              findOne: vi.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get(getRepositoryToken(TaskEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new task', async () => {
    repository.manager.findOne.mockResolvedValue({
      id: 1,
    });

    repository.create.mockReturnValue({
      id: 1,
      title: 'Fix server',
      description: 'Investigate server issue',
      status: 'TODO',
      dueDate: new Date('2026-10-10'),
      project: {
        id: 1,
      },
    });

    repository.save.mockResolvedValue({
      id: 1,
      title: 'Fix server',
      description: 'Investigate server issue',
      status: 'TODO',
      dueDate: new Date('2026-10-10'),
      project: {
        id: 1,
      },
    });

    const result = await service.create(
      1,
      {
        title: 'Fix server',
        description: 'Investigate server issue',
      status: TaskStatus.TODO,
        dueDate: '2026-10-10',
      },
      1,
    );

    expect(result.title).toBe('Fix server');
  });
});

