import AoCPuzzle from "../../puzzle";

interface Program {
  id: number;
  linked: number[];
}

export default class Puzzle extends AoCPuzzle {
  private programs: Program[] = [];

  private addLink(l: number, r: number): void {
    const left = this.getProgram(l);
    const right = this.getProgram(r);
    if (!left.linked.includes(right.id)) {
      left.linked.push(right.id);
    }
    if (!right.linked.includes(left.id)) {
      right.linked.push(left.id);
    }
  }

  private getProgram(id: number): Program {
    if (!this.programs[id]) {
      this.programs[id] = { id, linked: [] };
    }
    return this.programs[id];
  }

  public async part1(): Promise<string | number> {
    for (const line of this.lines) {
      const [left, right] = line.split(" <-> ");

      for (const linked of right.split(", ")) {
        this.addLink(+left, +linked);
      }
    }

    const queue = [0];
    const result: number[] = [];
    while (queue.length) {
      const next = queue.shift()!;
      if (!result.includes(next)) {
        result.push(next);
        queue.push(...this.getProgram(next).linked);
      }
    }

    return result.length;
  }

  public async part2(): Promise<string | number> {
    let queue = [...this.programs];
    let groups = 0;
    while (queue.length) {
      groups += 1;
      const groupQueue = [queue[0]];

      while (groupQueue.length) {
        const next = groupQueue.shift()!;
        for (const linked of next.linked) {
          const program = this.getProgram(linked);
          if (queue.includes(program)) {
            queue = queue.filter((p) => p.id !== program.id);
            groupQueue.push(program);
          }
        }
      }
    }

    return groups;
  }
}
