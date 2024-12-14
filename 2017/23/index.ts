import AoCPuzzle from "../../puzzle";

type Register = { [key: string]: number };

export default class Puzzle extends AoCPuzzle {
  private registers: Register = {};

  private getRegister(r: string | number): number {
    if (Number.isNaN(+r)) {
      return this.registers[r];
    }
    return +r;
  }

  public async part1(): Promise<string | number> {
    "abcdefgh".split("").forEach((r) => (this.registers[r] = 0));
    let result = 0;
    for (let i = 0; i < this.lines.length; i += 1) {
      const [cmd, x, y] = this.lines[i].split(/\s/gi);
      switch (cmd) {
        case "set":
          this.registers[x] = this.getRegister(y);
          break;
        case "sub":
          this.registers[x] -= this.getRegister(y);
          break;
        case "mul":
          result += 1;
          this.registers[x] *= this.getRegister(y);
          break;
        case "jnz":
          if (this.getRegister(x) !== 0) {
            i += this.getRegister(y) - 1;
          }
          break;
      }
    }
    return result;
  }

  public async part2(): Promise<string | number> {
    this.registers = {};
    // const a = 1;
    let b = 0;
    let c = 0;
    let d = 0;
    // const e = 0;
    let f = 0;
    // const g = 0;
    let h = 0;

    /*
    // set b 67
    b = 67;

    // set c b
    c = b;

    // jnz a 2 <- A is never 0
    // jnz 1 5 <- 1 is never 0
    // mul b 100
    // sub b -100000
    b = b * 100 + 100000;
    //    set c b
    //    sub c -17000
    c = b + 17000;
    */
    b = 106700;
    c = 123700;

    do {
      // set f 1
      f = 1;

      // set d 2
      d = 2;

      do {
        /*
        // set e 2
        e = 2;

        do {
          // set g d
          // mul g e
          // sub g b
          // g = d * e - b;

          // jnz g 2
          // if (g === 0) {
          if (d * e === b) {
            // set f 0
            f = 0;
          }

          // sub e -1
          e += 1;

          // set g e
          // sub g b
          // g = e - b;

          // jnz g -8
          // } while (g !== 0);
        } while (e !== b);
        */

        if (b % d === 0) {
          f = 0;
        }

        // sub d -1
        d += 1;

        // set g d
        // sub g b
        // g = d - b;

        // jnz g -13
        // } while (g !== 0);
      } while (d !== b);

      // jnz f 2
      if (f === 0) {
        h += 1;
      }

      // set g b
      // sub g c

      // g = b - c;

      // jnz g 2
      // if (g === 0) {
      if (b === c) {
        // jnz 1 3
        break;
      }

      // sub b -17
      b += 17;

      // jnz 1 -23
    } while (true); // eslint-disable-line no-constant-condition

    return h;
  }
}
