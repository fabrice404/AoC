import AoCPuzzle from '../../puzzle';

class Node {
  private _parent?: Node;

  public children: Node[] = [];

  public childrenWeight: number = 0;

  public totalWeight: number = 0;

  constructor(public name: string, public weight: number) {
  }

  set parent(parent: Node) {
    this._parent = parent;
    this._parent.children.push(this);
  }

  get parent(): Node | undefined {
    return this._parent;
  }
}

export default class Puzzle extends AoCPuzzle {
  private nodes: Node[] = [];

  private root?: Node;

  private findNode(name: string): Node {
    const found = this.nodes.find((n) => n.name === name);
    if (!found) {
      this.nodes.push(new Node(name, 0));
      return this.nodes.find((n) => n.name === name) as Node;
    }
    return found;
  }

  public async part1(): Promise<string | number> {
    for (const line of this.lines) {
      const [name, weight] = line.split(/\s/gi);
      const parent = this.findNode(name);
      parent.weight = parseInt(weight.replace(/[()]/gi, ''), 10);

      if (line.match(' -> ')) {
        line
          .split(' -> ')[1]
          .split(', ')
          .forEach((childName) => {
            const child = this.findNode(childName);
            child.parent = parent;
          });
      }
    }
    this.root = this.nodes.find((n) => !n.parent)!;
    return this.root.name;
  }

  private computeBranchesWeight(node: Node): number {
    node.childrenWeight = node.children.reduce((acc, child) => acc + this.computeBranchesWeight(child), 0);
    node.totalWeight = node.weight + node.childrenWeight;
    return node.totalWeight;
  }

  private findUnbalancedNode(node: Node): Node | undefined {
    if (node.children.length === 0) {
      return;
    }

    const weights = node.children.map((child) => this.computeBranchesWeight(child));
    const uniqueWeights = Array.from(new Set(weights));
    if (uniqueWeights.length === 1) {
      return;
    }

    const [unbalancedWeight] = uniqueWeights.filter((weight) => weights.filter((w) => w === weight).length === 1);
    const unbalancedNode = node.children.find((child) => this.computeBranchesWeight(child) === unbalancedWeight)!;
    return this.findUnbalancedNode(unbalancedNode) || unbalancedNode;
  }

  public async part2(): Promise<string | number> {
    const unbalancedNode = this.findUnbalancedNode(this.root!);
    const unbalancedParent = unbalancedNode!.parent;
    const diff = unbalancedParent!.children.find((child) => child !== unbalancedNode)!.totalWeight - unbalancedNode!.totalWeight;
    return unbalancedNode!.weight + diff;
  }
}
