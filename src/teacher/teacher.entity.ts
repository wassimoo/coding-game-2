import { ChildEntity, Column, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Student } from '../student/student.entity';
import { Lesson } from '../lesson/lesson.entity';

@ChildEntity('teacher')
export class Teacher extends User {
  @Column({ nullable: true })
  instrument: string;

  @Column({ type: 'int', nullable: true })
  experience: number;

  @OneToMany(() => Student, (student) => student.assignedTeacher)
  students: Student[];

  @OneToMany(() => Lesson, (lesson) => lesson.teacher)
  lessons: Lesson[];
}
