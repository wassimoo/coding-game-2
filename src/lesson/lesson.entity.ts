import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Teacher } from '../teacher/teacher.entity';
import { Student } from '../student/student.entity';

export type LessonType = 'single' | 'regular';
export type LessonStatus = 'requested' | 'confirmed' | 'cancelled';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.lessons)
  teacher: Teacher;

  @ManyToOne(() => Student, (student) => student.lessons)
  student: Student;

  @Column('timestamptz')
  startTime: Date;

  @Column('timestamptz')
  endTime: Date;

  @Column({ type: 'varchar' })
  type: LessonType;

  @Column({ type: 'varchar' })
  status: LessonStatus;
}
