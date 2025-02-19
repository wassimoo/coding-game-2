import { IsNumber, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum LessonTypeEnum {
  SINGLE = 'single',
  REGULAR = 'regular',
}

export class CreateLessonDto {
  @ApiProperty({ description: 'ID of the teacher' })
  @IsNumber()
  teacherId: number;

  @ApiProperty({ description: 'ID of the student' })
  @IsNumber()
  studentId: number;

  @ApiProperty({ description: 'Start time of the lesson in ISO8601 format' })
  @IsDateString()
  startTime: Date;

  @ApiProperty({ description: 'End time of the lesson in ISO8601 format' })
  @IsDateString()
  endTime: Date;

  @ApiProperty({ enum: LessonTypeEnum, description: 'Type of the lesson' })
  @IsEnum(LessonTypeEnum)
  type: LessonTypeEnum;
}
