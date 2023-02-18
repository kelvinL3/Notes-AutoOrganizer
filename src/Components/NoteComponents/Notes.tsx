// import {useState, useEffect } from "react";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import "../css/Note.css";
import Note from "./Note";
import CreateNote from "./CreateNote";
import { v4 as uuid } from "uuid";


interface NoteState {
  id: string
  text: string
}

function Notes() {
  const [notes, setNotes] = useState<NoteState[]>([]);
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
      // console.log("Reading", data);
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

  return (
    <div className="notes">
      {notes.map((note) => (
        <Note
          key={note.id}
          id={note.id}
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
  );
}
export default Notes;
