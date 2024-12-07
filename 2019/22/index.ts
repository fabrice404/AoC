import { modInv, modPow } from "bigint-mod-arith";

import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private shuffle(s: number[], techniques: string[]) {
    let stack = [...s];

    for (const technique of techniques) {
      if (technique === "deal into new stack") {
        stack = [...stack].reverse();
      } else if (technique.startsWith("cut ")) {
        const cutSize = +technique.replace(/[^0-9-]/gi, "");
        stack = [...stack.slice(cutSize), ...stack.slice(0, cutSize)];
      } else if (technique.startsWith("deal with increment")) {
        const increment = +technique.replace(/[^0-9-]/gi, "");
        const newStack = [...stack];
        let i = 0;
        while (stack.length > 0) {
          newStack[(i * increment) % s.length] = stack.shift()!;
          i += 1;
        }
        stack = newStack;
      }
    }
    return stack;
  }

  public async part1(): Promise<number | string> {
    const stack = Array.from({ length: 10007 }, (_, i) => i);
    return this.shuffle(stack, this.lines).indexOf(2019);
  }

  public async part2(): Promise<number | string> {
    const deckSize = 119315717514047n;
    const shuffles = 101741582076661n;

    let incMultiplier = 1n;
    let offsetDiff = 0n;

    for (const technique of this.lines) {
      if (technique === "deal into new stack") {
        incMultiplier = (BigInt(-1) * incMultiplier) % deckSize;
        offsetDiff = (offsetDiff + incMultiplier) % deckSize;
      } else if (technique.startsWith("cut ")) {
        const cutSize = BigInt(+technique.replace(/[^0-9-]/gi, ""));
        offsetDiff = (cutSize * incMultiplier + offsetDiff) % deckSize;
      } else if (technique.startsWith("deal with increment")) {
        const increment = +technique.replace(/[^0-9-]/gi, "");
        incMultiplier = (modInv(increment, deckSize) * incMultiplier) % deckSize;
      }
    }

    const inc = modPow(incMultiplier, shuffles, deckSize);
    const offset = (offsetDiff * (1n - inc) * modInv((1n - incMultiplier) % deckSize, deckSize)) % deckSize;

    return Number((offset + inc * 2020n) % deckSize);
  }
}
