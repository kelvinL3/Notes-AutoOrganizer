// import {useState, useEffect } from "react";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import "../css/Note.css";
import Note from "./Note";
import CreateNote from "./CreateNote";
import { v4 as uuid } from "uuid";
// import { SendDataButton } from "./SendDataButton";
import { usePrevious } from "../../frontend/hooks";
import { sendNotes } from "../../frontend/api";
import { NoteType } from "../../frontend/types";

export enum CanvasState {
  Editing = 1,
  Waiting = 2,
  Reorganizing = 3,
}

function Notes() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [inputText, setInputText] = useState("");

  const textHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const saveHandler = () => {
    setNotes((prevState) => [
      ...prevState,
      {
        id: uuid(),
        text: inputText,
      },
    ]);
    //clear the textarea
    setInputText("");
  };

  const deleteNote = (id: string) => {
    const filteredNotes = notes.filter((note) => note.id !== id);
    setNotes(filteredNotes);
  };

  // Saving / Loading

  const firstMount = useRef(true);

  // Reading
  useEffect(() => {
    const json = localStorage.getItem("Notes");
    if (json) {
      const data = JSON.parse(json);
      console.log("Reading", data);
      setNotes(data);
    }
  }, []);

  // Writing
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    // console.log("Saving", JSON.stringify(notes));
    localStorage.setItem("Notes", JSON.stringify(notes));
  }, [notes]);

  // Re-organizing Notes
  const [displayState, setDisplayState] = useState<CanvasState>(
    CanvasState.Editing
  );

  // const [clusters, setClusters] = useState(undefined);
  // if (clusters) {
  //   console.log("Clusters", clusters);
  // }

  const prevState = usePrevious(displayState);

  useEffect(() => {
    console.log("pre and current state", prevState, displayState);
    if (displayState === prevState) {
      return;
    }
    console.log("state changed");
    if (displayState === CanvasState.Waiting) {
      console.log("sending Data over now");
      // assume prev state was CanvasState.Editing
      sendNotes({ notes, setNotes, setDisplayState });
    }
  }, [displayState, notes, prevState]);

  console.log("the notes", notes);
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

        <button
          className="reorg_button"
          onClick={() => {
            setDisplayState(CanvasState.Editing);
          }}
        >
          Back to Editing
        </button>
      </div>

      <div className="notes">
        {notes.map((note) => (
          <Note
            key={note.id}
            id={note.id}
            group={note.group}
            text={note.text}
            deleteNote={deleteNote}
          />
        ))}
        <CreateNote
          textHandler={textHandler}
          saveHandler={saveHandler}
          inputText={inputText}
        />
      </div>
    </div>
  );
}
export default Notes;
