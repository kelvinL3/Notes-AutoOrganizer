import { ChangeEvent } from "react";

type handler = (event: ChangeEvent<HTMLTextAreaElement>) => void;

interface Params {
  textHandler: handler;
  saveHandler: () => void;
  inputText: string;
}

function CreateNote(params: Params) {
  const { textHandler, saveHandler, inputText } = params;
  const charLimit = 100;
  const charLeft = charLimit - inputText.length;

  return (
    <div className="note" style={{ background: "rgba(255, 255, 255, 0)" }}>
      <textarea
        cols={10}
        rows={5}
        value={inputText}
        placeholder="Type...."
        onChange={textHandler}
        maxLength={100}
      ></textarea>
      <div className="note__footer">
        <span className="label">{charLeft} left</span>
        <button className="note__save" onClick={saveHandler}>
          Save
        </button>
      </div>
    </div>
  );
}
export default CreateNote;
