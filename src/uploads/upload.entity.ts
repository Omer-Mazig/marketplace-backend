import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileTypes } from './enums/file-types.enum';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  path: string;

  @Column({
    type: 'enum',
    enum: FileTypes,
    default: FileTypes.IMAGE,
    nullable: false,
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  mime: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  size: number;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
