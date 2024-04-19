import { Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Version {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;
}
