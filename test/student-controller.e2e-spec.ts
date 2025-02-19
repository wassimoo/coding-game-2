/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  HttpStatus,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Reflector } from '@nestjs/core';

describe('StudentController (e2e)', () => {
  let app: INestApplication;
  let createdStudentId: number;
  let teacherIdForAssignment: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Enable global validation
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    await app.init();

    // Create a teacher to be assigned to the student
    const teacherDto = {
      firstName: 'Teacher',
      lastName: 'One',
      password: 'pass',
      instrument: 'Violin',
      experience: 10,
    };
    const teacherResponse = await request(app.getHttpServer())
      .post('/teachers')
      .send(teacherDto)
      .expect(HttpStatus.CREATED);
    teacherIdForAssignment = teacherResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Valid Scenarios', () => {
    it('POST /students - should create a student', async () => {
      const studentDto = {
        firstName: 'Bob',
        lastName: 'Marley',
        password: 'pass789',
        instrument: 'Guitar',
      };

      const response = await request(app.getHttpServer())
        .post('/students')
        .send(studentDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('id');
      expect(response.body.firstName).toBe(studentDto.firstName);
      createdStudentId = response.body.id;
    });

    it('POST /students - should hash the password and not return it', async () => {
      const studentDto = {
        firstName: 'Alice',
        lastName: 'Wonderland',
        password: 'secret123',
        instrument: 'Piano',
      };

      const response = await request(app.getHttpServer())
        .post('/students')
        .send(studentDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('id');
      expect(response.body.firstName).toBe(studentDto.firstName);
      expect(response.body).not.toHaveProperty('password');

      const studentResponse = await request(app.getHttpServer())
        .get(`/students/${response.body.id}`)
        .expect(HttpStatus.OK);

      expect(studentResponse.body).not.toHaveProperty('password');
    });

    it('GET /students - should return an array of students', async () => {
      const response = await request(app.getHttpServer())
        .get('/students')
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('GET /students/:id - should return the created student', async () => {
      const response = await request(app.getHttpServer())
        .get(`/students/${createdStudentId}`)
        .expect(HttpStatus.OK);

      expect(response.body.id).toBe(createdStudentId);
    });

    it('PATCH /students/:id - should update student details', async () => {
      const updateDto = { instrument: 'Piano' };

      const response = await request(app.getHttpServer())
        .patch(`/students/${createdStudentId}`)
        .send(updateDto)
        .expect(HttpStatus.OK);

      expect(response.body.instrument).toBe(updateDto.instrument);
    });

    it('PATCH /students/:id/assign - should assign a teacher to the student', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/students/${createdStudentId}/assign`)
        .send({ teacherId: teacherIdForAssignment })
        .expect(HttpStatus.OK);

      expect(response.body.assignedTeacher.id).toBe(teacherIdForAssignment);
    });

    it('DELETE /students/:id - should delete the student', async () => {
      await request(app.getHttpServer())
        .delete(`/students/${createdStudentId}`)
        .expect(HttpStatus.OK);

      // Optionally, verify deletion (expecting 404 on fetch)
      await request(app.getHttpServer())
        .get(`/students/${createdStudentId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('Invalid Scenarios', () => {
    it('POST /students - should return 400 for invalid input', async () => {
      const invalidStudentDto = {
        lastName: 'Marley',
        password: 'pass789',
        instrument: 'Guitar',
      };

      await request(app.getHttpServer())
        .post('/students')
        .send(invalidStudentDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('GET /students/:id - should return 400 for invalid ID', async () => {
      await request(app.getHttpServer())
        .get('/students/invalid-id')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('PATCH /students/:id - should return 400 for invalid ID', async () => {
      const updateDto = { instrument: 'Piano' };

      await request(app.getHttpServer())
        .patch('/students/invalid-id')
        .send(updateDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('DELETE /students/:id - should return 400 for invalid ID', async () => {
      await request(app.getHttpServer())
        .delete('/students/invalid-id')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('PATCH /students/:id/assign - should return 400 for invalid ID', async () => {
      await request(app.getHttpServer())
        .patch('/students/invalid-id/assign')
        .send({ teacherId: teacherIdForAssignment })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('GET /students/:id - should return 404 for non-existent student', async () => {
      await request(app.getHttpServer())
        .get('/students/99999')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('PATCH /students/:id - should return 404 for non-existent student', async () => {
      const updateDto = { instrument: 'Piano' };

      await request(app.getHttpServer())
        .patch('/students/99999')
        .send(updateDto)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('DELETE /students/:id - should return 404 for non-existent student', async () => {
      await request(app.getHttpServer())
        .delete('/students/99999')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('PATCH /students/:id/assign - should return 404 for non-existent student', async () => {
      await request(app.getHttpServer())
        .patch('/students/99999/assign')
        .send({ teacherId: teacherIdForAssignment })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('PATCH /students/:id/assign - should return 404 for non-existent teacher', async () => {
      await request(app.getHttpServer())
        .patch(`/students/${createdStudentId}/assign`)
        .send({ teacherId: 99999 })
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
