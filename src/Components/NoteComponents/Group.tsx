import { useDrop } from "react-dnd";
import { ItemTypes, NoteDropItem } from "../../frontend/draggable";

interface Props {
  groupId: number;
  moveNote: (id: string, groupId: number) => void;
  children: React.ReactNode[];
}

// Pass through children
export function Group(props: Props) {
  const { groupId, children, moveNote } = props;

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.NOTE,
      drop: (item: NoteDropItem) => {
        moveNote(item.id, groupId);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [groupId]
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
