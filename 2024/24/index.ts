import { execSync } from "child_process";
import { writeFile } from "../../helpers/file";
import { binaryToDecimal } from "../../helpers/numbers";
import AoCPuzzle from "../../puzzle";

interface Connection {
  inA: string;
  inB: string;
  operator: string;
  out: string;
}

export default class Puzzle extends AoCPuzzle {
  private connections: Connection[] = [];

  private dot: string[] = [];

  private wires: Map<string, boolean | null> = new Map();

  private getWire(name: string): boolean | null {
    if (!this.wires.has(name)) {
      this.setWire(name);
    }
    return this.wires.get(name)!;
  }

  private setWire(name: string, value: boolean | null = null): void {
    this.wires.set(name, value);
  }

  public async part1(): Promise<string | number> {
    const [wires, connections] = this.input.split("\n\n");

    for (const wire of wires.split("\n")) {
      const [name, value] = wire.split(": ");
      this.setWire(name, value === "1");
    }

    for (const connection of connections.split("\n")) {
      const [inA, operator, inB, , out] = connection.split(" ");
      this.connections.push({ inA, inB, operator, out });
      this.dot.push(` ${out} -- ${inA}, ${inB}`);
    }

    let operations = this.connections.filter((c) => this.getWire(c.inA) != null && this.getWire(c.inB) != null && this.getWire(c.out) == null);

    while (operations.length > 0) {
      for (const operation of operations) {
        switch (operation.operator) {
          case "AND":
            this.setWire(operation.out, this.getWire(operation.inA) && this.getWire(operation.inB));
            break;
          case "OR":
            this.setWire(operation.out, this.getWire(operation.inA) || this.getWire(operation.inB));
            break;
          case "XOR":
            this.setWire(operation.out, this.getWire(operation.inA) !== this.getWire(operation.inB));
            break;
        }
      }

      operations = this.connections.filter((c) => this.getWire(c.inA) != null && this.getWire(c.inB) != null && this.getWire(c.out) == null);
    }

    if (!this.isExample) {
      writeFile(`${__dirname}/graph.dot`, `graph{\n${this.dot.join("\n")}\n}`);
      execSync(`neato -Tsvg ${__dirname}/graph.dot -o ${__dirname}/graph.svg`);
    }

    return binaryToDecimal(
      [...this.wires.keys()]
        .filter((k) => k.startsWith("z"))
        .sort()
        .reverse()
        .map((k) => (this.getWire(k) ? "1" : "0"))
        .join(""),
    );
  }

  public async part2(): Promise<string | number> {
    const errors: string[] = [];

    for (let i = 0; i <= 44; i += 1) {
      const id = i.toString().padStart(2, "0");
      const xid = `x${id}`;
      const yid = `y${id}`;
      const zid = `z${id}`;

      const zOut = this.connections.find((c) => c.out === zid)!;
      if (zOut.operator !== "XOR") {
        errors.push(zOut!.out);
      }

      const and = this.connections.find((c) => c.operator === "AND" && ((c.inA === xid && c.inB === yid) || (c.inA === yid && c.inB === xid)))!;
      const andNext = this.connections.find((c) => c.inA === and.out || c.inB === and.out);
      if (andNext && andNext.operator !== "OR" && i > 0) {
        errors.push(and!.out);
      }

      const xor = this.connections.find((c) => c.operator === "XOR" && ((c.inA === xid && c.inB === yid) || (c.inA === yid && c.inB === xid)))!;
      const xorNext = this.connections.find((c) => c.inA === xor.out || c.inB === xor.out);
      if (xorNext && xorNext.operator === "OR") {
        errors.push(xor!.out);
      }
    }

    errors.push(
      ...this.connections
        .filter((c) => !c.inA[0].match(/[xy]/g) && !c.inB[0].match(/[xy]/g) && !c.out[0].match(/[z]/g) && c.operator === "XOR")
        .map((instruction) => instruction.out),
    );

    return errors.sort().join(",");
  }
}
