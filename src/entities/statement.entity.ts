import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./employee.entity";
import { Version } from "./version.entity";
import { UUID } from "crypto";

@Entity({ name: "statements" })
export class Statement {
  @PrimaryGeneratedColumn("uuid")
  uuid: UUID;

  @Column()
  @Index()
  id: number;

  @ManyToOne(() => Version, (version) => version.id)
  @Index()
  version: Version;

  @Column({ type: "bigint" })
  amount: number; // stored in USD cents

  @Column()
  date: Date;

  @ManyToOne(() => Employee, (employee) => employee.salary)
  employee: Employee;
}
