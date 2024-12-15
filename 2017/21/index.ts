import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private book: Map<string, string> = new Map();

  private image: string[] = [];

  private draw(pixels: string[]): string[] {
    const g = [];
    const num = Math.sqrt(pixels.length);
    const strlen = (pixels[0].match(/\//g) || []).length + 1;
    for (let i = 0; i < pixels.length; i += num)
      for (let j = 0; j < strlen; j += 1) {
        let str = "";
        for (let k = 0; k < num; k += 1) {
          str += pixels[i + k].split("/")[j];
        }
        g.push(str);
      }
    return g;
  }

  private getPixels() {
    const num = this.image.length % 2 === 0 ? 2 : 3;
    const rows = [];

    for (let i = 0; i < this.image.length; i += num) {
      for (let j = 0; j < this.image.length; j += num) {
        const pixels: string[] = [];
        for (let k = 0; k < num; k += 1) {
          pixels.push(this.image[i + k].substring(j, j + num));
        }
        rows.push(pixels.join("/"));
      }
    }

    return rows;
  }

  private getRule(str: string) {
    for (let i = 0; i < 2; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        const key = this.morph(str, j, i);
        if (this.book.has(key)) {
          return this.book.get(key)!;
        }
      }
    }
    throw new Error(`Rule cannot be found for ${str}`);
  }

  private morph(str: string, rotate: number, flip: number) {
    let s = str.split("/");
    if (flip) s.reverse();

    for (let r = 0; r < rotate; r += 1) {
      const n = [];
      for (let i = 0; i < s.length; i += 1) {
        let news = "";
        for (let j = s.length - 1; j >= 0; j--) news += s[j][i];
        n.push(news);
      }
      s = n;
    }
    return s.join("/");
  }

  private run(iterations: number) {
    this.image = [".#.", "..#", "###"];
    for (let i = 0; i < iterations; i += 1) {
      const pixels = this.getPixels();
      for (let l = 0; l < pixels.length; l += 1) {
        pixels[l] = this.getRule(pixels[l]);
      }
      this.image = this.draw(pixels);
    }
    return this.image
      .flat()
      .join("")
      .split("")
      .filter((x) => x === "#").length;
  }

  public async part1(): Promise<string | number> {
    for (const line of this.lines) {
      const [key, value] = line.split(" => ");
      this.book.set(key, value);
    }

    return this.run(this.isExample ? 2 : 5);
  }

  public async part2(): Promise<string | number> {
    return this.run(18);
  }
}
