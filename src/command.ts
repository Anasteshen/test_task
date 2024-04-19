import { Command } from "commander";
import { seedFromFile } from "./handlers/seed-from-file";
import { AppDataSource } from "./data-source";

const program = new Command();
program
  .command("seed")
  .description("Seed the database")
  .argument("<file>", "file path")
  .action(async (arg) => {
    console.log(arg);
    await seedFromFile(arg);
    console.log("command executed successfully");
  });

async function run() {
  await AppDataSource.initialize();
  program.parse(process.argv);
}

run();

// to run the command: npm run seed -- <filePath>
// where filePath is ./dump.txt
