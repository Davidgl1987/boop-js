import { Board } from "./components/Board";
import { CatsContainer } from "./components/CatsContainer";
import { SelectCat } from "./components/SelectCat";
import { Turn } from "./components/Turn";
import { Winner } from "./components/Winner";
import { COLORS, useGameStore } from "./game-store";

function App() {
  const winner = useGameStore((state) => state.winner);

  return (
    <div className="h-screen flex flex-col items-center py-5 px-3 bg-container">
      <div className="title w-full h-32 m-3" />
      <Board />
      <div className="flex flex-col items-center">
        {winner ? (
          <Winner />
        ) : (
          <>
            <Turn />
            <SelectCat />
          </>
        )}
      </div>
      <div className="w-full flex justify-evenly text-center mt-3">
        <CatsContainer color={COLORS.ORANGE} />
        <CatsContainer color={COLORS.GRAY} />
      </div>
    </div>
  );
}

export default App;
