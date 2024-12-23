import AoCPuzzle from "../../puzzle";

interface Network {
  computers: string[];
  candidates: string[];
}

export default class Puzzle extends AoCPuzzle {
  private computers: Map<string, number> = new Map();

  private connections: Set<string> = new Set();

  private computersToNetwork(a: string, b: string): string {
    return [a, b].sort().join(",");
  }

  private hasEdge(a: string, b: string): boolean {
    return this.connections.has(this.computersToNetwork(a, b));
  }

  public async part1(): Promise<string | number> {
    this.lines.forEach((line) => {
      const [a, b] = line.split("-");
      this.connections.add(this.computersToNetwork(a, b));
      this.computers.set(a, (this.computers.get(a) || 0) + 1);
      this.computers.set(b, (this.computers.get(b) || 0) + 1);
    });

    const results: Set<string> = new Set();

    for (const network of this.connections) {
      const [a, b] = network.split(",");

      for (const c of this.computers.keys()) {
        if (c === a || c === b) {
          continue;
        }
        if (this.hasEdge(a, c) && this.hasEdge(b, c)) {
          if (a.startsWith("t") || b.startsWith("t") || c.startsWith("t")) {
            results.add([a, b, c].sort().join(","));
          }
        }
      }
    }

    return results.size;
  }

  public async part2(): Promise<string | number> {
    const cpus = [...this.computers.keys()].sort();
    let maxLen = 0;
    let longest: string[] = [];

    const networkQueue: Network[] = [];
    for (let i = 0; i < cpus.length; i += 1) {
      const cpu = cpus[i];
      networkQueue.push({ computers: [cpu], candidates: cpus.filter((candidate) => this.hasEdge(cpu, candidate)) });
    }

    while (networkQueue.length > 0) {
      const current = networkQueue.pop()!;
      if (current.computers.length > maxLen) {
        longest = current.computers;
        maxLen = longest.length;
        console.log(longest.join(","));
      }

      const candidate = current.candidates.shift()!;
      if (current.computers.every((cpu) => this.hasEdge(cpu, candidate))) {
        networkQueue.push({ computers: [...current.computers, candidate], candidates: current.candidates });
      }
    }

    return longest.sort().join(",");
  }
}
