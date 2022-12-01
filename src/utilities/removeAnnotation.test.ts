import { removeAnnotation } from './removeAnnotation';

it('correctly removes a wanted annotation', () => {
  const obj = removeAnnotation('word (annotated)');

  expect(obj).toMatchObject({
    word: 'word',
    annotation: 'annotated',
  });
});

it('returns word only if no annotation is present', () => {
  const obj = removeAnnotation('word not annotated');

  expect(obj).toMatchObject({
    word: 'word not annotated',
  });
});

it('removes only the last annotation if multiple are available', () => {
  const obj = removeAnnotation('word (not) (annotated)');

  expect(obj).toMatchObject({
    word: 'word (not)',
    annotation: 'annotated',
  });
});

it('keeps the word if annotation is in the middle', () => {
  const obj = removeAnnotation('word (not) annotated');

  expect(obj).toMatchObject({
    word: 'word (not) annotated',
  });
});
