import { writeFile } from 'fs';
import { request as httpsRequest } from 'https';
import { IncomingMessage } from 'http';
import { load as cheerio } from 'cheerio';
import { escape } from 'querystring';
import { removeAnnotation } from '../src/utilities';
import readWordlist, { WordType } from '../src/utilities/readCsv';
import { resolve as resolvePath } from 'path';

function request(word: string): Promise<string> {
  const options = {
    host: 'sv.wiktionary.org',
    path: '/wiki/' + escape(word),
  };

  return new Promise((resolve) => {
    function callback(response: IncomingMessage) {
      const str: string[] = [];

      //another chunk of data has been received, so append it to `str`
      response.on('data', function (chunk) {
        str.push(chunk);
      });

      //the whole response has been received, so we just print it out here
      response.on('end', function () {
        resolve(str.join());
      });
    }

    httpsRequest(options, callback).end();
  });
}

function find(fullHtml: string) {
  const doc = cheerio(fullHtml);
  const tables = doc('table.grammar[class*=template-sv-subst-]');
  const useTable = tables
    .map((x, y) => doc(y).attr('class')?.substring('grammar template-'.length))
    .toArray()
    .reduce(
      (previousValue, currentValue, index) => {
        const currentPrecedence = [
          'sv-subst-t-namn',
          'sv-subst-n-namn',
          'sv-subst-t-oräkn',
          'sv-subst-n-an-oräkn',
          'sv-subst-n-oräkn',
          'sv-subst-t-0',
          'sv-subst-t-n',
          'sv-subst-t-er',
          'sv-subst-t-ar',
          'sv-subst-n-0',
          'sv-subst-n-an',
          'sv-subst-n-r',
          'sv-subst-n-or',
          'sv-subst-n-er',
          'sv-subst-n-ar',
        ].indexOf(currentValue);
        if (currentPrecedence > previousValue.precedence) {
          return {
            index,
            precedence: currentPrecedence,
          };
        }

        return previousValue;
      },
      { index: -1, precedence: -1 },
    ).index;
  if (useTable < 0) {
    return {
      indefiniteSingular: '',
      definiteSingular: '',
      indefinitePlural: '',
      definitePlural: '',
    };
  }

  const nominativ = doc('tr:eq(2)', tables[useTable]);
  const indefiniteSingular = doc('td:eq(0)', nominativ).text().trim();
  const definiteSingular = doc('td:eq(1)', nominativ).text().trim();
  const indefinitePlural = doc('td:eq(2)', nominativ).text().trim();
  const definitePlural = doc('td:eq(3)', nominativ).text().trim();

  return {
    indefiniteSingular,
    definiteSingular,
    indefinitePlural,
    definitePlural,
  };
}

async function update() {
  // https://sv.wiktionary.org/w/api.php?action=parse&page=station&format=json&prop=wikitext
  const wordlist = await readWordlist(resolvePath(__dirname, '../Nominative Notes.csv'));
  const updatedWords: WordType[] = [];

  for (let i = 0; i < wordlist.length; i++) {
    const word = wordlist[i];
    const purified = removeAnnotation(word.word);

    if (purified.annotation && purified.annotation !== word.annotation)
      console.log(word.word + ' has a wrong annotation!');

    const html = await request(purified.word);
    const { indefiniteSingular, definiteSingular, indefinitePlural, definitePlural } = find(html);

    const updated = {
      ...word,
      indefiniteSingular:
        word.indefiniteSingular + (word.indefiniteSingular && indefiniteSingular ? ' + ' : '') + indefiniteSingular,
      definiteSingular:
        word.definiteSingular + (word.definiteSingular && definiteSingular ? ' + ' : '') + definiteSingular,
      indefinitePlural:
        word.indefinitePlural + (word.indefinitePlural && indefinitePlural ? ' + ' : '') + indefinitePlural,
      definitePlural: word.definitePlural + (word.definitePlural && definitePlural ? ' + ' : '') + definitePlural,
    };
    updatedWords.push(updated);

    const changes = [
      updated.indefiniteSingular !== word.indefiniteSingular,
      updated.definiteSingular !== word.definiteSingular,
      updated.indefinitePlural !== word.indefinitePlural,
      updated.definitePlural !== word.definitePlural,
    ].reduce((p, c) => p + (c ? 1 : 0), 0);

    console.log(`Updated ${changes} fields of ${updated.word} (${i + 1}/${wordlist.length})`);
  }

  const content = updatedWords.map((word) => Object.values(word).join(';')).join('\n');
  return new Promise((resolve) => writeFile('data.csv', content, resolve));
}

update();
