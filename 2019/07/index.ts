import { IntCodeComputer } from '../int-code-computer';

import { permutations } from '../../helpers/string';
import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const computers = [];
    for (let i = 0; i < 5; i += 1) {
      computers[i] = new IntCodeComputer(this.input);
    }

    let highestSignal = 0;
    const perms = permutations('01234');
    for (const p of perms) {
      const n = p.split('').map(Number);
      let val = 0;
      for (let i = 0; i < 5; i += 1) {
        computers[i].addInputs([n[i], val!]);
        computers[i].compute();
        val = computers[i].output;
      }

      if (val! > highestSignal) {
        highestSignal = val!;
      }
    }

    return highestSignal;
  }

  public async part2(): Promise<string | number> {
    const computers = [];

    let highestSignal = 0;
    const perms = permutations('56789');
    for (const p of perms) {
      const n = p.split('').map(Number);
      for (let i = 0; i < 5; i += 1) {
        computers[i] = new IntCodeComputer(this.input);
        computers[i].addInputs([n[i]]);
      }

      let val = 0;
      let finished = false;

      while (!finished) {
        for (let i = 0; i < 5; i += 1) {
          computers[i].addInputs([val!]);
          finished = computers[i].compute(false);
          val = computers[i].output;
        }
      }

      if (val! > highestSignal) {
        highestSignal = val!;
      }
    }

    return highestSignal;
  }
}
