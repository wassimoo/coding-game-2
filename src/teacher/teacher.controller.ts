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
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@ApiTags('teachers')
@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Teacher',
    description: 'Creates a new teacher with the provided details.',
  })
  @ApiResponse({ status: 201, description: 'Teacher successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List Teachers',
    description: 'Retrieves a list of all teachers.',
  })
  @ApiResponse({ status: 200, description: 'List of teachers.' })
  findAll() {
    return this.teacherService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Teacher',
    description: 'Retrieves a teacher by their ID.',
  })
  @ApiResponse({ status: 200, description: 'Teacher information.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid teacher ID. Must be a number.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teacherService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Teacher',
    description: 'Updates a teacher with the provided data.',
  })
  @ApiResponse({ status: 200, description: 'Teacher successfully updated.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or teacher ID.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teacherService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Teacher',
    description: 'Deletes a teacher by their ID.',
  })
  @ApiResponse({ status: 200, description: 'Teacher successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Invalid teacher ID.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teacherService.remove(id);
  }

  @Get(':id/students')
  @ApiOperation({
    summary: "List Teacher's Students",
    description: 'Retrieves all students assigned to a specific teacher.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of students for the teacher.',
  })
  @ApiResponse({ status: 400, description: 'Invalid teacher ID.' })
  getStudents(@Param('id', ParseIntPipe) id: number) {
    return this.teacherService.getStudents(id);
  }
}
