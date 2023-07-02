import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'secret_keys' })
export class SecretKeys {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  secret: string;
}
