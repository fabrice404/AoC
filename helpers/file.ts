import {
  copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync,
} from 'fs';
import path from 'path';

/**
 * Read a file and return the contents
 * @param path
 * @returns string
 */
export const readFile = (filepath: string): string => {
  if (!existsSync(filepath)) {
    writeFileSync(filepath, '', { encoding: 'utf-8' });
  }
  return readFileSync(filepath, 'utf8').trimEnd();
};

/**
 *
 * @param filepath string
 * @param content string
 */
export const writeFile = (filepath: string, content: string): void => {
  writeFileSync(filepath, JSON.stringify(content), { encoding: 'utf-8' });
};

/**
 * Copy code template file to the specified folder
 * @param folder
 */
export const generateCodeFile = (folder: string): void => {
  mkdirSync(folder, { recursive: true });
  copyFileSync(path.join(__dirname, 'template.ts'), path.join(folder, 'index.ts'));
};

export const generateStatFile = (filepath: string): void => {
  writeFileSync(filepath, '{}', { encoding: 'utf-8' });
};

export const updateStatFile = (filepath: string, day: number, data: object): void => {
  const stats = JSON.parse(readFile(filepath));
  stats[day] = data;
  writeFileSync(filepath, JSON.stringify(stats), { encoding: 'utf-8' });
};
