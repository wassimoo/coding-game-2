import { IsOptional, IsDateString, IsEnum } from 'class-validator';

export enum LessonTypeEnum {
  SINGLE = 'single',
  REGULAR = 'regular',
}

export enum LessonStatusEnum {
  REQUESTED = 'requested',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export class UpdateLessonDto {
  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @IsOptional()
  @IsEnum(LessonTypeEnum)
  type?: LessonTypeEnum;

  @IsOptional()
  @IsEnum(LessonStatusEnum)
  status?: LessonStatusEnum;
}
