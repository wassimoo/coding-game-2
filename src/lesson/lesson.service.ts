import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Teacher } from '../teacher/teacher.entity';
import { Student } from '../student/student.entity';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async createLessonByTeacher(
    createLessonDto: CreateLessonDto,
  ): Promise<Lesson> {
    // Teacher creates and immediately confirms the lesson
    const teacher = await this.teacherRepository.findOne({
      where: { id: createLessonDto.teacherId },
    });
    const student = await this.studentRepository.findOne({
      where: { id: createLessonDto.studentId },
    });
    if (!teacher || !student) {
      throw new NotFoundException('Teacher or Student not found');
    }
    const lesson = this.lessonRepository.create({
      teacher,
      student,
      startTime: createLessonDto.startTime,
      endTime: createLessonDto.endTime,
      type: createLessonDto.type,
      status: 'confirmed',
    });
    return this.lessonRepository.save(lesson);
  }

  async requestLessonByStudent(
    createLessonDto: CreateLessonDto,
  ): Promise<Lesson> {
    // Student requests a lesson (status: requested)
    const teacher = await this.teacherRepository.findOne({
      where: { id: createLessonDto.teacherId },
    });
    const student = await this.studentRepository.findOne({
      where: { id: createLessonDto.studentId },
    });
    if (!teacher || !student) {
      throw new NotFoundException('Teacher or Student not found');
    }
    const lesson = this.lessonRepository.create({
      teacher,
      student,
      startTime: createLessonDto.startTime,
      endTime: createLessonDto.endTime,
      type: createLessonDto.type,
      status: 'requested',
    });
    return this.lessonRepository.save(lesson);
  }

  async confirmLesson(lessonId: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    lesson.status = 'confirmed';
    return this.lessonRepository.save(lesson);
  }

  async findLessonsByTeacher(teacherId: number): Promise<Lesson[]> {
    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId },
    });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    return this.lessonRepository.find({
      where: { teacher: { id: teacherId } },
    });
  }

  async findLessonsByStudent(studentId: number): Promise<Lesson[]> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return this.lessonRepository.find({
      where: { student: { id: studentId } },
    });
  }

  async updateLesson(
    lessonId: number,
    updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson> {
    await this.lessonRepository.update(lessonId, updateLessonDto);
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson;
  }
}
