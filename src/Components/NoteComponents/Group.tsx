import { useDrop } from "react-dnd";
import { ItemTypes, NoteDropItem } from "../../frontend/draggable";
import { NoteType } from "../../frontend/types";

interface Props {
  groupId: number;
  moveNote: (id: string, groupId: number, notes: NoteType[]) => void;
  children: React.ReactNode[];
  notes: NoteType[];
}

// Pass through children
export function Group(props: Props) {
  const { groupId, children, moveNote, notes } = props;

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.NOTE,
      drop: (item: NoteDropItem) => {
        moveNote(item.id, groupId, notes);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    // WARNING, this dependency array doesn't have linting rules to make sure it's accurate.
    [groupId, notes]
  );

  const id = `group__id__${groupId}`;
  return (
    <>
      {/* <div style={{ position: "relative", top: 0, left: 0 }}>Header</div> */}
      <div className="group_carousel" id={id} ref={drop}>
        {children}
        {isOver && (
          <div
            className="hover_highlight"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              zIndex: 1,
              opacity: 0.5,
              backgroundColor: "yellow",
            }}
          />
        )}
      </div>
    </>
  );
}
