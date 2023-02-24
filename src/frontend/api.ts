import { NoteType } from "./types";
import { CanvasState } from "../Components/NoteComponents/Board";

type SetData = (notes: NoteType[]) => void;

interface SendNotesArgs {
  notes: NoteType[];
  sessionId?: string;
  setNotes: SetData;
  setDisplayState: (canvasState: CanvasState) => void;
}

export function fetchNoteGroupsData(args: SendNotesArgs) {
  const { notes, sessionId, setNotes, setDisplayState } = args;
  if (notes.length === 0) {
    setNotes([]);
    setDisplayState(CanvasState.Editing);
    return;
  }

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      notes: notes,
      sessionId: sessionId,
    }),
  };

  fetch("/fetchNoteGroupsData", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      // Throwing Error types as void
      const clusters: Array<{ id: string; label: number }> = data as any;
      notes.forEach((note, index) => {
        const group = clusters[index];
        note["group"] = group["label"]; // we're returning 'label'
      });
      setNotes(notes);
      setDisplayState(CanvasState.Editing);
    })
    .catch((error) => {
      console.log("Error from server, resetting state", error);
      setDisplayState(CanvasState.Editing);
    });
}


export function fetchNewNoteClassifiedGroups(args: SendNotesArgs) {
  const { notes, sessionId, setNotes, setDisplayState } = args;
  if (notes.length === 0) {
    setNotes([]);
    setDisplayState(CanvasState.Editing);
    return;
  }

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      notes: notes,
      sessionId: sessionId,
    }),
  };

  fetch("/fetchNewNoteClassifiedGroups", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      // Throwing Error types as void
      const clusters: Array<{ id: string; label: number }> = data as any;
      notes.forEach((note, index) => {
        const group = clusters[index];
        note["group"] = group["label"]; // we're returning 'label'
      });
      setNotes(notes);
      setDisplayState(CanvasState.Editing);
    })
    .catch((error) => {
      console.log("Error from server, resetting state", error);
      setDisplayState(CanvasState.Editing);
    });
}

// Not implemented
export function requestCookie(setData: SetData) {
  fetch("/requestCookie")
    .then((resp) => resp.json())
    .then((data) => {
      setData(data);
    });
}
