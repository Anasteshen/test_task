import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./employee.entity";
import { Version } from "./version.entity";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

@Entity({ name: "departments" })
export class Department {
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

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
}
