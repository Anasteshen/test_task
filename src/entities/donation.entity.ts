import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./employee.entity";
import { Version } from "./version.entity";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

@Entity({ name: "donations" })
export class Donation {
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

  @ManyToOne(() => Employee, (employee) => employee.donations)
  employee: Employee;
}
