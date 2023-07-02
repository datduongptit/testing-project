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
} from 'typeorm';

@Entity()
export class Projects {
  @PrimaryGeneratedColumn('uuid')
  projectId: string;

  @Column({ nullable: true, unique: true })
  @Index({ unique: true })
  name: string;

  @Column({ nullable: true })
  userId: string;

  //   @OneToOne(() => User, (user) => user.id, {
  //     onDelete: 'CASCADE',
  //     orphanedRowAction: 'delete',
  //   })
  //   @JoinColumn({ referencedColumnName: 'userUpload', name: 'userUpload' })
  //   user: User;

  @Column({ nullable: true, type: 'longtext', default: JSON.stringify([]) })
  usersAssigned: string;

  @Column({ nullable: true })
  manager: string;

  @Column({ nullable: true })
  customer: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
