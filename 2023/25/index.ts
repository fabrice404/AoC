import { existsSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import AoCPuzzle from '../../puzzle';
import { addUniqueItem } from '../../helpers/array';

interface Component {
  name: string;
  components: string[];
}

export default class Puzzle extends AoCPuzzle {
  private components: Component[] = [];

  private getComponent(name: string): Component {
    let component = this.components.find((c) => c.name === name);
    if (!component) {
      component = { name, components: [] };
      this.components.push(component);
    }
    return component;
  }

  public async part1(): Promise<string | number> {
    let dot = 'graph {\n';
    this.lines.forEach((line) => {
      const [source, targetList] = line.split(/:/gi).map((s) => s.trim());
      const targets = targetList.split(' ').map((s) => s.trim());
      dot += `  ${source} -- ${targets.join(',')}\n`;
      targets.forEach((target) => {
        const sourceComponent = this.getComponent(source);
        const targetComponent = this.getComponent(target);
        addUniqueItem(sourceComponent.components, target);
        addUniqueItem(targetComponent.components, source);
      });
    });
    dot += '}\n';

    let toRemove: string[][] = [];
    if (this.isExample) {
      if (!existsSync('./2023/25/example.dot')) {
        writeFileSync('./2023/25/example.dot', dot);
      }
      if (!existsSync('./2023/25/example.svg')) {
        execSync('neato -Tsvg ./2023/25/example.dot -o ./2023/25/example.svg');
      }
      toRemove = [['jqt', 'nvd'], ['bvb', 'cmg'], ['hfx', 'pzl']];
    } else {
      if (!execSync) {
        writeFileSync('./2023/25/input.dot', dot);
      }
      if (!existsSync('./2023/25/input.svg')) {
        execSync('neato -Tsvg ./2023/25/input.dot -o ./2023/25/input.svg');
      }
      toRemove = [['frl', 'thx'], ['lhg', 'llm'], ['ccp', 'fvm']];
    }

    toRemove.forEach(([nodeName1, nodeName2]) => {
      const node1 = this.components.find((c) => c.name === nodeName1);
      const node2 = this.components.find((c) => c.name === nodeName2);
      if (node1) {
        node1.components = node1.components.filter((c) => c !== nodeName2);
      }
      if (node2) {
        node2.components = node2.components.filter((c) => c !== nodeName1);
      }
    });

    const viewed: string[] = [this.components[0].name];
    const components = [...this.components[0].components];
    while (components.length > 0) {
      const name = components.shift();
      const component = this.components.find((c) => c.name === name);
      if (component) {
        addUniqueItem(viewed, component.name);
        component.components.forEach((c) => {
          if (!viewed.includes(c)) {
            addUniqueItem(components, c);
          }
        });
      }
    }

    return (this.components.length - viewed.length) * viewed.length;
  }

  public async part2(): Promise<string | number> {
    return 'Happy Xmas!';
  }
}
