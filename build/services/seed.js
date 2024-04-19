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
exports.seedData = void 0;
const data_source_1 = require("../data-source");
const department_entity_1 = require("../entities/department.entity");
const donation_entity_1 = require("../entities/donation.entity");
const employee_entity_1 = require("../entities/employee.entity");
const statement_entity_1 = require("../entities/statement.entity");
const version_entity_1 = require("../entities/version.entity");
const employeeRepository = data_source_1.AppDataSource.getRepository(employee_entity_1.Employee);
const departmentRepository = data_source_1.AppDataSource.getRepository(department_entity_1.Department);
const versionRepository = data_source_1.AppDataSource.getRepository(version_entity_1.Version);
function seedData(fileDTO) {
    return __awaiter(this, void 0, void 0, function* () {
        const ratesMap = getRateMap(fileDTO.rates);
        const version = new version_entity_1.Version();
        const { employees, departments } = transformDtos(fileDTO.eList, ratesMap, version);
        yield versionRepository.save(version);
        yield departmentRepository.save(departments);
        yield employeeRepository.save(employees);
    });
}
exports.seedData = seedData;
function transformDtos(eList, ratesMap, version) {
    const employees = [];
    const departments = [];
    const departmentsMap = new Map();
    for (const employeeDTO of eList.employees) {
        const employee = new employee_entity_1.Employee();
        employee.id = employeeDTO.id;
        employee.name = employeeDTO.name;
        employee.surname = employeeDTO.surname;
        employee.salary = [];
        employee.donations = [];
        employee.version = version;
        const donations = [];
        for (const donationDTO of employeeDTO.donations) {
            const donation = new donation_entity_1.Donation();
            let amount = donationDTO.amount.value;
            let koeff = 1;
            if (donationDTO.amount.currency != "USD") {
                koeff = ratesMap.get(`${donationDTO.date}-${donationDTO.amount.currency}`);
            }
            donation.id = donationDTO.id;
            donation.amount = Math.ceil(amount * koeff * 100); // use big int for money
            donation.date = donationDTO.date;
            donation.employee = employee;
            donation.version = version;
            employee.donations.push(donation);
        }
        for (const statementDto of employeeDTO.salary.statement) {
            const statement = new statement_entity_1.Statement();
            statement.id = statementDto.id;
            statement.amount = Math.ceil(statementDto.amount * 100);
            statement.date = statementDto.date;
            statement.employee = employee;
            statement.version = version;
            employee === null || employee === void 0 ? void 0 : employee.salary.push(statement);
        }
        let department = departmentsMap.get(employeeDTO.department.id);
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
    return { employees, departments };
}
function getRateMap(rateDTO) {
    const ratesMap = new Map();
    for (const rate of rateDTO.rates) {
        ratesMap.set(`${rate.date}-${rate.sign}`, rate.value);
    }
    return ratesMap;
}
