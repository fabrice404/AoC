import AoCPuzzle from "../../puzzle";

interface Connection {
  to: City;
  distance: number;
}

interface City {
  name: string;
  connections: Connection[];
}

export default class Puzzle extends AoCPuzzle {
  private cities: City[] = [];

  private max: number = Number.MIN_SAFE_INTEGER;

  private min: number = Number.MAX_SAFE_INTEGER;

  private getCity(name: string): City {
    let city = this.cities.find((c) => c.name === name);
    if (!city) {
      city = { name, connections: [] };
      this.cities.push(city);
    }
    return city;
  }

  public calculateRoutes(city: City, visited: City[], distance: number) {
    if (visited.length === this.cities.length) {
      return { min: distance, max: distance };
    }
    let minDistance = Number.MAX_SAFE_INTEGER;
    let maxDistance = Number.MIN_SAFE_INTEGER;
    for (const connection of city.connections) {
      if (!visited.includes(connection.to)) {
        const routeDistance = this.calculateRoutes(connection.to, [...visited, connection.to], distance + connection.distance);
        minDistance = Math.min(minDistance, routeDistance.min);
        maxDistance = Math.max(maxDistance, routeDistance.max);
      }
    }
    return { min: minDistance, max: maxDistance };
  }

  public async part1(): Promise<string | number> {
    for (const line of this.lines) {
      const [from, to, distance] = line.split(/ to | = /);
      const fromCity = this.getCity(from);
      const toCity = this.getCity(to);
      fromCity.connections.push({ to: toCity, distance: +distance });
      toCity.connections.push({ to: fromCity, distance: +distance });
    }

    for (const city of this.cities) {
      const distance = this.calculateRoutes(city, [city], 0);
      this.min = Math.min(this.min, distance.min);
      this.max = Math.max(this.max, distance.max);
    }
    return this.min;
  }

  public async part2(): Promise<string | number> {
    return this.max;
  }
}
