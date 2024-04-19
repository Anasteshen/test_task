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
exports.parse = void 0;
const dto_1 = require("../dto");
const INDENT_SIZE = 2;
const convertFuncs = new Map([
    ["E-List", dto_1.EListDTO.convert],
    ["Employee", dto_1.EmployeeDTO.convert],
    ["Department", dto_1.DepartmentDTO.convert],
    ["Salary", dto_1.SalaryDTO.convert],
    ["Statement", dto_1.StatementDTO.convert],
    ["Donation", dto_1.DonationDTO.convert],
    ["Rate", dto_1.RateDTO.convert],
    ["Rates", dto_1.RatesDTO.convert],
]);
/**
 * Sets the value of a key in the parser object or pushes a value to an existing array.
 * @param obj - The parser object.
 * @param key - The key to set or push the value to.
 * @param value - The value to set or push.
 */
function setValueOrPush(obj, key, value) {
    // {} => {"key": "value"}
    if (!obj.hasOwnProperty(key)) {
        obj[key] = value;
        return;
    }
    // {"key": ["prev1", "prev2"]} => {"key": ["prev1", "prev2", "new"]}
    if (Array.isArray(obj[key])) {
        obj[key].push(value);
        return;
    }
    // {"key": "prev"} => {"key": ["prev", "new"]}
    const prevValue = obj[key];
    obj[key] = [prevValue, value];
}
/**
 * Parses nested objects from the line iterator.
 * @param lineIterator - The line iterator.
 * @param indent - The current indent level.
 * @returns A promise that resolves to the parsed object and the remaining line.
 */
function parseNested(lineIterator_1) {
    return __awaiter(this, arguments, void 0, function* (lineIterator, indent = 0) {
        let prevLine = "";
        const currObj = {};
        while (true) {
            let line;
            if (prevLine !== "") {
                line = prevLine;
                prevLine = "";
            }
            else {
                const next = yield lineIterator.next();
                if (next.done) {
                    return [currObj, ""];
                }
                line = next.value;
            }
            const indentMatch = line.match(/^\s+/);
            const currIndent = indentMatch ? indentMatch[0].length : 0;
            const tLine = line.trim();
            if (tLine.length === 0) {
                continue;
            }
            if (tLine.includes(":")) {
                const [key, value] = line.split(":").map((part) => part.trim());
                setValueOrPush(currObj, key, value);
            }
            else if (currIndent >= indent) {
                const className = tLine;
                const convertFn = convertFuncs.get(className);
                if (!convertFn) {
                    throw new Error(`Unknown class: ${className}`);
                }
                const result = yield parseNested(lineIterator, currIndent + INDENT_SIZE);
                prevLine = result[1];
                const nestedDTO = convertFn(result[0]);
                setValueOrPush(currObj, className.toLowerCase(), nestedDTO);
            }
            if (currIndent < indent) {
                return [currObj, line];
            }
        }
    });
}
/**
 * Parses the input from the line iterator and returns the parsed object.
 * @param lineIterator - The line iterator.
 * @returns A promise that resolves to the parsed object.
 */
function parse(lineIterator) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, _] = yield parseNested(lineIterator);
        return result;
    });
}
exports.parse = parse;
