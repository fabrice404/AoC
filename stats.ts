import { existsSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

const generateReadme = (folder: string) => {
  const stats = JSON.parse(readFileSync(`${folder}/stats.json`, "utf8"));
  let readme = `# ${folder.split(/\//gi).pop()}\n\n`;
  readme += "Day | Part 1 | Part 1 | Part 2 | Part 2\n";
  readme += ":---:|---:|---:|---:|---:\n";

  Object.keys(stats)
    .sort((a, b) => (+a > +b ? 1 : -1))
    .forEach((day) => {
      const stat = stats[day];
      if (`${stat.part1ExampleResult}`.match(/[\n]/)) {
        stat.part1ExampleResult = "...";
      }
      if (`${stat.part1Result}`.match(/[\n]/)) {
        stat.part1Result = "...";
      }
      if (`${stat.part2ExampleResult}`.match(/[\n]/)) {
        stat.part2ExampleResult = "...";
      }
      if (`${stat.part2Result}`.match(/[\n]/)) {
        stat.part2Result = "...";
      }

      readme += `${day} `;
      readme += `| ${stat.part1ExampleTime.toFixed(3)}ms <br/><sub><sup>${stat.part1ExampleResult}</sup></sub> `;
      readme += `| ${stat.part1Time.toFixed(3)}ms <br/><sub><sup>${stat.part1Result}</sup></sub> `;
      readme += `| ${stat.part2ExampleTime.toFixed(3)}ms <br/><sub><sup>${stat.part2ExampleResult}</sup></sub> `;
      readme += `| ${stat.part2Time.toFixed(3)}ms <br/><sub><sup>${stat.part2Result}</sup></sub> `;
      readme += "\n";
    });

  writeFileSync(`${folder}/README.md`, readme, "utf8");
};

const main = () => {
  readdirSync(__dirname, { withFileTypes: true }).forEach((dirent) => {
    if (dirent.isDirectory() && dirent.name.match(/^\d{4}$/)) {
      const folder = join(__dirname, dirent.name);
      if (existsSync(`${folder}/stats.json`)) {
        generateReadme(folder);
      }
    }
  });
};

main();
