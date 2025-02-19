import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@ApiTags('lessons')
@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post('teacher')
  @ApiOperation({
    summary: 'Teacher Creates Lesson',
    description: 'Allows a teacher to create and immediately confirm a lesson.',
  })
  @ApiResponse({
    status: 201,
    description: 'Lesson successfully created and confirmed by teacher.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  createLessonByTeacher(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.createLessonByTeacher(createLessonDto);
  }

  @Post('student')
  @ApiOperation({
    summary: 'Student Requests Lesson',
    description: 'Allows a student to request a lesson (pending confirmation).',
  })
  @ApiResponse({
    status: 201,
    description: 'Lesson successfully requested by student.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  requestLessonByStudent(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.requestLessonByStudent(createLessonDto);
  }

  @Patch(':id/confirm')
  @ApiOperation({
    summary: 'Confirm Lesson',
    description: 'Allows a teacher to confirm a lesson request.',
  })
  @ApiResponse({ status: 200, description: 'Lesson successfully confirmed.' })
  @ApiResponse({ status: 400, description: 'Invalid lesson ID.' })
  confirmLesson(@Param('id', ParseIntPipe) id: number) {
    return this.lessonService.confirmLesson(id);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({
    summary: "List Teacher's Lessons",
    description: 'Retrieves all lessons associated with a teacher.',
  })
  @ApiResponse({ status: 200, description: 'List of lessons for the teacher.' })
  @ApiResponse({ status: 400, description: 'Invalid teacher ID.' })
  getLessonsByTeacher(@Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.lessonService.findLessonsByTeacher(teacherId);
  }

  @Get('student/:studentId')
  @ApiOperation({
    summary: "List Student's Lessons",
    description: 'Retrieves all lessons associated with a student.',
  })
  @ApiResponse({ status: 200, description: 'List of lessons for the student.' })
  @ApiResponse({ status: 400, description: 'Invalid student ID.' })
  getLessonsByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.lessonService.findLessonsByStudent(studentId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Lesson',
    description: 'Updates the details of an existing lesson.',
  })
  @ApiResponse({ status: 200, description: 'Lesson successfully updated.' })
  @ApiResponse({ status: 400, description: 'Invalid input data or lesson ID.' })
  updateLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonService.updateLesson(id, updateLessonDto);
  }
}
