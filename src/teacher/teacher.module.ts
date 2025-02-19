import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';
import { Student } from '../student/student.entity';
import { Lesson } from '../lesson/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Student, Lesson])],
  providers: [TeacherService],
  controllers: [TeacherController],
})
export class TeacherModule {}
