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
exports.seedData = void 0;
var data_source_1 = require("./data-source");
var department_entity_1 = require("./entities/department.entity");
var donation_entity_1 = require("./entities/donation.entity");
var employee_entity_1 = require("./entities/employee.entity");
var statement_entity_1 = require("./entities/statement.entity");
var version_entity_1 = require("./entities/version.entity");
var employeeRepository = data_source_1.AppDataSource.getRepository(employee_entity_1.Employee);
var departmentRepository = data_source_1.AppDataSource.getRepository(department_entity_1.Department);
var versionRepository = data_source_1.AppDataSource.getRepository(version_entity_1.Version);
function seedData(fileDTO) {
    return __awaiter(this, void 0, void 0, function () {
        var rates, version, ratesMap, _i, rates_1, rate, _a, employees, departments;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    rates = fileDTO.rates.rates;
                    version = new version_entity_1.Version();
                    return [4 /*yield*/, versionRepository.save(version)];
                case 1:
                    _b.sent();
                    ratesMap = new Map();
                    for (_i = 0, rates_1 = rates; _i < rates_1.length; _i++) {
                        rate = rates_1[_i];
                        ratesMap.set("".concat(rate.date, "-").concat(rate.sign), rate.value);
                    }
                    _a = transformDtos(fileDTO.eList, ratesMap, version), employees = _a.employees, departments = _a.departments;
                    return [4 /*yield*/, versionRepository.save(version)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, departmentRepository.save(departments)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, employeeRepository.save(employees)];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.seedData = seedData;
function transformDtos(eList, ratesMap, version) {
    var employees = [];
    var departments = [];
    var departmentsMap = new Map();
    for (var _i = 0, _a = eList.employees; _i < _a.length; _i++) {
        var employeeDTO = _a[_i];
        var employee = new employee_entity_1.Employee();
        employee.id = employeeDTO.id;
        employee.name = employeeDTO.name;
        employee.surname = employeeDTO.surname;
        employee.salary = [];
        employee.donations = [];
        employee.version = version;
        var donations = [];
        for (var _b = 0, _c = employeeDTO.donations; _b < _c.length; _b++) {
            var donationDTO = _c[_b];
            var donation = new donation_entity_1.Donation();
            var value = donationDTO.amount.value;
            if (donationDTO.amount.currency != "USD") {
                value = ratesMap.get("".concat(donationDTO.date, "-").concat(donationDTO.amount.currency));
            }
            if (!value) {
                throw new Error("Wrong currency provided, \", ".concat(value, ", ").concat(JSON.stringify(donationDTO.amount)));
            }
            donation.id = donationDTO.id;
            donation.amount = Math.ceil(value * donationDTO.amount.value * 100); // use big int for money
            donation.date = donationDTO.date;
            donation.employee = employee;
            donation.version = version;
            employee.donations.push(donation);
        }
        for (var _d = 0, _e = employeeDTO.salary.statement; _d < _e.length; _d++) {
            var statementDto = _e[_d];
            var statement = new statement_entity_1.Statement();
            statement.id = statementDto.id;
            statement.amount = Math.ceil(statementDto.amount * 100);
            statement.date = statementDto.date;
            statement.employee = employee;
            statement.version = version;
            employee === null || employee === void 0 ? void 0 : employee.salary.push(statement);
        }
        var department = departmentsMap.get(employeeDTO.department.id);
        if (!department) {
            department = new department_entity_1.Department();
            department.id = employeeDTO.department.id;
            department.name = employeeDTO.department.name;
            department.employees = [];
            department.version = version;
            departmentsMap.set(department.id, department);
            departments.push(department);
        }
        department.employees.push(employee);
        employee.department = department;
        employees.push(employee);
    }
    return { employees: employees, departments: departments };
}
//# sourceMappingURL=seed.service.js.map