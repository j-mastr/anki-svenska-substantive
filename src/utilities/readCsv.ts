import { createReadStream } from 'fs';
import { parse } from 'csv-parse';

export interface WordType {
  word: string;
  singular: string;
  plural: string;
  indefiniteSingular: string;
  definiteSingular: string;
  indefinitePlural: string;
  definitePlural: string;
  annotation: string;
  changes: string;
  tags: string;
}

export type RowType = [string, string, string, string, string, string, string, string, string, string];

export function readCsv<T = any, R = T>(
  filename: string,
  transform = (data: R): T => data as unknown as T,
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const list: T[] = [];
    createReadStream(filename)
      .pipe(parse({ delimiter: ';', from_line: 2 }))
      .on('data', (data) => list.push(transform(data)))
      .on('error', (error) => reject(error.message))
      .on('end', async () => resolve(list));
  });
}

export function wordlistTransformer([
  word,
  singular,
  plural,
  indefiniteSingular,
  definiteSingular,
  indefinitePlural,
  definitePlural,
  annotation,
  changes,
  tags,
]: RowType) {
  return {
    word,
    singular,
    plural,
    indefiniteSingular,
    definiteSingular,
    indefinitePlural,
    definitePlural,
    annotation,
    changes,
    tags,
  };
}

export function readWordlist(filename: string) {
  return readCsv<WordType, RowType>(filename, wordlistTransformer);
}

export default readWordlist;
