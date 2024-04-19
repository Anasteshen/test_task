"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const seed_from_file_1 = require("./handlers/seed-from-file");
const data_source_1 = require("./data-source");
const program = new commander_1.Command();
program
    .command("seed")
    .description("Seed the database")
    .argument("<file>", "file path")
    .action((arg) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(arg);
    yield (0, seed_from_file_1.seedFromFile)(arg);
    console.log("command executed successfully");
}));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        yield data_source_1.AppDataSource.initialize();
        program.parse(process.argv);
    });
}
run();
// to run the command: npm run seed -- <filePath>
// where filePath is ./dump.txt
