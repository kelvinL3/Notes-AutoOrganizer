import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { FocusEventHandler } from "react";
import { EditNoteType } from "../../frontend/types";
import { getColor } from "../../frontend/colors";

import "../css/Note.css";

interface Props {
  id: string;
  text: string;
  group: number;
  deleteNote: (id: string) => void;
  editNote: EditNoteType;
}
function Note(props: Props) {
  const { id, text, group, deleteNote, editNote } = props;

  const onEdit: FocusEventHandler = (event) => {
    editNote(event.target.textContent ? event.target.textContent : "", id);
  };

  /* 
    group is a number between [-1, inf)
    pass a non negative index to getColor
  */
  const color = getColor(group + 1);

  return (
    <div className="note" style={{ backgroundColor: color }}>
      <div
        className="note__body"
        contentEditable="true"
        suppressContentEditableWarning={true}
        onBlur={onEdit}
      >
        {text}
      </div>
      <div className="note__footer" style={{ justifyContent: "flex-end" }}>
        <DeleteForeverOutlinedIcon
          className="note__delete"
          onClick={() => deleteNote(id)}
          aria-hidden="true"
        ></DeleteForeverOutlinedIcon>
      </div>
    </div>
  );
}
export default Note;
