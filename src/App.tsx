import "./Components/css/App.css";
import Header from "./Components/NoteComponents/Header";
import Board from "./Components/NoteComponents/Board";

function App() {
  return (
    <div className="main">
      <Header />
      <Board />
    </div>
  );
}

export default App;
