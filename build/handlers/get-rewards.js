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
exports.calculateRewards = void 0;
const data_source_1 = require("../data-source");
const employee_entity_1 = require("../entities/employee.entity");
const MIN_DONATE = 100 * 100; // use cents
const POOL_AMOUNT = 10000 * 100; // use cents
function calculateRewards() {
    return __awaiter(this, void 0, void 0, function* () {
        const employeeRepo = data_source_1.AppDataSource.getRepository(employee_entity_1.Employee);
        const rewards = yield employeeRepo.query(`
  WITH employee_donations AS (
    SELECT 
      e.uuid,
      e.id, 
      e.name, 
      SUM(d.amount) AS total_donation
    FROM 
      employees e
    JOIN 
        donations d ON e.uuid = d."employeeUuid"
    WHERE 
      e."versionId" = (SELECT MAX(id) FROM version)
    GROUP BY 
      e.id, e.uuid, e.name
  ),
  total_donations AS (
    SELECT 
      SUM(total_donation) AS total
    FROM 
      employee_donations
    WHERE 
      total_donation > $1
  )
  SELECT 
    ed.id, 
    ed.name, 
    ed.total_donation,
    CASE 
      WHEN ed.total_donation > $1
      THEN ((ed.total_donation * 100) / td.total) * $2
      ELSE 0
    END AS reward
  FROM 
    employee_donations ed, total_donations td
  `, [MIN_DONATE, POOL_AMOUNT / 100]);
        return rewardMapper(rewards);
    });
}
exports.calculateRewards = calculateRewards;
function rewardMapper(rawData) {
    return rawData.map((data) => ({
        id: data.id,
        name: data.name,
        totalDonation: data.total_donation,
        reward: Math.ceil(data.reward / 100), // convert cents to dollars
    }));
}
