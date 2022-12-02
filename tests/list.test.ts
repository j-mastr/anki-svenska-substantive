import { main } from '../src';
import wordlist from './data.json';

describe('Substantive Declination', () => {
  it.each(wordlist)('$word', (word) => {
    const declinedWord = main(word.word, {
      definiteSingular: word.singular,
      indefinitePlural: word.plural,
    });
    expect(word.indefiniteSingular.split(',').map((form: string) => form.trim())).toContain(
      declinedWord.indefiniteSingular,
    );
    expect(word.definiteSingular.split(',').map((form: string) => form.trim())).toContain(
      declinedWord.definiteSingular,
    );

    if (word.annotation) {
      expect(declinedWord.annotation).toBe(word.annotation);
    }
  });
});
