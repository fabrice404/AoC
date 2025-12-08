import { randomUUID } from "crypto";
import { euclideanDistance } from "../../helpers/numbers";
import AoCPuzzle from "../../puzzle";

type JunctionBox = {
  id: string;
  x: number;
  y: number;
  z: number;
  circuit?: string;
};

type Circuit = {
  key: string;
  boxIds: Set<string>;
};

type Distance = {
  from: string;
  to: string;
  distance: number;
};

export default class Puzzle extends AoCPuzzle {
  private boxes: JunctionBox[] = [];

  private circuits: Circuit[] = [];

  private distances: Distance[] = [];

  private result: number = 0;

  private calculateCircuit(box: JunctionBox, currentCircuit?: string): void {
    if (box.circuit) {
      return;
    }

    if (!currentCircuit) {
      currentCircuit = randomUUID();
      this.circuits.push({ key: currentCircuit, boxIds: new Set() });
    }
    this.circuits.find((c) => c.key === currentCircuit)?.boxIds.add(box.id);

    box.circuit = currentCircuit;
    const connectedBoxes = this.distances.filter((d) => d.from === box.id || d.to === box.id).map((d) => (d.from === box.id ? d.to : d.from));
    for (const boxId of connectedBoxes) {
      const nextBox = this.boxes.find((b) => b.id === boxId);
      if (nextBox && !nextBox.circuit) {
        this.calculateCircuit(nextBox, currentCircuit);
      }
    }
  }

  private connectBoxes(boxA: JunctionBox, boxB: JunctionBox): void {
    if (!boxA.circuit || !boxB.circuit) {
      boxA.circuit = "hello";
      boxB.circuit = "hello";
      this.result = boxA.x * boxB.x;
    }
  }

  public async part1(): Promise<string | number> {
    const pairs = this.isExample ? 10 : 1000;

    for (const line of this.lines) {
      const key = line;
      const [x, y, z] = key.split(",").map(Number);
      this.boxes.push({ id: key, x, y, z });
    }

    for (let i = 0; i < this.boxes.length; i++) {
      for (let j = i + 1; j < this.boxes.length; j++) {
        const boxA = this.boxes[i];
        const boxB = this.boxes[j];
        const distance = euclideanDistance({ x: boxA.x, y: boxA.y, z: boxA.z }, { x: boxB.x, y: boxB.y, z: boxB.z });
        this.distances.push({ from: boxA.id, to: boxB.id, distance });
      }
    }

    this.distances = this.distances.sort((a, b) => a.distance - b.distance).filter((d, index) => index < pairs);

    for (const box of this.boxes) {
      this.calculateCircuit(box);
    }

    this.circuits.sort((a, b) => b.boxIds.size - a.boxIds.size);

    return this.circuits[0].boxIds.size * this.circuits[1].boxIds.size * this.circuits[2].boxIds.size;
  }

  public async part2(): Promise<string | number> {
    this.boxes = [];
    this.circuits = [];
    this.distances = [];

    for (const line of this.lines) {
      const key = line;
      const [x, y, z] = key.split(",").map(Number);
      this.boxes.push({ id: key, x, y, z });
    }

    for (let i = 0; i < this.boxes.length; i++) {
      for (let j = i + 1; j < this.boxes.length; j++) {
        const boxA = this.boxes[i];
        const boxB = this.boxes[j];
        const distance = euclideanDistance({ x: boxA.x, y: boxA.y, z: boxA.z }, { x: boxB.x, y: boxB.y, z: boxB.z });
        this.distances.push({ from: boxA.id, to: boxB.id, distance });
      }
    }
    this.distances.sort((a, b) => a.distance - b.distance);

    for (const distance of this.distances) {
      const boxA = this.boxes.find((b) => b.id === distance.from);
      const boxB = this.boxes.find((b) => b.id === distance.to);
      if (boxA && boxB) {
        this.connectBoxes(boxA, boxB);
      }
    }

    this.circuits.sort((a, b) => b.boxIds.size - a.boxIds.size);

    return this.result;
  }
}
