export function removeAnnotation(word: string) {
  const annotation = word.match(/\(([^)]+?)\)$/);

  if (!annotation)
    return {
      word,
    };

  return {
    word: word.substring(0, annotation.index).trim(),
    annotation: annotation[1],
  };
}
