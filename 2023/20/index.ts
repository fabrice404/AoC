import { lcm } from "../../helpers/numbers";
import AoCPuzzle from "../../puzzle";

const OFF = "OFF";
const ON = "ON";

const HIGH = "-high-";
const LOW = "-low-";

type Pulse = typeof HIGH | typeof LOW;

class Module {
  public name: string;

  public targets: string[];

  constructor(name: string, targets: string[]) {
    this.name = name;
    this.targets = targets;
  }

  public receive(pulse: Pulse, emitter: string): { pulse: Pulse; targets: string[] } { // eslint-disable-line
    // console.log(`${emitter} ${pulse}> ${this.name}`);
    return { pulse, targets: this.targets };
  }
}

class FlipFlop extends Module {
  private status: typeof OFF | typeof ON;

  constructor(name: string, targets: string[]) {
    super(name, targets);
    this.status = OFF;
  }

  public receive(pulse: Pulse, emitter: string): { pulse: Pulse; targets: string[] } {// eslint-disable-line
    // console.log(`${emitter} ${pulse}> ${this.name} (${this.status})`);
    if (pulse === LOW) {
      if (this.status === OFF) {
        this.status = ON;
        return { pulse: HIGH as Pulse, targets: this.targets };
      }
      this.status = OFF;
      return { pulse: LOW as Pulse, targets: this.targets };
    }
    return { pulse, targets: [] };
  }
}

class Conjunction extends Module {
  private receivedPulses: Map<string, Pulse>;

  constructor(name: string, targets: string[]) {
    super(name, targets);
    this.receivedPulses = new Map<string, Pulse>();
  }

  public addEmitter(emitter: string): void {
    this.receivedPulses.set(emitter, LOW);
  }

  public receive(pulse: Pulse, emitter: string): { pulse: Pulse; targets: string[] } {
    // console.log(`${emitter} ${pulse}> ${this.name}`);
    this.receivedPulses.set(emitter, pulse);

    const highPulses = [...this.receivedPulses.values()].filter((x) => x === HIGH);
    if (highPulses.length === this.receivedPulses.size) {
      return { pulse: LOW, targets: this.targets };
    }
    return { pulse: HIGH, targets: this.targets };
  }
}

export default class Puzzle extends AoCPuzzle {
  private highPulses: number = 0;

  private jqCycles: Map<string, number> = new Map<string, number>();

  private lowPulses: number = 0;

  private modules: Map<string, Module> = new Map<string, Module>();

  private rxExists: boolean = false;

  private init(): void {
    this.modules = new Map<string, Module>();
    this.lowPulses = 0;
    this.highPulses = 0;

    this.modules.set("button", new Module("button", ["broadcaster"]));

    this.lines.forEach((line) => {
      const [name, ...targets] = line
        .replace(/[%&]/gi, "")
        .split(/->|,/gi)
        .map((x) => x.trim());
      if (targets.includes("rx")) {
        this.rxExists = true;
      }
      let mod: Module | undefined;
      if (line.startsWith("broadcaster")) {
        mod = new Module(name, targets);
        this.modules.set(name, mod);
      } else if (line.startsWith("%")) {
        mod = new FlipFlop(name, targets);
      } else if (line.startsWith("&")) {
        mod = new Conjunction(name, targets);
      }
      if (mod) {
        this.modules.set(name, mod);
      }
    });

    this.modules.forEach((mod) => {
      mod.targets.forEach((target) => {
        const targetMod = this.modules.get(target);
        if (targetMod instanceof Conjunction) {
          targetMod.addEmitter(mod.name);
          if (targetMod.name === "jq") {
            this.jqCycles.set(mod.name, -1);
          }
        }
      });
    });
  }

  private pushButton(i: number): boolean {
    const pulses: { emitter: string; receiver: string; pulse: Pulse }[] = this.modules.get("button")!.targets.map((target) => ({
      emitter: "button",
      receiver: target,
      pulse: LOW,
    }));

    while (pulses.length > 0) {
      const { emitter, receiver, pulse } = pulses.shift()!;
      if (pulse === HIGH) {
        this.highPulses += 1;
      } else {
        this.lowPulses += 1;
      }
      if (receiver === "jq" && pulse === HIGH) {
        this.jqCycles.set(emitter, i);
      }
      // if (receiver === 'rx') {
      //   console.log({ emitter, receiver, pulse });
      //   if (pulse === LOW) {
      //     return true;
      //   }
      // }
      if (this.modules.has(receiver)) {
        const mod = this.modules.get(receiver)!;
        const result = mod.receive(pulse, emitter);
        result.targets.forEach((t) => {
          pulses.push({ emitter: receiver, receiver: t, pulse: result.pulse });
        });
      }
    }
    return false;
  }

  public async part1(): Promise<string | number> {
    this.init();

    for (let i = 0; i < 1000; i += 1) {
      this.pushButton(i);
    }

    return this.lowPulses * this.highPulses;
  }

  public async part2(): Promise<string | number> {
    this.init();

    if (!this.rxExists) {
      return "skipped";
    }

    let i = 1;
    let go = true;
    while (go && i < Number.MAX_SAFE_INTEGER) {
      go = !this.pushButton(i);

      if ([...this.jqCycles.values()].every((x) => x > 0)) {
        return [...this.jqCycles.values()].reduce(lcm);
      }
      i += 1;
    }

    return i;
  }
}
