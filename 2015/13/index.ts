import AoCPuzzle from "../../puzzle";

interface Connection {
  to: Person;
  happiness: number;
}

interface Person {
  name: string;
  connections: Connection[];
}

interface Route {
  visited: Person[];
  happiness: number[];
}

export default class Puzzle extends AoCPuzzle {
  private max: number = Number.MIN_SAFE_INTEGER;

  private persons: Person[] = [];

  private getPerson(name: string): Person {
    let person = this.persons.find((p) => p.name === name);
    if (!person) {
      person = { name, connections: [] };
      this.persons.push(person);
    }
    return person;
  }

  public calculateRoutes(person: Person, visited: Person[], happiness: number[]): Route[] {
    const result: Route[] = [];

    if (visited.length === this.persons.length) {
      result.push({ visited, happiness });
    }

    for (const connection of person.connections) {
      if (!visited.includes(connection.to)) {
        const happinessFromTo = connection.happiness;
        const happinessToFrom = connection.to.connections.find((c) => c.to === person)!.happiness;
        result.push(...this.calculateRoutes(connection.to, [...visited, connection.to], [...happiness, happinessFromTo, happinessToFrom]));
      }
    }

    return result;
  }

  public async part1(): Promise<string | number> {
    for (const line of this.lines) {
      const [from, , happiness, score, , , , , , , to] = line.slice(0, -1).split(/\s/gi);
      const fromPerson = this.getPerson(from);
      const toPerson = this.getPerson(to);

      fromPerson.connections.push({
        to: toPerson,
        happiness: happiness === "gain" ? +score : -+score,
      });
    }
    for (const person of this.persons) {
      const routes = this.calculateRoutes(person, [person], []);

      for (const route of routes) {
        const last = route.visited[route.visited.length - 1];
        const happinessFromTo = person.connections.find((c) => c.to === last)!.happiness;
        const happinessToFrom = last.connections.find((c) => c.to === person)!.happiness;

        const happiness = route.happiness.reduce((acc, val) => acc + val, 0) + happinessFromTo + happinessToFrom;
        if (happiness > this.max) {
          this.max = happiness;
        }
      }
    }
    return this.max;
  }

  public async part2(): Promise<string | number> {
    this.persons = [];
    this.max = Number.MIN_SAFE_INTEGER;

    for (const line of this.lines) {
      const [from, , happiness, score, , , , , , , to] = line.slice(0, -1).split(/\s/gi);
      const fromPerson = this.getPerson(from);
      const toPerson = this.getPerson(to);

      fromPerson.connections.push({
        to: toPerson,
        happiness: happiness === "gain" ? +score : -+score,
      });
    }
    const me = this.getPerson("me");

    for (const person of this.persons) {
      person.connections.push({ to: me, happiness: 0 });
      me.connections.push({ to: person, happiness: 0 });
    }

    for (const person of this.persons) {
      const routes = this.calculateRoutes(person, [person], []);

      for (const route of routes) {
        const last = route.visited[route.visited.length - 1];
        const happinessFromTo = person.connections.find((c) => c.to === last)!.happiness;
        const happinessToFrom = last.connections.find((c) => c.to === person)!.happiness;

        const happiness = route.happiness.reduce((acc, val) => acc + val, 0) + happinessFromTo + happinessToFrom;
        if (happiness > this.max) {
          this.max = happiness;
        }
      }
    }
    return this.max;
  }
}
