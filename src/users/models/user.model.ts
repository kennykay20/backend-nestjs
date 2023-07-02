import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
}

@Entity('users')
export class User {
  @PrimaryColumn()
  id?: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: null })
  phone: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ type: 'enum', enum: MaritalStatus, nullable: true })
  maritalStatus: string;

  @Column()
  age: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isDelete: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
