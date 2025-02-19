import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiPropertyOptional({ description: 'Updated start time in ISO8601 format' })
  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @ApiPropertyOptional({ description: 'Updated end time in ISO8601 format' })
  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @ApiPropertyOptional({
    enum: LessonTypeEnum,
    description: 'Updated lesson type',
  })
  @IsOptional()
  @IsEnum(LessonTypeEnum)
  type?: LessonTypeEnum;

  @ApiPropertyOptional({
    enum: LessonStatusEnum,
    description: 'Updated lesson status',
  })
  @IsOptional()
  @IsEnum(LessonStatusEnum)
  status?: LessonStatusEnum;
}
