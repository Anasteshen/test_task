import { AppDataSource } from "../data-source";
import { EListDTO, FileDTO, RatesDTO } from "../dto";
import { Department } from "../entities/department.entity";
import { Donation } from "../entities/donation.entity";
import { Employee } from "../entities/employee.entity";
import { Statement } from "../entities/statement.entity";
import { Version } from "../entities/version.entity";

const employeeRepository = AppDataSource.getRepository(Employee);
const departmentRepository = AppDataSource.getRepository(Department);
const versionRepository = AppDataSource.getRepository(Version);

export async function seedData(fileDTO: FileDTO) {
  const ratesMap = getRateMap(fileDTO.rates);

  const version = new Version();

  const { employees, departments } = transformDtos(
    fileDTO.eList,
    ratesMap,
    version
  );

  await versionRepository.save(version);
  await departmentRepository.save(departments);
  await employeeRepository.save(employees);
}

function transformDtos(
  eList: EListDTO,
  ratesMap: Map<string, number>,
  version: Version
): { employees: Employee[]; departments: Department[] } {
  const employees = [];
  const departments = [];
  const departmentsMap = new Map<number, Department>();

  for (const employeeDTO of eList.employees) {
    const employee = new Employee();
    employee.id = employeeDTO.id;
    employee.name = employeeDTO.name;
    employee.surname = employeeDTO.surname;
    employee.salary = [];
    employee.donations = [];
    employee.version = version;

    const donations = [];
    for (const donationDTO of employeeDTO.donations) {
      const donation = new Donation();

      let amount = donationDTO.amount.value;
      let koeff = 1;

      if (donationDTO.amount.currency != "USD") {
        koeff = ratesMap.get(
          `${donationDTO.date}-${donationDTO.amount.currency}`
        );
      }

      donation.id = donationDTO.id;
      donation.amount = Math.ceil(amount * koeff * 100); // use big int for money
      donation.date = donationDTO.date;
      donation.employee = employee;
      donation.version = version;

      employee.donations.push(donation);
    }

    for (const statementDto of employeeDTO.salary.statement) {
      const statement = new Statement();

      statement.id = statementDto.id;
      statement.amount = Math.ceil(statementDto.amount * 100);
      statement.date = statementDto.date;
      statement.employee = employee;
      statement.version = version;

      employee?.salary.push(statement);
    }

    let department = departmentsMap.get(employeeDTO.department.id);
    if (!department) {
      department = new Department();
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

function getRateMap(rateDTO: RatesDTO) {
  const ratesMap = new Map<string, number>();

  for (const rate of rateDTO.rates) {
    ratesMap.set(`${rate.date}-${rate.sign}`, rate.value);
  }

  return ratesMap;
}
