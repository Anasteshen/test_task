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
exports.Donation = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("./employee.entity");
const version_entity_1 = require("./version.entity");
const bson_typings_1 = require("typeorm/driver/mongodb/bson.typings");
let Donation = class Donation {
};
exports.Donation = Donation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", bson_typings_1.UUID)
], Donation.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Donation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => version_entity_1.Version, (version) => version.id),
    (0, typeorm_1.Index)(),
    __metadata("design:type", version_entity_1.Version)
], Donation.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint" }),
    __metadata("design:type", Number)
], Donation.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Donation.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, (employee) => employee.donations),
    __metadata("design:type", employee_entity_1.Employee)
], Donation.prototype, "employee", void 0);
exports.Donation = Donation = __decorate([
    (0, typeorm_1.Entity)({ name: "donations" })
], Donation);
