import axios from "axios";
import dotenv from "dotenv";
import { existsSync } from "fs";
import { performance } from "perf_hooks";
import { generateCodeFile, generateStatFile, readFile, updateStatFile, writeFile } from "./helpers/file";

dotenv.config();

const today = new Date();
let year = today.getFullYear().toString();
let day = today.getDate().toString();

if (today.getMonth() < 11) {
  day = "1";
}

if (process.argv.length > 2) {
  [year, day] = process.argv[2].split(/\//gi);
}

year = year.padStart(4, "0");
day = day.padStart(2, "0");

const folder = `${__dirname}/${year}/${day}`;
const codeFile = `${folder}/index.ts`;
const statFile = `${__dirname}/${year}/stats.json`;

const inputFile = `${folder}/input.txt`;
const p1ExampleFile = `${folder}/example-part1.txt`;
const p2ExampleFile = `${folder}/example-part2.txt`;
const p1ExpectedFile = `${folder}/expected-part1.txt`;
const p2ExpectedFile = `${folder}/expected-part2.txt`;

if (!existsSync(codeFile)) {
  generateCodeFile(folder);
}

if (!existsSync(statFile)) {
  generateStatFile(statFile);
}

const downloadInput = async () => {
  if (!existsSync(inputFile)) {
    const response = await axios.get(`https://adventofcode.com/${+year}/day/${+day}/input`, {
      headers: {
        Cookie: `session=${process.env.SESSION_TOKEN}`,
      },
    });
    writeFile(inputFile, response.data);
  }
};

const readableTime = (ms: number) => {
  if (ms < 1) {
    return `${(ms * 1000).toFixed(0)} ns`;
  }
  if (ms < 1000) {
    return `${ms.toFixed(0)} ms`;
  }
  return `${(ms / 1000).toFixed(0)} s`;
};

const resultMessage = (label: string, value: string, time: number, color: number = 0) => {
  const message = [label.padEnd(25, " "), `\x1b[${`${color}`.padStart(2, "0")}m${value}\x1b[0m`.padStart(30, " "), `(${readableTime(time)})`];

  console.log(message.join(" "));
};

const failedMessage = (label: string, value: string, expected: string, time: number) => {
  const message = [label.padEnd(25, " "), ` `.padStart(21, " "), `(${readableTime(time)})`, `\n\x1b[41m${value}\x1b[0m\n\x1b[42m${expected}\x1b[0m`];
  throw message.join(" ");
};

import(codeFile)
  .then(async ({ default: Puzzle }) => {
    const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date(Number(year), 11, Number(day)).getDay()];
    const date = `${dayName} ${year}-12-${day}`;
    console.log(`\n${date}\n`);

    console.log("+------------------------------------------------------+");
    console.log("|                        PART 1                        |");
    console.log("+------------------------------------------------------+");

    // part 1 - example
    await downloadInput();
    const input = readFile(inputFile);
    let example = readFile(p1ExampleFile);
    let expected = readFile(p1ExpectedFile);
    const examplePuzzle = new Puzzle(example, true);

    let part1ExampleResult = "skip";
    let part1ExampleTime = 0;

    if (expected === "skip") {
      resultMessage("Test case skipped", "", part1ExampleTime);
    } else {
      const part1ExampleStart = performance.now();
      part1ExampleResult = await examplePuzzle.part1();
      const part1ExampleEnd = performance.now();
      part1ExampleTime = part1ExampleEnd - part1ExampleStart;

      if (`${part1ExampleResult}` !== `${expected}`) {
        failedMessage("Test case failed:", part1ExampleResult, expected, part1ExampleTime);
      } else {
        resultMessage("Test case success:", part1ExampleResult, part1ExampleTime, 42);
      }
    }

    // part 1 - puzzle
    const part1Start = performance.now();
    const puzzle = new Puzzle(input);
    const part1Result = await puzzle.part1();
    const part1End = performance.now();
    const part1Time = part1End - part1Start;

    resultMessage("Result:", part1Result, part1Time);

    console.log("");
    console.log("+------------------------------------------------------+");
    console.log("|                        PART 2                        |");
    console.log("+------------------------------------------------------+");

    // part 2 - example
    example = readFile(p2ExampleFile);
    expected = readFile(p2ExpectedFile);

    let part2ExampleResult = "skip";
    let part2ExampleTime = 0;

    if (expected === "skip") {
      resultMessage("Test case skipped", "", part2ExampleTime);
    } else {
      const part2ExampleStart = performance.now();
      if (example) {
        examplePuzzle.setInput(example);
      }
      part2ExampleResult = await examplePuzzle.part2();
      const part2ExampleEnd = performance.now();
      part2ExampleTime = part2ExampleEnd - part2ExampleStart;

      if (`${part2ExampleResult}` !== `${expected}`) {
        failedMessage("Test case failed:", part2ExampleResult, expected, part2ExampleTime);
      } else {
        resultMessage("Test case success:", part2ExampleResult, part2ExampleTime, 42);
      }
    }

    // part 2 - puzzle
    const part2Start = performance.now();
    const part2Result = await puzzle.part2();
    const part2End = performance.now();
    const part2Time = part2End - part2Start;

    resultMessage("Result:", part2Result, part2Time);

    console.log("");
    updateStatFile(statFile, +day, {
      part1ExampleResult,
      part1ExampleTime,
      part1Result,
      part1Time,
      part2ExampleResult,
      part2ExampleTime,
      part2Result,
      part2Time,
    });
  })
  .catch(console.log);
