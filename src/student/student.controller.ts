import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@ApiTags('students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Student',
    description: 'Creates a new student with the provided details.',
  })
  @ApiResponse({ status: 201, description: 'Student successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List Students',
    description: 'Retrieves a list of all students.',
  })
  @ApiResponse({ status: 200, description: 'List of students.' })
  findAll() {
    return this.studentService.getAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Student',
    description: 'Retrieves a student by their ID.',
  })
  @ApiResponse({ status: 200, description: 'Student information.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid student ID. Must be a number.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Student',
    description: 'Updates a student with the provided data.',
  })
  @ApiResponse({ status: 200, description: 'Student successfully updated.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or student ID.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Student',
    description: 'Deletes a student by their ID.',
  })
  @ApiResponse({ status: 200, description: 'Student successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Invalid student ID.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.remove(id);
  }

  @Patch(':id/assign')
  @ApiOperation({
    summary: 'Assign Teacher',
    description: 'Assigns a teacher to a student.',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher successfully assigned to the student.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or student ID.',
  })
  assignTeacher(
    @Param('id', ParseIntPipe) studentId: number,
    @Body('teacherId') teacherId: number,
  ) {
    return this.studentService.assignTeacher(studentId, teacherId);
  }
}
