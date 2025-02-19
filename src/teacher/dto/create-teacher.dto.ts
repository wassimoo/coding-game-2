import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTeacherDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  instrument?: string;

  @IsOptional()
  @IsNumber()
  experience?: number;
}
