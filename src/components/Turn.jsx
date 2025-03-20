import { SIDES } from "../game-rules";
import { useGameStore } from "../game-store";
import lang from "../lang/es.json";

export const Turn = () => {
  const turn = useGameStore((state) => state.turn);
  return (
    <span
      className={`m-3 text-2xl text-stroke font-bold ${
        turn === SIDES.L ? "text-gray-500" : "text-orange-500"
      }`}
    >
      {lang[`TURN.${turn.toUpperCase()}`]}
    </span>
  );
};
