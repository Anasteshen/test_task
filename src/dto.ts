import { ParserObject } from "./services/parse";

export class EmployeeDTO {
  constructor(
    public id: number,
    public name: string,
    public surname: string,
    public department: DepartmentDTO,
    public salary: SalaryDTO,
    public donations?: DonationDTO[]
  ) {}

  static convert(obj: ParserObject): EmployeeDTO {
    return new EmployeeDTO(
      parseInt(obj["id"]),
      obj["name"],
      obj["surname"],
      obj["department"],
      obj["salary"],
      castToArray(obj["donation"])
    );
  }
}

export class DepartmentDTO {
  constructor(public id: number, public name: string) {}

  static convert(obj: ParserObject): DepartmentDTO {
    return new DepartmentDTO(parseInt(obj["id"]), obj["name"]);
  }
}

export class StatementDTO {
  constructor(public id: number, public amount: number, public date: Date) {}

  static convert(obj: ParserObject): StatementDTO {
    return new StatementDTO(
      parseInt(obj["id"]),
      parseFloat(obj["amount"]),
      new Date(obj["date"])
    );
  }
}

export class SalaryDTO {
  constructor(public statement: StatementDTO[]) {}

  static convert(obj: ParserObject): SalaryDTO {
    return new SalaryDTO(castToArray(obj["statement"]));
  }
}

export class DonationDTO {
  constructor(public id: number, public amount: Money, public date: Date) {}

  static convert(obj: ParserObject): DonationDTO {
    const [value, currency] = obj["amount"].split(" ");

    return new DonationDTO(
      parseInt(obj["id"]),
      new Money(parseFloat(value), currency),
      new Date(obj["date"])
    );
  }
}

export class RateDTO {
  constructor(public date: Date, public sign: string, public value: number) {}

  static convert(obj: ParserObject): RateDTO {
    return new RateDTO(
      new Date(obj["date"]),
      obj["sign"],
      parseFloat(obj["value"])
    );
  }
}

export class EListDTO {
  constructor(public employees: EmployeeDTO[]) {}

  static convert(obj: ParserObject): EListDTO {
    return new EListDTO(castToArray(obj["employee"]));
  }
}

export class RatesDTO {
  constructor(public rates: RateDTO[]) {}

  static convert(obj: ParserObject): RatesDTO {
    return new RatesDTO(castToArray(obj["rate"]));
  }
}

export class FileDTO {
  constructor(public eList: EListDTO, public rates: RatesDTO) {}
  static convert(obj: ParserObject): FileDTO {
    return new FileDTO(obj["e-list"], obj["rates"]);
  }
}

export class Money {
  constructor(public value: number, public currency: string) {}
}

function castToArray(val: any): any[] {
  if (val === null || val === undefined) {
    return [];
  }
  if (Array.isArray(val)) {
    return val;
  }
  return [val];
}
