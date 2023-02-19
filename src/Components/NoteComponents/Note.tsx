import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

import "../css/Note.css";

interface Props {
  id: string;
  text: string;
  group?: number;
  deleteNote: (id: string) => void;
}
function Note(props: Props) {
  const { id, text, group, deleteNote } = props;
  return (
    <div className="note">
      <div className="note__body">{text + " --- " + group}</div>
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
