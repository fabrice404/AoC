import { sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

type Machine = {
  lights: string;
  buttons: number[][];
  joltages: number[];
};

export default class Puzzle extends AoCPuzzle {
  private machines: Machine[] = [];

  public async part1(): Promise<string | number> {
    this.machines = this.lines.map((line) => {
      const parts = line.split(/\s/g).map((s) => s.replace(/[[\](){}]/g, ""));
      return {
        lights: parts.shift()!,
        joltages: parts.pop()!.split(",").map(Number),
        buttons: parts.map((b) => b.split(",").map(Number)),
      };
    });

    return sum(
      this.machines.map((machine) => {
        const reachable: Map<string, number> = new Map();
        const queue: string[] = [];

        const init = ".".repeat(machine.lights.length);
        reachable.set(init, 0);
        queue.push(init);

        while (queue.length) {
          const current = queue.shift()!;

          if (current === machine.lights) {
            return reachable.get(current)!;
          }

          for (const button of machine.buttons) {
            const next = current
              .split("")
              .map((l, i) => {
                if (button.includes(i)) {
                  return l === "." ? "#" : ".";
                }
                return l;
              })
              .join("");

            if (!reachable.has(next)) {
              reachable.set(next, reachable.get(current)! + 1);
              queue.push(next);
            }
          }
        }

        throw new Error("Unreachable");
      }),
    );
  }

  public async part2(): Promise<string | number> {
    return sum(
      this.machines.map((machine) => {
        let result = 1000;

        const solve = (joltages: number[], presses: number, buttons: number[][]) => {
          let pressesLeft = 0;
          if (joltages.some((j) => j < 0)) {
            return;
          }

          pressesLeft = Math.max(...joltages);
          if (pressesLeft === 0) {
            result = Math.min(result, presses);
          }

          if (presses + pressesLeft >= result) {
            return;
          }

          for (let i = 0; i < joltages.length; i += 1) {
            for (let j = 0; j < joltages.length; j += 1) {
              if (joltages[i] > joltages[j]) {
                const remainingButtons = buttons.filter((b) => b.includes(i) && !b.includes(j));
                if (remainingButtons.length === 0) {
                  return;
                }
                if (remainingButtons.length === 1) {
                  const button = remainingButtons[0];
                  const toggled = [...joltages];
                  for (const b of button) {
                    toggled[b] -= 1;
                  }
                  solve(toggled, presses + 1, buttons);
                  return;
                }
              }
            }
          }

          for (let i = 0; i < buttons.length; i += 1) {
            const button = buttons[i];
            const toggled = [...joltages];
            for (const b of button) {
              toggled[b] -= 1;
            }
            solve(toggled, presses + 1, buttons.slice(i));
          }
        };

        solve(machine.joltages, 0, machine.buttons);
        return result;
      }),
    );
  }
}
