import { writeFile } from 'fs';
import readWordlist from '../src/utilities/readCsv';
import { resolve as resolvePath } from 'path';

async function update() {
  // https://sv.wiktionary.org/w/api.php?action=parse&page=station&format=json&prop=wikitext
  const wordlist = await readWordlist(resolvePath(__dirname, '../tests/data.csv'));
  const content = JSON.stringify(wordlist);
  return new Promise((resolve) => writeFile('data.json', content, resolve));
}

update();
