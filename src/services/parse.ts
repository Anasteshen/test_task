import {
  DepartmentDTO,
  DonationDTO,
  EListDTO,
  EmployeeDTO,
  RateDTO,
  RatesDTO,
  SalaryDTO,
  StatementDTO,
} from "../dto";

export type ConvertFunc = (obj: any) => any;
export type ParserObject = Record<string, any>;

const INDENT_SIZE = 2;

const convertFuncs = new Map<string, ConvertFunc>([
  ["E-List", EListDTO.convert],
  ["Employee", EmployeeDTO.convert],
  ["Department", DepartmentDTO.convert],
  ["Salary", SalaryDTO.convert],
  ["Statement", StatementDTO.convert],
  ["Donation", DonationDTO.convert],
  ["Rate", RateDTO.convert],
  ["Rates", RatesDTO.convert],
]);

/**
 * Sets the value of a key in the parser object or pushes a value to an existing array.
 * @param obj - The parser object.
 * @param key - The key to set or push the value to.
 * @param value - The value to set or push.
 */
function setValueOrPush(obj: ParserObject, key: string, value: any) {
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
  const prevValue = obj[key];
  obj[key] = [prevValue, value];
}

/**
 * Parses nested objects from the line iterator.
 * @param lineIterator - The line iterator.
 * @param indent - The current indent level.
 * @returns A promise that resolves to the parsed object and the remaining line.
 */
async function parseNested(
  lineIterator: AsyncGenerator,
  indent: number = 0
): Promise<[ParserObject, string]> {
  let prevLine = "";
  const currObj: ParserObject = {};

  while (true) {
    let line;
    if (prevLine !== "") {
      line = prevLine;
      prevLine = "";
    } else {
      const next = await lineIterator.next();
      if (next.done) {
        return [currObj, ""];
      }
      line = next.value;
    }
    const indentMatch = line.match(/^\s+/);
    const currIndent = indentMatch ? indentMatch[0].length : 0;

    const tLine = line.trim();
    if (tLine.length === 0) {
      continue;
    }

    if (tLine.includes(":")) {
      const [key, value] = line.split(":").map((part: string) => part.trim());
      setValueOrPush(currObj, key, value);
    } else if (currIndent >= indent) {
      const className = tLine;
      const convertFn = convertFuncs.get(className);

      if (!convertFn) {
        throw new Error(`Unknown class: ${className}`);
      }
      const result = await parseNested(lineIterator, currIndent + INDENT_SIZE);
      prevLine = result[1];
      const nestedDTO = convertFn(result[0]);
      setValueOrPush(currObj, className.toLowerCase(), nestedDTO);
    }
    if (currIndent < indent) {
      return [currObj, line];
    }
  }
}

/**
 * Parses the input from the line iterator and returns the parsed object.
 * @param lineIterator - The line iterator.
 * @returns A promise that resolves to the parsed object.
 */
export async function parse(
  lineIterator: AsyncGenerator
): Promise<ParserObject> {
  const [result, _] = await parseNested(lineIterator);
  return result;
}
