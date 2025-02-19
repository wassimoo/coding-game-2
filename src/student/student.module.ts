import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { Teacher } from '../teacher/teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Teacher])],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
