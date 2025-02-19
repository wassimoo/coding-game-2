import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Teacher } from '../teacher/teacher.entity';
import { Student } from '../student/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Teacher, Student])],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
