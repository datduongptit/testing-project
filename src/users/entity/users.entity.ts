import { Param, ParseUUIDPipe } from '@nestjs/common';
import { Role } from '../../enums/role.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { File } from 'src/file/entity/file.entity';
import { Projects } from 'src/projects/entity/projects.entity';
import { Histories } from 'src/histories/entity/histories.entity';

export const UUIDParam = (name: string) => Param(name, new ParseUUIDPipe());
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => File, (file) => file.userUpload)
  userUpload: File[];

  @OneToMany(() => Projects, (project) => project.userId)
  userProject: Projects[];

  @OneToMany(() => Histories, (history) => history.userId)
  histories: Histories[];

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
