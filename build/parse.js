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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
var dto_1 = require("./dto");
var INDENT_SIZE = 2;
var convertFuncs = new Map([
    ["E-List", dto_1.EListDTO.convert],
    ["Employee", dto_1.EmployeeDTO.convert],
    ["Department", dto_1.DepartmentDTO.convert],
    ["Salary", dto_1.SalaryDTO.convert],
    ["Statement", dto_1.StatementDTO.convert],
    ["Donation", dto_1.DonationDTO.convert],
    ["Rate", dto_1.RateDTO.convert],
    ["Rates", dto_1.RatesDTO.convert],
]);
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
    var prevValue = obj[key];
    obj[key] = [prevValue, value];
}
function parseNested(lineIterator_1) {
    return __awaiter(this, arguments, void 0, function (lineIterator, indent) {
        var prevLine, currObj, line, next, indentMatch, currIndent, tLine, _a, key, value, className, convertFn, result, nestedDTO;
        if (indent === void 0) { indent = 0; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prevLine = "";
                    currObj = {};
                    _b.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 8];
                    line = void 0;
                    if (!(prevLine !== "")) return [3 /*break*/, 2];
                    line = prevLine;
                    prevLine = "";
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, lineIterator.next()];
                case 3:
                    next = _b.sent();
                    if (next.done) {
                        return [2 /*return*/, [currObj, ""]];
                    }
                    line = next.value;
                    _b.label = 4;
                case 4:
                    indentMatch = line.match(/^\s+/);
                    currIndent = indentMatch ? indentMatch[0].length : 0;
                    tLine = line.trim();
                    if (tLine.length === 0) {
                        return [3 /*break*/, 1];
                    }
                    if (!tLine.includes(":")) return [3 /*break*/, 5];
                    _a = line.split(":").map(function (part) { return part.trim(); }), key = _a[0], value = _a[1];
                    setValueOrPush(currObj, key, value);
                    return [3 /*break*/, 7];
                case 5:
                    if (!(currIndent >= indent)) return [3 /*break*/, 7];
                    className = tLine;
                    convertFn = convertFuncs.get(className);
                    if (!convertFn) {
                        throw Error("Unknown class: ".concat(className));
                    }
                    return [4 /*yield*/, parseNested(lineIterator, currIndent + INDENT_SIZE)];
                case 6:
                    result = _b.sent();
                    prevLine = result[1];
                    nestedDTO = convertFn(result[0]);
                    setValueOrPush(currObj, className.toLowerCase(), nestedDTO);
                    _b.label = 7;
                case 7:
                    if (currIndent < indent) {
                        return [2 /*return*/, [currObj, line]];
                    }
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function parse(lineIterator) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, result, _;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, parseNested(lineIterator)];
                case 1:
                    _a = _b.sent(), result = _a[0], _ = _a[1];
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.parse = parse;
//# sourceMappingURL=parse.js.map