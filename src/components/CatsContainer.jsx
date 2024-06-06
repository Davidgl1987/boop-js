import { COLORS, useGameStore } from "../game-store";
import { Cat } from "./Cat";

export const CatsContainer = ({ color }) => {
  const orangePlayer = useGameStore((state) => state.orangePlayer);
  const grayPlayer = useGameStore((state) => state.grayPlayer);
  const turn = useGameStore((state) => state.turn);
  const selectCat = useGameStore((state) => state.selectCat);

  const cats =
    color === COLORS.ORANGE
      ? [...orangePlayer.kitties, ...orangePlayer.cats]
      : [...grayPlayer.kitties, ...grayPlayer.cats];
  return (
    <div className="flex flex-wrap justify-center">
      {cats.map((cat, i) => (
        <div key={i} className="m-1">
          <Cat
            cat={cat}
            onClick={() => turn === color && selectCat(cat.type)}
          />
        </div>
      ))}
    </div>
  );
};
