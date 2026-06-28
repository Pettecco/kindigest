export interface ParsedWord {
  word: string;
  stem: string | null;
  lang: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  context: string | null;
}
