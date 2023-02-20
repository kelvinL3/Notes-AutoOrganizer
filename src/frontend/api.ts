// const backendUrl = "http://localhost:8000";
import { NoteType } from "./types";
import { CanvasState } from "../Components/NoteComponents/Notes";

type SetData = (notes: NoteType[]) => void;

interface sendNotesArgs {
  notes: NoteType[];
  sessionId?: string;
  setNotes: SetData;
  setDisplayState: (canvasState: CanvasState) => void;
}

export function requestCookie(setData: SetData) {
  fetch("/requestCookie")
    .then((resp) => resp.json())
    .then((data) => {
      setData(data);
    });
}

export function sendNotes(args: sendNotesArgs) {
  const { notes, sessionId, setNotes, setDisplayState } = args;

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      notes: notes,
      sessionId: sessionId,
    }),
  };

  fetch("/sendNotes", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      const clusters: Array<{ id: string; label: number }> = data;
      notes.forEach((note, index) => {
        const group = clusters[index];
        note["group"] = group["label"]; // we're returning 'label'
      });
      setNotes(notes);
      setDisplayState(CanvasState.Editing);
    });
}
