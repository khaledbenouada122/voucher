import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';
@Entity({ name: 'logs' })
export class Logs extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  cause: string; // exp: invalid request

  @Column()
  @IsString()
  path: string; // api/exemple

  @Column()
  @IsString()
  methode: string; // GET / POST ...

  @Column({ default: 0 })
  level: number; //0 WARN, 1 ERROR, 2 FATAL

  @Column({ type: 'text' })
  detail: string; // detail exception

  @Column({ nullable: true })
  userId: string; // user connecter

  @Column({ nullable: true })
  relatedId: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
