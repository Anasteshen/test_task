import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import "reflect-metadata";

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  NODE_ENV,
} = process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT) || 5432,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  synchronize: true,
  logging: NODE_ENV === "DEVELOPMENT",
  entities: ["src/entities/*.entity.{ts,js}"],
  migrations: [__dirname + "/migration/*.ts"],
});
