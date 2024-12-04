import AoCPuzzle from "../../puzzle";

interface Node {
  name: string;
  previous: string[];
  finished: boolean;
  duration: number;
  running: boolean;
}

export default class Puzzle extends AoCPuzzle {
  private nodes: Node[] = [];

  private running: Node[] = [];

  private workers = 0;

  private assignAvailableWorkers(): void {
    const runnable = this.nodes.filter((n) => !n.finished && !n.running && n.previous.length === 0).sort((a, b) => (a.name > b.name ? 1 : -1));
    const available = this.workers - this.running.length;
    for (let i = 0; i < available; i += 1) {
      const job = runnable.shift();
      if (job) {
        job.running = true;
        this.running.push(job);
      }
    }
  }

  private findNode(name: string): Node {
    let result = this.nodes.find((node) => node.name === name);
    if (!result) {
      this.nodes.push({
        name,
        previous: [],
        finished: false,
        duration: this.lines.length === 7 ? name.charCodeAt(0) - 64 : name.charCodeAt(0) - 4,
        running: false,
      });
      result = this.nodes.find((node) => node.name === name);
    }
    return result!;
  }

  public async part1(): Promise<string | number> {
    this.lines.forEach((line) => {
      const [, a, b] = line.match(/Step (\w) must be finished before step (\w) can begin./)!;
      const nodeA = this.findNode(a);
      const nodeB = this.findNode(b);
      nodeB.previous.push(nodeA.name);
      nodeB.previous.sort();
    });

    let response = "";
    let currentNode: Node | undefined = this.nodes.sort((a, b) => (a.name > b.name ? 1 : -1)).find((n) => !n.finished && n.previous.length === 0)!;

    while (currentNode) {
      response += currentNode.name;
      currentNode.finished = true;
      this.nodes
        .filter((n) => n.previous.includes(currentNode!.name))
        .forEach((n) => {
          n.previous = n.previous.filter((p) => p !== currentNode!.name);
        });
      currentNode = this.nodes.sort((a, b) => (a.name > b.name ? 1 : -1)).find((n) => !n.finished && n.previous.length === 0)!;
    }

    return response;
  }

  public async part2(): Promise<string | number> {
    this.workers = this.lines.length === 7 ? 2 : 5;
    this.nodes = [];
    this.lines.forEach((line) => {
      const [, a, b] = line.match(/Step (\w) must be finished before step (\w) can begin./)!;
      const nodeA = this.findNode(a);
      const nodeB = this.findNode(b);
      nodeB.previous.push(nodeA.name);
      nodeB.previous.sort();
    });

    let seconds = 0;
    this.assignAvailableWorkers();

    while (this.nodes.find((n) => !n.finished)) {
      console.log(seconds, this.running.map((n) => `${n.name}(${n.duration})`).join(""));
      this.running.forEach((currentNode) => {
        currentNode.duration -= 1;
        if (currentNode.duration === 0) {
          currentNode.finished = true;
          this.nodes
            .filter((n) => n.previous.includes(currentNode!.name))
            .forEach((n) => {
              n.previous = n.previous.filter((p) => p !== currentNode!.name);
            });
        }
      });

      this.running = this.running.filter((n) => !n.finished);
      this.assignAvailableWorkers();

      seconds += 1;
    }

    return seconds;
  }
}
