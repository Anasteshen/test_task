import { AppDataSource } from "../data-source";
import { Employee } from "../entities/employee.entity";

const MIN_DONATE = 100 * 100; // use cents
const POOL_AMOUNT = 10000 * 100; // use cents

export type Reward = {
  id: number;
  name: string;
  totalDonation: number;
  reward: number;
};
export async function calculateRewards(): Promise<Reward[]> {
  const employeeRepo = AppDataSource.getRepository(Employee);

  const rewards = await employeeRepo.query(
    `
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
  `,
    [MIN_DONATE, POOL_AMOUNT / 100]
  );

  return rewardMapper(rewards);
}

function rewardMapper(rawData: any): Reward[] {
  return rawData.map((data: any) => ({
    id: data.id,
    name: data.name,
    totalDonation: data.total_donation,
    reward: Math.ceil(data.reward / 100), // convert cents to dollars
  }));
}
