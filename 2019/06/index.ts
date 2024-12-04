import AoCPuzzle from "../../puzzle";

interface AstronomicalObject {
  name: string;
  orbitsOn?: AstronomicalObject;
}

export default class Puzzle extends AoCPuzzle {
  private astronomicalObjects: AstronomicalObject[] = [];

  private getObject(name: string): AstronomicalObject {
    const found = this.astronomicalObjects.find((o) => o.name === name);
    if (found) {
      return found;
    }

    this.astronomicalObjects.push({ name });
    return this.astronomicalObjects.find((o) => o.name === name)!;
  }

  public async part1(): Promise<string | number> {
    for (const line of this.lines) {
      const [from, to] = line.split(")").map((name) => this.getObject(name));
      to.orbitsOn = from;
    }

    let result = 0;
    for (const obj of this.astronomicalObjects) {
      let current = obj;
      while (current.orbitsOn) {
        result += 1;
        current = current.orbitsOn!;
      }
    }

    return result;
  }

  public async part2(): Promise<string | number> {
    const santaQueue = [];
    let current = this.astronomicalObjects.find((o) => o.name === "SAN")!;
    while (current.orbitsOn) {
      current = current.orbitsOn;
      santaQueue.push(current.name);
    }

    let i = 0;
    current = this.astronomicalObjects.find((o) => o.name === "YOU")!;
    while (current.orbitsOn) {
      current = current.orbitsOn;
      const index = santaQueue.indexOf(current.name);
      if (index !== -1) {
        return index + i;
      }
      i += 1;
    }

    return "ERROR";
  }
}
