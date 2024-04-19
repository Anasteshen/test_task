import { FileDTO } from "../dto";
import { parse } from "../services/parse";
import { readFile } from "../services/read-file";
import { seedData } from "../services/seed";

export async function seedFromFile(filePath: string): Promise<void> {
  const i = readFile(filePath);
  const fileDTO = FileDTO.convert(await parse(i));
  console.log("file successfully parsed");
  await seedData(fileDTO);
  console.log("data successfully seeded");
}
