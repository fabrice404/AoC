import { alg, Graph } from "@dagrejs/graphlib";
import { Queue } from "../../helpers/structures";
import AoCPuzzle from "../../puzzle";
import { combinations } from "../../helpers/array";

interface Tunnel {
  name: string;
  steps: number;
  weight: number;
  flowRate: number;
}

interface Valve {
  name: string;
  flowRate: number;
  maxWeight: number;
  tunnels: { [key: string]: Tunnel };
}

interface QueueItem {
  node: Valve;
  visited: string[];
  steps: number;
  flow: number;
  flowRate: number;
  totalFlowRate: number;
  priority: number;
}

export default class Puzzle extends AoCPuzzle {
  private g: Graph = new Graph();

  private rounds: number = 30;

  private valves: Valve[] = [];

  private findBestPath(valves: Valve[]) {
    const queue = new Queue<QueueItem>();
    queue.enqueue({
      node: this.valves.find((v) => v.name === "AA")!,
      visited: [],
      steps: 0,
      flow: 0,
      flowRate: 0,
      totalFlowRate: 0,
      priority: 0,
    });

    let best: QueueItem = queue.peek();
    while (!queue.isEmpty()) {
      const current = queue.dequeue()!;
      const currentVisited = current.visited;
      currentVisited.push(current.node.name);

      if (current.totalFlowRate > best.totalFlowRate) {
        best = { ...current };
      }

      for (const valve of valves) {
        if (valve.name === current.node.name) {
          continue;
        }
        const edgeName = valve.name;
        const edge = current.node.tunnels[edgeName];
        const steps = current.steps + edge.steps;

        if (currentVisited.includes(edgeName) || steps > this.rounds) {
          continue;
        }

        const flow = current.flowRate * edge.steps + current.flow;
        const flowRate = current.flowRate + valve.flowRate;
        const totalFlowRate = flowRate * (this.rounds - steps) + flow;

        const priority = current.totalFlowRate + totalFlowRate - (edge.flowRate * (this.rounds / valves.length)) / 1.4;

        if (priority <= best.priority) {
          break;
        }

        if (valves.find((v) => v.name === edge.name)) {
          queue.enqueue({
            node: valves.find((v) => v.name === edge.name)!,
            visited: [...currentVisited],
            steps,
            flow,
            flowRate,
            totalFlowRate,
            priority,
          });
        }
      }
    }
    return best.totalFlowRate;
  }

  private findBestPathMultiple() {
    const unvisited = this.valves.filter((v) => v.name !== "AA");

    const splitCount = ~~(unvisited.length / 2);
    const splitMod = unvisited.length % 2;
    let splits = combinations(unvisited, splitCount + splitMod);
    splits = splits.map((split) => [split, unvisited.slice().filter((v) => !split.includes(v))]);

    const bests: number[] = [];
    for (let i = 0; i < splits.length; i += 1) {
      bests.push(this.findBestPath(splits[i][0]) + this.findBestPath(splits[i][1]));
    }

    return bests.sort((a: number, b: number) => b - a).shift()!;
  }

  private init() {
    for (const line of this.lines) {
      const [, name, , , , rate, , , , , ...tunnels] = line.split(/\s|=|,/gi).filter(Boolean);

      this.g.setNode(name);

      tunnels.forEach((node) => {
        this.g.setNode(node);
        this.g.setEdge(name, node);
        this.g.setEdge(node, name);
      });

      this.valves.push({
        name,
        flowRate: +rate.replace(/[^0-9]/gi, ""),
        maxWeight: 0,
        tunnels: {},
      });
    }

    for (const valve of this.valves) {
      const dijkstra = alg.dijkstra(this.g, valve.name);
      let maxWeight = 0;
      for (const key of Object.keys(dijkstra).sort()) {
        if (key !== valve.name) {
          const { distance } = dijkstra[key];
          const steps = distance + 1;
          const weight = this.valves.find((v) => v.name === key)!.flowRate / steps;
          if (weight > 0) {
            valve.tunnels[key] = {
              name: key,
              steps,
              weight,
              flowRate: valve.flowRate * steps,
            };
            maxWeight = Math.max(maxWeight, weight);
          }
        }
      }
      valve.maxWeight = maxWeight;
    }

    this.valves = this.valves.filter((v) => v.flowRate > 0 || v.name === "AA").sort((a, b) => b.maxWeight - a.maxWeight);
  }

  public async part1(): Promise<string | number> {
    this.init();
    return this.findBestPath(this.valves.filter((v) => v.name !== "AA"));
  }

  public async part2(): Promise<string | number> {
    this.rounds = 26;
    return this.findBestPathMultiple();
  }
}
