import { ChangeEvent, useEffect, useRef, useState } from "react";
import "../css/Note.css";
import Note from "./Note";
import CreateNote from "./CreateNote";
import { v4 as uuid } from "uuid";
import { usePrevious } from "../../frontend/hooks";
import { sendNotes } from "../../frontend/api";
import { EditNoteType, NoteType } from "../../frontend/types";

export enum CanvasState {
  Editing = 1,
  Waiting = 2,
  // Reorganizing = 3,
}

function Notes() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [inputText, setInputText] = useState("");
  const [update, setUpdate] = useState(0);

  const textHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const saveHandler = () => {
    setNotes((prevState) => [
      ...prevState,
      {
        id: uuid(),
        text: inputText,
        group: -1,
        // group: notes.length,
      },
    ]);
    //clear the textarea
    setInputText("");
  };

  const deleteNote = (id: string) => {
    const filteredNotes = notes.filter((note) => note.id !== id);
    setNotes(filteredNotes);
  };

  const editNote: EditNoteType = (text, id) => {
    for (const note of notes) {
      if (note.id === id) {
        note.text = text;
        break;
      }
    }
    setNotes(notes);
    // since notes is still the same object, it
    // trivially passes the equality check, force update
    // to trigger save to internalDB
    setUpdate((u) => u + 1);
  };

  // Saving / Loading
  const firstMount = useRef(true);

  // Reading
  useEffect(() => {
    const json = localStorage.getItem("Notes");
    if (json) {
      const data = JSON.parse(json);
      setNotes(data);
    }
  }, []);

  // Writing
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }

    localStorage.setItem("Notes", JSON.stringify(notes));
  }, [notes, update]);

  // Re-organizing Notes
  const [displayState, setDisplayState] = useState<CanvasState>(
    CanvasState.Editing
  );

  const prevState = usePrevious(displayState);

  useEffect(() => {
    if (displayState === prevState) {
      return;
    }
    if (displayState === CanvasState.Waiting) {
      // assume prev state was CanvasState.Editing
      sendNotes({
        notes,
        setNotes: (notes) => {
          setUpdate((u) => u + 1);
          setNotes(notes);
        },
        setDisplayState,
      });
    }
  }, [displayState, notes, prevState]);

  // Collect groups to structure notes inside carousels
  const noteGroups = notes.reduce((acc, note) => {
    const index = note.group ? note.group : -1;
    if (!acc[index]) {
      acc[index] = [];
    }
    acc[index].push(note);
    return acc;
  }, {} as { [key: number]: NoteType[] });

  const groups = [];
  for (const key of Object.keys(noteGroups)) {
    const notesInGroup = noteGroups[Number(key)];
    const elements = (
      <div className="group_carousel">
        {notesInGroup.map((note) => (
          <Note
            key={note.id}
            id={note.id}
            group={note.group}
            text={note.text}
            deleteNote={deleteNote}
            editNote={editNote}
          />
        ))}
      </div>
    );
    groups.push(elements);
  }

  return (
    <div>
      <div className="state_change_container">
        <button
          className="reorg_button"
          onClick={() => {
            setDisplayState(CanvasState.Waiting);
          }}
        >
          Re-Organize Your Notes
        </button>

        {/* <button
          className="reorg_button"
          onClick={() => {
            setDisplayState(CanvasState.Editing);
          }}
        >
          Back to Editing
        </button> */}
      </div>

      <div className="base_container">
        <div className="carousel_container">{groups}</div>
        <div>
          <CreateNote
            textHandler={textHandler}
            saveHandler={saveHandler}
            inputText={inputText}
          />
        </div>
      </div>
    </div>
  );
}
export default Notes;
