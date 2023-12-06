/**
 * Returns true if the *input* string has the same letter *times* times
 * @param input
 * @param times
 * @returns
 */
export const hasSameLetterTimes = (input: string, times: number) => {
  const map = new Map<string, number>();
  input.split('').forEach((char) => {
    const count = map.get(char) || 0;
    map.set(char, count + 1);
  });
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
