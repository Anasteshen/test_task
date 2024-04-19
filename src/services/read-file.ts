import * as fs from "fs";
import * as readline from "readline";

export async function* readFile(filePath: string) {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    yield line;
  }
}
