/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('LessonController (e2e)', () => {
  let app: INestApplication;
  let teacherId: number;
  let studentId: number;
  let teacherLessonId: number;
  let studentLessonId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Enable global validation
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Create a teacher for lesson tests
    const teacherResponse = await request(app.getHttpServer())
      .post('/teachers')
      .send({
        firstName: 'LessonTeacher',
        lastName: 'Test',
        password: 'teachpass',
        instrument: 'Drums',
        experience: 15,
      })
      .expect(HttpStatus.CREATED);
    teacherId = teacherResponse.body.id;

    // Create a student for lesson tests
    const studentResponse = await request(app.getHttpServer())
      .post('/students')
      .send({
        firstName: 'LessonStudent',
        lastName: 'Test',
        password: 'studpass',
        instrument: 'Flute',
      })
      .expect(HttpStatus.CREATED);
    studentId = studentResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Valid Scenarios', () => {
    it('POST /lessons/teacher - should create a confirmed lesson by teacher', async () => {
      const startTime = new Date().toISOString();
      const endTime = new Date(Date.now() + 3600000).toISOString(); // +1 hour

      const response = await request(app.getHttpServer())
        .post('/lessons/teacher')
        .send({
          teacherId,
          studentId,
          startTime,
          endTime,
          type: 'single',
        })
        .expect(HttpStatus.CREATED);

      teacherLessonId = response.body.id;
      expect(response.body.status).toBe('confirmed');
    });

    it('POST /lessons/student - should create a lesson request by student', async () => {
      const startTime = new Date().toISOString();
      const endTime = new Date(Date.now() + 7200000).toISOString(); // +2 hours

      const response = await request(app.getHttpServer())
        .post('/lessons/student')
        .send({
          teacherId,
          studentId,
          startTime,
          endTime,
          type: 'regular',
        })
        .expect(HttpStatus.CREATED);

      studentLessonId = response.body.id;
      expect(response.body.status).toBe('requested');
    });

    it('PATCH /lessons/:id/confirm - should confirm a requested lesson', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/lessons/${studentLessonId}/confirm`)
        .expect(HttpStatus.OK);

      expect(response.body.status).toBe('confirmed');
    });

    it('GET /lessons/teacher/:teacherId - should list lessons for the teacher', async () => {
      const response = await request(app.getHttpServer())
        .get(`/lessons/teacher/${teacherId}`)
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBe(true);
      const lessonIds = response.body.map((lesson) => lesson.id);
      expect(lessonIds).toEqual(
        expect.arrayContaining([teacherLessonId, studentLessonId]),
      );
    });

    it('GET /lessons/student/:studentId - should list lessons for the student', async () => {
      const response = await request(app.getHttpServer())
        .get(`/lessons/student/${studentId}`)
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBe(true);
      const lessonIds = response.body.map((lesson) => lesson.id);
      expect(lessonIds).toEqual(
        expect.arrayContaining([teacherLessonId, studentLessonId]),
      );
    });

    it('PATCH /lessons/:id - should update lesson details', async () => {
      const newStartTime = new Date(Date.now() + 1800000).toISOString(); // +30 minutes

      const response = await request(app.getHttpServer())
        .patch(`/lessons/${teacherLessonId}`)
        .send({
          startTime: newStartTime,
          type: 'regular',
        })
        .expect(HttpStatus.OK);

      expect(response.body.startTime).toBe(newStartTime);
      expect(response.body.type).toBe('regular');
    });
  });

  describe('Invalid Scenarios', () => {
    it('POST /lessons/teacher - should return 400 for invalid input', async () => {
      const invalidLessonDto = {
        teacherId,
        studentId,
        startTime: 'invalid-date',
        endTime: 'invalid-date',
        type: 'single',
      };

      await request(app.getHttpServer())
        .post('/lessons/teacher')
        .send(invalidLessonDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('POST /lessons/student - should return 400 for invalid input', async () => {
      const invalidLessonDto = {
        teacherId,
        studentId,
        startTime: 'invalid-date',
        endTime: 'invalid-date',
        type: 'regular',
      };

      await request(app.getHttpServer())
        .post('/lessons/student')
        .send(invalidLessonDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('PATCH /lessons/:id/confirm - should return 404 for non-existent lesson', async () => {
      await request(app.getHttpServer())
        .patch('/lessons/99999/confirm')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('GET /lessons/teacher/:teacherId - should return 404 for non-existent teacher', async () => {
      await request(app.getHttpServer())
        .get('/lessons/teacher/99999')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('GET /lessons/student/:studentId - should return 404 for non-existent student', async () => {
      await request(app.getHttpServer())
        .get('/lessons/student/99999')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('PATCH /lessons/:id - should return 404 for non-existent lesson', async () => {
      const newStartTime = new Date(Date.now() + 1800000).toISOString(); // +30 minutes

      await request(app.getHttpServer())
        .patch('/lessons/99999')
        .send({
          startTime: newStartTime,
          type: 'regular',
        })
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
