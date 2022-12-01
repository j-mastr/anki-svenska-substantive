import { definiteSingular } from './definiteSingular';

test('Appends bestämd form singular', () => {
  expect(definiteSingular('potatis', '-en')).toBe('potatisen');
});
test('Appends single character bestämd form singular', () => {
  expect(definiteSingular('läkare', '-n')).toBe('läkaren');
});
test('Appends bestämd form singular to word ending with vowel', () => {
  expect(definiteSingular('charkuteri', '-et')).toBe('charkuteriet');
});
test('Switches characters if word ends in e followed by r/l', () => {
  expect(definiteSingular('papper', '-et')).toBe('pappret');
});
