"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
const typeorm_1 = require("typeorm");
const department_entity_1 = require("./department.entity");
const statement_entity_1 = require("./statement.entity");
const donation_entity_1 = require("./donation.entity");
const version_entity_1 = require("./version.entity");
const bson_typings_1 = require("typeorm/driver/mongodb/bson.typings");
let Employee = class Employee {
};
exports.Employee = Employee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", bson_typings_1.UUID)
], Employee.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Employee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => version_entity_1.Version, (version) => version.id),
    (0, typeorm_1.Index)(),
    __metadata("design:type", version_entity_1.Version)
], Employee.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employee.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employee.prototype, "surname", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_entity_1.Department, (department) => department.employees),
    __metadata("design:type", department_entity_1.Department)
], Employee.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => statement_entity_1.Statement, (salary) => salary.employee, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Employee.prototype, "salary", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => donation_entity_1.Donation, (donation) => donation.employee, {
        nullable: true,
        cascade: true,
    }),
    __metadata("design:type", Array)
], Employee.prototype, "donations", void 0);
exports.Employee = Employee = __decorate([
    (0, typeorm_1.Entity)({ name: "employees" })
], Employee);
