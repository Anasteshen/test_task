import * as dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { calculateRewards } from "./handlers/get-rewards";
import { seedFromFile } from "./handlers/seed-from-file";
import multer from "multer";

dotenv.config();
const { APP_PORT } = process.env;
const upload = multer({ dest: "uploads/" }); // specify the destination directory
const app = express();

app.post("/parse/file", upload.single("file"), async (req, res) => {
  const filePath = req.file.path; // get the path of the uploaded file

  await seedFromFile(filePath);

  res.send("Data parsed and seeded");
});

app.get("/rewards", async (_, res) => {
  const rewards = await calculateRewards();
  res.send(rewards);
});

async function main() {
  await AppDataSource.initialize();
  app.listen(APP_PORT, () => {
    console.log(`App listening on port: ${APP_PORT}`);
  });
}

main();
