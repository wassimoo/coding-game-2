import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  // Teacher creates a lesson (auto-confirmed)
  @Post('teacher')
  createLessonByTeacher(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.createLessonByTeacher(createLessonDto);
  }

  // Student requests a lesson
  @Post('student')
  requestLessonByStudent(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.requestLessonByStudent(createLessonDto);
  }

  // Teacher confirms a lesson request
  @Patch(':id/confirm')
  confirmLesson(@Param('id') id: string) {
    return this.lessonService.confirmLesson(+id);
  }

  // Get lessons for a teacher
  @Get('teacher/:teacherId')
  getLessonsByTeacher(@Param('teacherId') teacherId: string) {
    return this.lessonService.findLessonsByTeacher(+teacherId);
  }

  // Get lessons for a student
  @Get('student/:studentId')
  getLessonsByStudent(@Param('studentId') studentId: string) {
    return this.lessonService.findLessonsByStudent(+studentId);
  }

  // Update lesson details
  @Patch(':id')
  updateLesson(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonService.updateLesson(+id, updateLessonDto);
  }
}
