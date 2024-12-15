import AoCPuzzle from "../../puzzle";

interface State {
  id: string;
  "0": {
    value: number;
    move: "right" | "left";
    next: string;
  };
  "1": {
    value: number;
    move: "right" | "left";
    next: string;
  };
}

export default class Puzzle extends AoCPuzzle {
  private states: Map<string, State> = new Map();

  public async part1(): Promise<string | number> {
    const steps = +this.lines[1].replace(/[^0-9]/gi, "");

    this.input
      .split("\n\n")
      .slice(1)
      .forEach((state) => {
        const lines = state.split("\n");
        const id = lines[0].slice(9, -1);

        const value0 = lines[2].match("value 1") ? 1 : 0;
        const move0 = lines[3].match("right") ? "right" : "left";
        const next0 = lines[4].slice(26, -1);

        const value1 = lines[6].match("value 1") ? 1 : 0;
        const move1 = lines[7].match("right") ? "right" : "left";
        const next1 = lines[8].slice(26, -1);

        this.states.set(id, {
          id,
          0: { value: value0, move: move0, next: next0 },
          1: { value: value1, move: move1, next: next1 },
        });
      });

    const tape = [0];
    let index = 0;
    let state = "A";

    for (let i = 0; i < steps; i += 1) {
      const currentState = this.states.get(state)!;
      const currentValue = tape[index].toString() as "0" | "1";
      tape[index] = currentState[currentValue].value;

      if (currentState[currentValue].move === "right") {
        index += 1;
        if (index > tape.length - 1) {
          tape.push(0);
        }
      } else {
        index -= 1;
        if (index < 0) {
          index += 1;
          tape.unshift(0);
        }
      }
      state = currentState[currentValue].next;
    }

    return tape.filter((t) => t === 1).length;
  }

  public async part2(): Promise<string | number> {
    return "Happy Xmas!";
  }
}
