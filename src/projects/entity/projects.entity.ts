import { PROJECT_STATUS } from 'src/enums/project.enum';
import { File } from 'src/file/entity/file.entity';
import { User } from 'src/users/entity/users.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Index,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Projects {
  @PrimaryGeneratedColumn('uuid')
  projectId: string;

  @Index({ unique: true })
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  userId: string;

  @OneToMany(() => File, (file) => file.projectsId)
  files: File[];

  // @ManyToOne(() => User, (user) => user.id)
  // userUpload: User[];

  //   @JoinColumn({ referencedColumnName: 'userUpload', name: 'userUpload' })
  //   user: User;

  @Column({ type: 'longtext', default: JSON.stringify([]) })
  usersAssigned: string;

  @Column({ nullable: true })
  userReport: string;

  @Column({ nullable: true })
  userReview: string;

  @Column({ nullable: true })
  manager: string;

  @Column({ nullable: true })
  customer: string;

  @Column({ nullable: true })
  status: PROJECT_STATUS;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  endAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
