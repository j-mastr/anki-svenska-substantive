import { definiteSingular } from './nominative';
import { splitter, removeAnnotation } from './utilities';

interface Forms<T> {
  definiteSingular: T;
  indefinitePlural: T;
}

type NominativeForms = {
  definiteSingular: string;
  indefinitePlural: string;
};

type DeclinedForms = {
  indefiniteSingular: string;
  definiteSingular: string | string[];
  indefinitePlural: string | string[];
  definitePlural: string | string[];
  annotation?: string;
};

export function main(word: string, forms: NominativeForms): DeclinedForms {
  const purified = removeAnnotation(word);

  return {
    indefiniteSingular: purified.word,
    definiteSingular: splitter(forms.definiteSingular, (form) => definiteSingular(purified.word, form)),
    indefinitePlural: '',
    definitePlural: '',
    annotation: purified.annotation,
  };
}
