import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private movePosition(password: string[], x: number, y: number): string[] {
    const letter = password.splice(x, 1)[0];
    password.splice(y, 0, letter);
    return password;
  }

  private reversePositions(password: string[], x: number, y: number): string[] {
    const reversed = password.slice(x, y + 1).reverse();
    for (let i = x; i <= y; i += 1) {
      password[i] = reversed[i - x];
    }
    return password;
  }

  private rotateLeft(password: string[], x: number): string[] {
    for (let i = 0; i < x; i += 1) {
      password.push(password.shift()!);
    }
    return password;
  }

  private rotatePosition(password: string[], x: string): string[] {
    const index = password.indexOf(x);
    const rotations = 1 + index + (index >= 4 ? 1 : 0);
    return this.rotateRight(password, rotations);
  }

  private rotatePositionOpposite(password: string[], x: string): string[] {
    const idx = password.indexOf(x);
    let ido = 0;
    for (let i = 0; i < password.length; i += 1) {
      let j = i + 1;
      if (i >= 4) {
        j += 1;
      }
      j += i;
      if (j % password.length === idx) {
        ido = i;
      }
    }
    const r = idx - ido;
    if (r < 0) {
      return this.rotateRight(password, -r);
    }
    return this.rotateLeft(password, r);
  }

  private rotateRight(password: string[], x: number): string[] {
    for (let i = 0; i < x; i += 1) {
      password.unshift(password.pop()!);
    }
    return password;
  }

  private swapLetters(password: string[], x: string, y: string): string[] {
    for (let i = 0; i < password.length; i += 1) {
      if (password[i] === x) {
        password[i] = y;
      } else if (password[i] === y) {
        password[i] = x;
      }
    }
    return password;
  }

  private swapPositions(password: string[], x: number, y: number): string[] {
    const tmp = password[x];
    password[x] = password[y];
    password[y] = tmp;
    return password;
  }

  public async part1(): Promise<string | number> {
    let password = (this.isExample ? "abcde" : "abcdefgh").split("");

    for (const line of this.lines) {
      if (line.startsWith("swap position")) {
        const [, x, y] = line.match(/swap position (\d+) with position (\d+)/)!.map(Number);
        password = this.swapPositions(password, x, y);
      } else if (line.startsWith("swap letter")) {
        const [, x, y] = line.match(/swap letter (\w) with letter (\w)/)!;
        password = this.swapLetters(password, x, y);
      } else if (line.startsWith("rotate left")) {
        const [, x] = line.match(/rotate left (\d+)/)!.map(Number);
        password = this.rotateLeft(password, x);
      } else if (line.startsWith("rotate right")) {
        const [, x] = line.match(/rotate right (\d+)/)!.map(Number);
        password = this.rotateRight(password, x);
      } else if (line.startsWith("rotate based")) {
        const [, x] = line.match(/rotate based on position of letter (\w)/)!;
        password = this.rotatePosition(password, x);
      } else if (line.startsWith("reverse positions")) {
        const [, x, y] = line.match(/reverse positions (\d+) through (\d+)/)!.map(Number);
        password = this.reversePositions(password, x, y);
      } else if (line.startsWith("move position")) {
        const [, x, y] = line.match(/move position (\d+) to position (\d+)/)!.map(Number);
        password = this.movePosition(password, x, y);
      }
    }

    return password.join("");
  }

  public async part2(): Promise<string | number> {
    let password = "fbgdceah".split("");

    for (const line of this.lines.reverse()) {
      if (line.startsWith("swap position")) {
        const [, x, y] = line.match(/swap position (\d+) with position (\d+)/)!.map(Number);
        password = this.swapPositions(password, x, y);
      } else if (line.startsWith("swap letter")) {
        const [, x, y] = line.match(/swap letter (\w) with letter (\w)/)!;
        password = this.swapLetters(password, x, y);
      } else if (line.startsWith("rotate left")) {
        const [, x] = line.match(/rotate left (\d+)/)!.map(Number);
        password = this.rotateRight(password, x);
      } else if (line.startsWith("rotate right")) {
        const [, x] = line.match(/rotate right (\d+)/)!.map(Number);
        password = this.rotateLeft(password, x);
      } else if (line.startsWith("rotate based")) {
        const [, x] = line.match(/rotate based on position of letter (\w)/)!;
        password = this.rotatePositionOpposite(password, x);
      } else if (line.startsWith("reverse positions")) {
        const [, x, y] = line.match(/reverse positions (\d+) through (\d+)/)!.map(Number);
        password = this.reversePositions(password, x, y);
      } else if (line.startsWith("move position")) {
        const [, x, y] = line.match(/move position (\d+) to position (\d+)/)!.map(Number);
        password = this.movePosition(password, y, x);
      }
    }

    return password.join("");
  }
}
