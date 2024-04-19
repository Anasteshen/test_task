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
exports.seedFromFile = void 0;
const dto_1 = require("../dto");
const parse_1 = require("../services/parse");
const read_file_1 = require("../services/read-file");
const seed_1 = require("../services/seed");
function seedFromFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const i = (0, read_file_1.readFile)(filePath);
        const fileDTO = dto_1.FileDTO.convert(yield (0, parse_1.parse)(i));
        console.log("file successfully parsed");
        yield (0, seed_1.seedData)(fileDTO);
        console.log("data successfully seeded");
    });
}
exports.seedFromFile = seedFromFile;
