export interface Definition {
  id: string;
  wordId: string;
  definition: string | null;
  translatedDefinition: string | null;
  createdAt: Date;
  updatedAt: Date;
}
