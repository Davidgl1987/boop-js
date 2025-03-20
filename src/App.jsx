import { SIDES } from "./game-rules";
import { useGameStore } from "./game-store";
import { Board } from "./components/Board";
import { PiecesContainer } from "./components/PiecesContainer";
import { Turn } from "./components/Turn";
import { Modal } from "./components/Modal";
import lang from "./lang/es.json";

function App() {
  const winner = useGameStore((state) => state.winner);
  const restart = useGameStore((state) => state.restart);

  return (
    <>
      <div className="h-screen flex flex-col items-center bg-container">
        <div className="title w-full m-3 flex justify-center items-center">
          <span
            className={"m-3 text-8xl text-stroke-xl font-bold text-blue-500"}
          >
            boop.
          </span>
        </div>
        <div className="flex items-center h-full">
          <Board />
        </div>
        <div className="flex flex-col items-center">
          <Turn />
        </div>
        <div className="w-full flex justify-evenly text-center mt-3">
          <PiecesContainer side={SIDES.L} />
          <PiecesContainer side={SIDES.R} />
        </div>
      </div>
      <pre>{winner}</pre>
      <Modal
        show={winner}
        description={lang["WINNER.DESC"]}
        title={lang[`WINNER.${winner?.toUpperCase()}`]}
        acceptText={lang["RESTART.BTN"]}
        onAccept={restart}
        hideCancel={true}
      />
    </>
  );
}

export default App;
