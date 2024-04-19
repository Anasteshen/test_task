import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Department } from "./department.entity";
import { Statement } from "./statement.entity";
import { Donation } from "./donation.entity";
import { Version } from "./version.entity";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

@Entity({ name: "employees" })
export class Employee {
  @PrimaryGeneratedColumn("uuid")
  uuid: UUID;

  @Column()
  @Index()
  id: number;

  @ManyToOne(() => Version, (version) => version.id)
  @Index()
  version: Version;

  @Column()
  name: string;

  @Column()
  surname: string;

  @ManyToOne(() => Department, (department) => department.employees)
  department: Department;

  @OneToMany(() => Statement, (salary) => salary.employee, {
    cascade: true,
  })
  salary: Statement[];

  @OneToMany(() => Donation, (donation) => donation.employee, {
    nullable: true,
    cascade: true,
  })
  donations: Donation[];
}
