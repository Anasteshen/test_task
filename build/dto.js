"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = exports.FileDTO = exports.RatesDTO = exports.EListDTO = exports.RateDTO = exports.DonationDTO = exports.SalaryDTO = exports.StatementDTO = exports.DepartmentDTO = exports.EmployeeDTO = void 0;
class EmployeeDTO {
    constructor(id, name, surname, department, salary, donations) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.department = department;
        this.salary = salary;
        this.donations = donations;
    }
    static convert(obj) {
        return new EmployeeDTO(parseInt(obj["id"]), obj["name"], obj["surname"], obj["department"], obj["salary"], castToArray(obj["donation"]));
    }
}
exports.EmployeeDTO = EmployeeDTO;
class DepartmentDTO {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    static convert(obj) {
        return new DepartmentDTO(parseInt(obj["id"]), obj["name"]);
    }
}
exports.DepartmentDTO = DepartmentDTO;
class StatementDTO {
    constructor(id, amount, date) {
        this.id = id;
        this.amount = amount;
        this.date = date;
    }
    static convert(obj) {
        return new StatementDTO(parseInt(obj["id"]), parseFloat(obj["amount"]), new Date(obj["date"]));
    }
}
exports.StatementDTO = StatementDTO;
class SalaryDTO {
    constructor(statement) {
        this.statement = statement;
    }
    static convert(obj) {
        return new SalaryDTO(castToArray(obj["statement"]));
    }
}
exports.SalaryDTO = SalaryDTO;
class DonationDTO {
    constructor(id, amount, date) {
        this.id = id;
        this.amount = amount;
        this.date = date;
    }
    static convert(obj) {
        const [value, currency] = obj["amount"].split(" ");
        return new DonationDTO(parseInt(obj["id"]), new Money(parseFloat(value), currency), new Date(obj["date"]));
    }
}
exports.DonationDTO = DonationDTO;
class RateDTO {
    constructor(date, sign, value) {
        this.date = date;
        this.sign = sign;
        this.value = value;
    }
    static convert(obj) {
        return new RateDTO(new Date(obj["date"]), obj["sign"], parseFloat(obj["value"]));
    }
}
exports.RateDTO = RateDTO;
class EListDTO {
    constructor(employees) {
        this.employees = employees;
    }
    static convert(obj) {
        return new EListDTO(castToArray(obj["employee"]));
    }
}
exports.EListDTO = EListDTO;
class RatesDTO {
    constructor(rates) {
        this.rates = rates;
    }
    static convert(obj) {
        return new RatesDTO(castToArray(obj["rate"]));
    }
}
exports.RatesDTO = RatesDTO;
class FileDTO {
    constructor(eList, rates) {
        this.eList = eList;
        this.rates = rates;
    }
    static convert(obj) {
        return new FileDTO(obj["e-list"], obj["rates"]);
    }
}
exports.FileDTO = FileDTO;
class Money {
    constructor(value, currency) {
        this.value = value;
        this.currency = currency;
    }
}
exports.Money = Money;
function castToArray(val) {
    if (val === null || val === undefined) {
        return [];
    }
    if (Array.isArray(val)) {
        return val;
    }
    return [val];
}
