export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics?: Phonetic[];
  meanings?: Meaning[];
  license?: License;
  sourceUrls?: string[];
}

interface Phonetic {
  text: string;
  audio: string;
  sourceUrl?: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

interface Definition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
}

interface License {
  name: string;
  url: string;
}
