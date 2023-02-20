export interface NoteType {
  id: string;
  text: string;
  group: number;
}

export type EditNoteType = (text: string, id: string) => void;
