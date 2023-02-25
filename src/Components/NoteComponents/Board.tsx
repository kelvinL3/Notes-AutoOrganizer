import { ChangeEvent, useEffect, useRef, useState } from "react";
import Note from "./Note";
import "../css/Note.css";
import CreateNote from "./CreateNote";
import { v4 as uuid } from "uuid";
import { usePrevious } from "../../frontend/hooks";
import {
  fetchNewNoteClassifiedGroups,
  fetchNoteGroupsData,
} from "../../frontend/api";
import { EditNoteType, NoteType } from "../../frontend/types";
import { Group } from "./Group";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export enum CanvasState {
  Editing = 1,
  WaitingForCreateGroups = 2,
  WaitingForClassifyNew = 3,
}

function Board() {
  const [notes, setNotesOriginal] = useState<NoteType[]>([]);

  /*
   * Allowing one undo
   */
  const [allowUndo, setAllowUndo] = useState<boolean>(false);

  const setNotes: React.Dispatch<React.SetStateAction<NoteType[]>> = (
    notes
  ) => {
    setAllowUndo(true);
    setNotesOriginal(notes);
  };
  const prevNotes = usePrevious(notes);
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
    const newNotes: NoteType[] = JSON.parse(JSON.stringify(notes));

    for (const note of newNotes) {
      if (note.id === id) {
        note.text = text;
        break;
      }
    }
    setNotes(newNotes);
  };

  // Saving / Loading
  const firstMount = useRef(true);

  // Reading
  useEffect(() => {
    const json = localStorage.getItem("Notes");
    if (json) {
      const data = JSON.parse(json);
      setNotes(data);
      // Disable undo on first load
      setAllowUndo(false);
    }
  }, []);

  // Writing
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    localStorage.setItem("Notes", JSON.stringify(notes));
  }, [notes]);

  // Re-organizing Notes
  const [displayState, setDisplayState] = useState<CanvasState>(
    CanvasState.Editing
  );

  /* Using a state to prevent multiple API calls */
  const prevState = usePrevious(displayState);

  useEffect(() => {
    if (displayState === prevState) {
      return;
    }

    if (
      displayState === CanvasState.WaitingForCreateGroups &&
      prevState === CanvasState.Editing
    ) {
      fetchNoteGroupsData({
        notes,
        setNotes: (notes) => {
          setNotes(notes);
        },
        setDisplayState,
      });
      return;
    }

    if (
      displayState === CanvasState.WaitingForClassifyNew &&
      prevState === CanvasState.Editing
    ) {
      fetchNewNoteClassifiedGroups({
        notes,
        setNotes: (notes) => {
          setNotes(notes);
        },
        setDisplayState,
      });
      return;
    }
  }, [displayState, notes, prevState]);

  /* Dragging and Dropping Notes */
  const moveNote = (id: string, groupId: number) => {
    const newNotes: NoteType[] = JSON.parse(JSON.stringify(notes));

    for (const note of newNotes) {
      if (note.id === id) {
        note.group = groupId;
        console.log(`transferring ${note.group} to ${groupId}`);
        break;
      }
    }

    setNotes(newNotes);
  };

  /*
   * RENDERING
   */
  // Keep this within top level component for dynamic rendering
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
      <Group groupId={Number(key)} moveNote={moveNote}>
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
      </Group>
    );
    groups.push(elements);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div className="state_change_container">
          <button
            className="reorg_button"
            onClick={() => {
              setAllowUndo(true);
              setDisplayState(CanvasState.WaitingForCreateGroups);
            }}
          >
            {!notes.some((note) => note.hasOwnProperty("group"))
              ? "Create Groups"
              : "Recreate Groups"}
          </button>
        </div>

        <div className="state_change_container">
          <button
            className="reorg_button"
            onClick={() => {
              setAllowUndo(true);
              setDisplayState(CanvasState.WaitingForClassifyNew);
            }}
          >
            Classify New Groups
          </button>
        </div>

        <div className="state_change_container">
          <button
            style={{
              opacity: allowUndo ? 1 : 0.5,
              pointerEvents: allowUndo ? "auto" : "none",
            }}
            disabled={!allowUndo}
            className="reorg_button"
            onClick={() => {
              setNotes(prevNotes ? prevNotes : []);
              setAllowUndo(false);
            }}
          >
            Undo
          </button>
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
    </DndProvider>
  );
}
export default Board;
