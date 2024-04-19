"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const data_source_1 = require("./data-source");
const get_rewards_1 = require("./handlers/get-rewards");
const seed_from_file_1 = require("./handlers/seed-from-file");
const multer_1 = __importDefault(require("multer"));
dotenv.config();
const { APP_PORT } = process.env;
const upload = (0, multer_1.default)({ dest: "uploads/" }); // specify the destination directory
const app = (0, express_1.default)();
app.post("/parse/file", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = req.file.path; // get the path of the uploaded file
    yield (0, seed_from_file_1.seedFromFile)(filePath);
    res.send("Data parsed and seeded");
}));
app.get("/rewards", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rewards = yield (0, get_rewards_1.calculateRewards)();
    res.send(rewards);
}));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield data_source_1.AppDataSource.initialize();
        app.listen(APP_PORT, () => {
            console.log(`App listening on port: ${APP_PORT}`);
        });
    });
}
main();
