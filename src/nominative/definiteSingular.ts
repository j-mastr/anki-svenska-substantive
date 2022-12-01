const vowels = ['a', 'e', 'i', 'o', 'u', 'y', 'å'];
const limitedVowels = ['a', 'e'];

export function definiteSingular(indefiniteSingular: string, genusSingular: string) {
  if (!genusSingular.startsWith('-')) return genusSingular;

  const newEnding = genusSingular.substring(1);

  if (limitedVowels.includes(indefiniteSingular[indefiniteSingular.length - 1]) && limitedVowels.includes(newEnding[0]))
    return indefiniteSingular.substring(0, indefiniteSingular.length - 1) + newEnding;

  if (
    limitedVowels.includes(indefiniteSingular[indefiniteSingular.length - 2]) &&
    ['r', 'l'].includes(indefiniteSingular[indefiniteSingular.length - 1]) &&
    limitedVowels.includes(newEnding[0])
  )
    return (
      indefiniteSingular.substring(0, indefiniteSingular.length - 2) +
      indefiniteSingular[indefiniteSingular.length - 1] +
      newEnding
    );

  return indefiniteSingular + newEnding;
}
