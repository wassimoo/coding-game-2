/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TeacherController (e2e)', () => {
  let app: INestApplication;
  let createdTeacherId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Enable global validation
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Valid Scenarios', () => {
    it('POST /teachers - should create a teacher', async () => {
      const teacherDto = {
        firstName: 'Alice',
        lastName: 'Doe',
        password: 'password123',
        instrument: 'Piano',
        experience: 5,
      };

      const response = await request(app.getHttpServer())
        .post('/teachers')
        .send(teacherDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('id');
      expect(response.body.firstName).toBe(teacherDto.firstName);
      createdTeacherId = response.body.id;
    });

    it('GET /teachers - should return an array of teachers', async () => {
      const response = await request(app.getHttpServer())
        .get('/teachers')
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('GET /teachers/:id - should return the created teacher', async () => {
      const response = await request(app.getHttpServer())
        .get(`/teachers/${createdTeacherId}`)
        .expect(HttpStatus.OK);

      expect(response.body.id).toBe(createdTeacherId);
    });

    it('PATCH /teachers/:id - should update teacher details', async () => {
      const updateDto = { instrument: 'Guitar', experience: 7 };

      const response = await request(app.getHttpServer())
        .patch(`/teachers/${createdTeacherId}`)
        .send(updateDto)
        .expect(HttpStatus.OK);

      expect(response.body.instrument).toBe(updateDto.instrument);
      expect(response.body.experience).toBe(updateDto.experience);
    });

    it('GET /teachers/:id/students - should return an empty array initially', async () => {
      const response = await request(app.getHttpServer())
        .get(`/teachers/${createdTeacherId}/students`)
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('DELETE /teachers/:id - should delete the teacher', async () => {
      await request(app.getHttpServer())
        .delete(`/teachers/${createdTeacherId}`)
        .expect(HttpStatus.OK);

      // try to fetch the deleted teacher (should return 404 or similar)
      await request(app.getHttpServer())
        .get(`/teachers/${createdTeacherId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('Invalid Scenarios', () => {
    it('POST /teachers - should return 400 for invalid input', async () => {
      const invalidTeacherDto = {
        lastName: 'Doe',
        password: 'password123',
        instrument: 'Piano',
        experience: 5,
      };

      await request(app.getHttpServer())
        .post('/teachers')
        .send(invalidTeacherDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('GET /teachers/:id - should return 400 for invalid ID', async () => {
      await request(app.getHttpServer())
        .get('/teachers/invalid-id')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('PATCH /teachers/:id - should return 400 for invalid ID', async () => {
      const updateDto = { instrument: 'Guitar', experience: 7 };

      await request(app.getHttpServer())
        .patch('/teachers/invalid-id')
        .send(updateDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('DELETE /teachers/:id - should return 400 for invalid ID', async () => {
      await request(app.getHttpServer())
        .delete('/teachers/invalid-id')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('GET /teachers/:id/students - should return 400 for invalid ID', async () => {
      await request(app.getHttpServer())
        .get('/teachers/invalid-id/students')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('GET /teachers/:id - should return 404 for non-existent teacher', async () => {
      await request(app.getHttpServer())
        .get('/teachers/99999')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('PATCH /teachers/:id - should return 404 for non-existent teacher', async () => {
      const updateDto = { instrument: 'Guitar', experience: 7 };

      await request(app.getHttpServer())
        .patch('/teachers/99999')
        .send(updateDto)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('DELETE /teachers/:id - should return 404 for non-existent teacher', async () => {
      await request(app.getHttpServer())
        .delete('/teachers/99999')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('GET /teachers/:id/students - should return 404 for non-existent teacher', async () => {
      await request(app.getHttpServer())
        .get('/teachers/99999/students')
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
