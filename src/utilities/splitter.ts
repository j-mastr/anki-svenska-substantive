export function splitter(input: string, processor: (part: string) => string, delimiter: string = '/') {
  return input.includes(delimiter) ? input.split(delimiter).map((part) => processor(part)) : processor(input);
}
