import crypto from "node:crypto";

import { countItems } from "./array";

/**
 * Count each letter in the *input* string
 * @param input
 * @returns Map<string, number>
 */
export const countLetters = (input: string): Map<string, number> => countItems(input.split(""));

/**
 * Returns true if the *input* string has the same letter *times* times
 * @param input
 * @param times
 * @returns boolean
 */
export const hasSameLetterTimes = (input: string, times: number) => {
  const map = countLetters(input);
  return Array.from(map.values()).some((value) => value === times);
};

/**
 * Returns true if the two strings have only *times* different letter
 * @param a
 * @param b
 * @param times
 * @returns
 */
export const hasDifferentLetterTimes = (a: string, b: string, times: number) => {
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      diff += 1;
    }
  }
  return diff === times;
};

export const replaceAt = (a: string, index: number, replacement: string) => `${a.substring(0, index)}${replacement}${a.substring(index + replacement.length)}`;

export const permutations = (s: string): string[] => {
  if (s.length < 2) {
    return [s];
  }
  const result: string[] = [];
  for (let i = 0; i < s.length; i += 1) {
    const c = s[i];

    if (s.indexOf(c) !== i) {
      continue;
    }

    for (const sub of permutations(`${s.slice(0, i)}${s.slice(i + 1, s.length)}`)) {
      result.push(`${c}${sub}`);
    }
  }
  return result;
};

export const isAscii = (num: number) => num > 0 && num <= 128;

export const splice = (str: string, index: number, count: number, add: string): string => `${str.slice(0, index)}${add || ""}${str.slice(index + count)}`;

export const md5 = (str: string) => crypto.createHash("md5").update(str).digest("hex");
