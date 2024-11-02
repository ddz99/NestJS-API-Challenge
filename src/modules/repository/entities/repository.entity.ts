import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Repository {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  repositoryId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  mainLanguage: string;

  @Column()
  creationDate: Date;

  @Column()
  userId: number;

  @Column()
  userLogin: string;

  @Column()
  userAvatar: string;
}
