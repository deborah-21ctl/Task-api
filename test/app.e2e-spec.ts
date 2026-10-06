import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { HttpExceptionFilter } from './../src/common/filters/http-exception/http-exception.filter.js';

describe('Task API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  // TEST 1: Register and Login
  it('should register a user and login successfully', async () => {
    const email = `e2e-${Date.now()}@example.com`;
    const password = 'Password123';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password,
      })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      })
      .expect(201);

    expect(loginResponse.body.access_token).toBeDefined();
  });

  // TEST 2: Unauthorized access
  it('should reject access without token', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  // TEST 3: Create and Fetch Task
  it('should create and fetch a task', async () => {
    const email = `e2e-${Date.now()}@example.com`;
    const password = 'Password123';

    // Register
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password,
      })
      .expect(201);

    // Login
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      })
      .expect(201);

    const token = loginResponse.body.access_token;

    // Create project
    const projectResponse = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'E2E Test Project',
        description: 'Project created during E2E testing',
      })
      .expect(201);

    const projectId = projectResponse.body.id;

    // Create task
    const taskResponse = await request(app.getHttpServer())
      .post(`/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'E2E Test Task',
        description: 'Task created during E2E testing',
        status: 'TODO',
        dueDate: '2026-12-31T00:00:00.000Z',
      })
      .expect(201);

    const taskId = taskResponse.body.id;

    // Fetch task
    const fetchResponse = await request(app.getHttpServer())
      .get(`/projects/${projectId}/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(fetchResponse.body.id).toBe(taskId);
    expect(fetchResponse.body.title).toBe('E2E Test Task');
  });

  afterEach(async () => {
    await app.close();
  });
});
