// const backendUrl = "http://localhost:8000";
import { NoteType } from "./types";

type SetData = (data: any) => void;

interface sendNotesArgs {
  notes: NoteType[];
  sessionId?: string;
  setData: SetData;
}

export function requestCookie(setData: SetData) {
  fetch("/requestCookie")
    .then((resp) => resp.json())
    .then((data) => {
      setData(data);
    });
}

export function sendNotes(args: sendNotesArgs) {
  const { notes, sessionId, setData } = args;

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
    .then((data) => setData({ data }));
}
