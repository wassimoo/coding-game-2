import { IsNumber, IsDateString, IsEnum } from 'class-validator';

export enum LessonTypeEnum {
  SINGLE = 'single',
  REGULAR = 'regular',
}

export class CreateLessonDto {
  @IsNumber()
  teacherId: number;

  @IsNumber()
  studentId: number;

  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;

  @IsEnum(LessonTypeEnum)
  type: LessonTypeEnum;
}
