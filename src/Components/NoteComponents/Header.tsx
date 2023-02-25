import { useState, useRef, useEffect } from "react";
import "../css/Header.css";

function Header() {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const handleIconClick = () => {
    setShowPopup(!showPopup);
  };

  const handleCloseClick = () => {
    setShowPopup(false);
  };

  return (
    <div className="header">
      <h1 className="notes__title">Notes</h1>
      <div className="info-icon-container" onClick={handleIconClick}>
        <div className="info-icon">ⓘ</div>
        {showPopup && (
          <div className="popup" ref={popupRef}>
            <button className="close-button" onClick={handleCloseClick}>
              &times;
            </button>
            <p>
              This application helps you organize your notes. Creating groups
              will create groups based on best guess clustering. This can change
              all the assignments. Classify New Notes will classify new notes
              without a group. You can undo your last action.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export default Header;
