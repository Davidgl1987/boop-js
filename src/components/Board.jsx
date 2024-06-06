import { useGameStore } from "../game-store";
import { Cat } from "./Cat";

export const Board = () => {
  const board = useGameStore((state) => state.board);
  const placeCat = useGameStore((state) => state.placeCat);
  const winner = useGameStore((state) => state.winner);

  return (
    <div className="board-bg rounded-lg shadow-lg">
      <div className="container flex flex-col">
        {board.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <div
                className="w-14 md:w-24 lg:w-32 h-14 md:h-24 lg:h-32 flex justify-center items-center flex-col"
                key={`${x}_${y}`}
                onClick={() => !winner && placeCat(x, y)}
              >
                {cell && <Cat cat={cell} />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
