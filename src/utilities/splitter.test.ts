import { splitter } from './splitter';

it('processes only once if no delimiter found', () => {
  const processorMock = jest.fn((form) => 'mock content');
  splitter('-en', processorMock);

  expect(processorMock).toBeCalledWith('-en');
  expect(processorMock).toBeCalledTimes(1);
});

it('returns processed array', () => {
  const arr = splitter('-en/stan', (part) => part);

  expect(arr).toHaveLength(2);
  expect(arr).toContain('-en');
  expect(arr).toContain('stan');
});

it('splits by delimiter', () => {
  const processorMock = jest.fn((form) => 'mock content');
  splitter('-en/stan', processorMock);

  expect(processorMock).toBeCalledTimes(2);
  expect(processorMock).toBeCalledWith('-en');
  expect(processorMock).toBeCalledWith('stan');
});
