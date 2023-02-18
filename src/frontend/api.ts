// const backendUrl = "http://localhost:8000";

interface Note {
  content: string;
  id: string;
}

type SetData = (data: any) => {};

interface sendNotesArgs {
  notes: Note[];
  sessionId: string;
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
    method: "PUT",
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
