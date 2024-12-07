import AoCPuzzle from "../../puzzle";
import { IntCodeComputer } from "../int-code-computer";

interface NetworkComputer {
  computer: IntCodeComputer;
  address: number;
  finished: boolean;
  outputs: number[];
}

export default class Puzzle extends AoCPuzzle {
  private networkComputers: NetworkComputer[] = [];

  public async part1(): Promise<string | number> {
    this.networkComputers = Array.from({ length: 50 }, (_, i) => ({
      address: i,
      computer: new IntCodeComputer(this.input, [i], -1),
      finished: false,
      outputs: [],
    }));

    while (true) {
      for (const networkComputer of this.networkComputers) {
        if (!networkComputer.finished) {
          networkComputer.finished = networkComputer.computer.compute(false);
          if (networkComputer.computer.output) {
            networkComputer.outputs.push(networkComputer.computer.output);
          }
          if (networkComputer.outputs.length >= 3) {
            const destination = networkComputer.outputs.shift()!;
            const x = networkComputer.outputs.shift()!;
            const y = networkComputer.outputs.shift()!;
            if (destination === 255) {
              return y;
            }
            this.networkComputers.find((c) => c.address === destination)?.computer.addInputs([x, y]);
          }
        }
      }
    }

    return "<NO RESULT>";
  }

  public async part2(): Promise<string | number> {
    let nat: { [key: string]: number } = {};
    const natYs: number[] = [];

    this.networkComputers = Array.from({ length: 50 }, (_, i) => ({
      address: i,
      computer: new IntCodeComputer(this.input, [i], -1),
      finished: false,
      outputs: [],
    }));

    while (true) {
      for (const networkComputer of this.networkComputers) {
        if (!networkComputer.finished) {
          networkComputer.finished = networkComputer.computer.compute(false);
          if (networkComputer.computer.output) {
            networkComputer.outputs.push(networkComputer.computer.output);
          }
          if (networkComputer.outputs.length >= 3) {
            const destination = networkComputer.outputs.shift()!;
            const x = networkComputer.outputs.shift()!;
            const y = networkComputer.outputs.shift()!;
            if (destination === 255) {
              nat = { x, y };
            }
            this.networkComputers.find((c) => c.address === destination)?.computer.addInputs([x, y]);
          }
        }
      }

      if (nat.x && nat.y) {
        if (this.networkComputers.every((c) => c.computer.inputQueue.length === 0) && this.networkComputers.every((c) => c.outputs.length === 0)) {
          this.networkComputers.find((c) => c.address === 0)?.computer.addInputs([nat.x, nat.y]);
          natYs.unshift(nat.y);
        }
      }

      if (natYs.length >= 2 && natYs[0] === natYs[1]) {
        return natYs[0];
      }
    }

    return "<NO RESULT>";
  }
}
