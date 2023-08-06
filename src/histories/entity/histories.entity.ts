import { HISTORIES_ACTION, HISTORIES_TYPE } from 'src/enums/histories.enum';
import { User } from 'src/users/entity/users.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Histories {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: HISTORIES_ACTION,
    default: HISTORIES_ACTION.CREATE,
  })
  action: string;

  @Column({ type: 'enum', enum: HISTORIES_TYPE, default: HISTORIES_TYPE.FILE })
  type: string;

  @Column({ nullable: true })
  userId: string;

  // @ManyToOne(() => User, (user) => user.id, {
  //   cascade: ['insert', 'update'],
  //   onDelete: 'CASCADE',
  //   orphanedRowAction: 'delete',
  // })
  // @JoinColumn({ referencedColumnName: 'id', name: 'id' })
  // user: User;
  @Column({ type: 'longtext', default: JSON.stringify([]) })
  description: string;

  @CreateDateColumn({ name: 'updated_time' })
  updatedTime: Date;

  @UpdateDateColumn({ name: 'deleted_stime' })
  deletedTime: Date;
}
