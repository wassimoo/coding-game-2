import { ChildEntity, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Teacher } from '../teacher/teacher.entity';
import { Lesson } from '../lesson/lesson.entity';

@ChildEntity('student')
export class Student extends User {
  @Column({ nullable: true })
  instrument: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.students, { nullable: true })
  assignedTeacher: Teacher;

  @OneToMany(() => Lesson, (lesson) => lesson.student)
  lessons: Lesson[];
}
