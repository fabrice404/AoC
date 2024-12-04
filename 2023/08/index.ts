import { lcm } from "../../helpers/numbers";
import AoCPuzzle from "../../puzzle";

interface Node {
  name: string;
  left: string;
  right: string;
}

export default class Puzzle extends AoCPuzzle {
  private moves: string[] = [];

  private movePosition: number = 0;

  private nodes: Node[] = [];

  private currentNode: string = "AAA";

  private steps: number = 0;

  private reset() {
    this.currentNode = "AAA";
    this.steps = 0;
    this.movePosition = 0;

    const lines = [...this.lines];
    this.moves = lines
      .shift()!
      .split("")
      .map((move) => move.trim());

    this.nodes = lines
      .filter((x) => x)
      .map((line) => {
        const [name, left, right] = line
          .split(/[,=()]/gi)
          .map((x) => x.trim())
          .filter((x) => x);
        return { name, left, right };
      });
  }

  private moveNext() {
    const nextMove = this.moves[this.movePosition] === "L" ? "left" : "right";

    const node = this.nodes.find((n) => n.name === this.currentNode);
    this.currentNode = node![nextMove];

    this.steps += 1;
    this.movePosition += 1;
    if (this.movePosition >= this.moves.length) {
      this.movePosition = 0;
    }
  }

  public async part1(): Promise<string | number> {
    this.reset();

    do {
      this.moveNext();
    } while (this.currentNode !== "ZZZ");

    return this.steps;
  }

  public async part2(): Promise<string | number> {
    this.reset();

    const results: number[] = this.nodes
      .filter((n) => n.name.endsWith("A"))
      .map((n) => {
        let steps = 0;
        let currentMovePosition = 0;
        let currentNode = n;

        while (!currentNode.name.endsWith("Z")) {
          const nextMove = this.moves[currentMovePosition] === "L" ? "left" : "right";

          // get next node
          const nextNode = currentNode[nextMove];
          currentNode = this.nodes.find((n2) => nextNode === n2.name)!;

          steps += 1;
          currentMovePosition += 1;
          if (currentMovePosition >= this.moves.length) {
            currentMovePosition = 0;
          }
        }

        return steps;
      });

    return results.reduce((acc, val) => lcm(acc, val), 1);
  }
}
