import { sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

type Device = {
  id: string;
  outputs: string[];
};

export default class Puzzle extends AoCPuzzle {
  private cache: Map<string, number> = new Map();

  private devices: Device[] = [];

  private goTo(deviceId: string, target: string, visited: string[]): number {
    if (visited.length === 0) {
      this.cache.clear();
    }
    if (this.cache.has(deviceId)) {
      return this.cache.get(deviceId)!;
    }

    if (deviceId === target) {
      return 1;
    }

    const device = this.devices.find((d) => d.id === deviceId);
    if (device) {
      const result = sum(device.outputs.filter((output) => !visited.includes(output)).map((output) => this.goTo(output, target, [...deviceId])));
      this.cache.set(deviceId, result);
      return result;
    }
    return 0;
  }

  public async part1(): Promise<string | number> {
    this.devices = this.lines.map((line) => {
      const [id, outputStr] = line.split(": ");
      const outputs = outputStr.split(" ");
      return { id, outputs };
    });

    return this.goTo("you", "out", []);
  }

  public async part2(): Promise<string | number> {
    this.devices = this.lines.map((line) => {
      const [id, outputStr] = line.split(": ");
      const outputs = outputStr.split(" ");
      return { id, outputs };
    });

    const svrToFft = this.goTo("svr", "fft", []);
    const fftToDac = this.goTo("fft", "dac", []);
    const dacToOut = this.goTo("dac", "out", []);

    const svrToDac = this.goTo("svr", "dac", []);
    const dacToFft = this.goTo("dac", "fft", []);
    const fftToOut = this.goTo("fft", "out", []);

    return svrToFft * fftToDac * dacToOut + svrToDac * dacToFft * fftToOut;
  }
}
