import { main } from './index';

test('', () => {
  expect(main('hylla (annotated)', { definiteSingular: '-n', indefinitePlural: '-or' })).toMatchObject({
    indefiniteSingular: 'hylla',
    definiteSingular: 'hyllan',
    indefinitePlural: '',
    definitePlural: '',
    annotation: 'annotated',
  });
});
