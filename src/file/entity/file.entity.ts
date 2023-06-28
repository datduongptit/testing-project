import { Projects } from 'src/projects/entity/projects.entity';
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
  ManyToOne,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  projectId: string;

  @ManyToOne(() => Projects, (projects) => projects?.projectId, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ referencedColumnName: 'projectId', name: 'projectId' })
  projects: Projects;

  @Column({ nullable: true })
  userUpload: string;

  @Column({ nullable: true })
  url: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
