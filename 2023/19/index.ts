import AoCPuzzle from "../../puzzle";

interface Piece {
  x: number;
  m: number;
  a: number;
  s: number;
}

interface Step {
  letter: "x" | "m" | "a" | "s";
  operand: string;
  value: number;
  result: string;
}

interface Workflow {
  code: Function;
  steps: Step[];
  finalStep?: string;
}

interface Ranges {
  x: [number, number];
  m: [number, number];
  a: [number, number];
  s: [number, number];
}

export default class Puzzle extends AoCPuzzle {
  private workflows: Map<string, Workflow> = new Map();

  private pieces: Piece[] = [];

  private parseWorkflow(line: string): void {
    const [key, functions] = line.split(/{|}/gi);
    let code = "(piece) => {\n";
    const steps: Step[] = [];
    let finalStep = "";
    functions.split(",").forEach((f) => {
      const operand = f.match(/[<>]/gi)?.[0];
      if (operand) {
        const [letter, value, result] = f.split(/[<>:]/gi);
        code += ` if (piece.${letter} ${operand} ${value}) { return this.workflows.get('${result}').code(piece); }\n`;
        steps.push({
          letter: letter as "x" | "m" | "a" | "s",
          operand,
          value: +value,
          result,
        });
      } else {
        code += ` return this.workflows.get('${f}').code(piece);`;
        finalStep = f;
      }
    });
    code += "}\n";
    this.workflows.set(key, { code: eval(code), steps, finalStep });
  }

  private parsePiece(line: string): void {
    const piece = {} as Piece;
    line
      .replace(/{|}/gi, "")
      .split(",")
      .forEach((x) => {
        const [key, value] = x.split("=");
        piece[key as "x" | "m" | "a" | "s"] = +value;
      });
    this.pieces.push(piece);
  }

  public async part1(): Promise<string | number> {
    this.lines
      .filter((x) => x)
      .forEach((line) => {
        if (line.startsWith("{")) {
          this.parsePiece(line);
        } else {
          this.parseWorkflow(line);
        }
      });
    this.workflows.set("A", { code: () => true, steps: [] });
    this.workflows.set("R", { code: () => false, steps: [] });

    return this.pieces.filter((piece) => this.workflows.get("in")!.code(piece)).reduce((acc, { x, m, a, s }) => acc + x + m + a + s, 0);
  }

  public async part2(src: Ranges = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }, workflowKey = "in"): Promise<number> {
    let ranges: Ranges = {
      x: [...src.x],
      m: [...src.m],
      a: [...src.a],
      s: [...src.s],
    };
    if (workflowKey === "R") {
      return 0;
    }
    if (workflowKey === "A") {
      return (ranges.x[1] - ranges.x[0] + 1) * (ranges.m[1] - ranges.m[0] + 1) * (ranges.a[1] - ranges.a[0] + 1) * (ranges.s[1] - ranges.s[0] + 1);
    }

    let result = 0;
    const workflow = this.workflows.get(workflowKey)!;

    for (let i = 0; i < workflow.steps.length; i += 1) {
      const step = workflow.steps[i];
      const min = ranges[step.letter][0];
      const max = ranges[step.letter][1];
      if (step.operand === "<") {
        if (max < step.value) {
          result += await this.part2(ranges, step.result);
          return result;
        }
        if (min < step.value) {
          result += await this.part2({ ...ranges, [step.letter]: [min, step.value - 1] }, step.result);
          ranges = { ...ranges, [step.letter]: [step.value, max] };
          continue;
        }
      } else if (step.operand === ">") {
        if (min > step.value) {
          result += await this.part2(ranges, step.result);
          return result;
        }
        if (max > step.value) {
          result += await this.part2({ ...ranges, [step.letter]: [step.value + 1, max] }, step.result);
          ranges = { ...ranges, [step.letter]: [min, step.value] };
          continue;
        }
      }
    }
    result += await this.part2(ranges, workflow.finalStep!);
    return result;
  }
}
