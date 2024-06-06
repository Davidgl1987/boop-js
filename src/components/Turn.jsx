import { COLORS, useGameStore } from "../game-store";

export const Turn = () => {
  const turn = useGameStore((state) => state.turn);
  return (
    <span
      className={`m-3 text-2xl text-stroke font-bold ${
        turn === COLORS.ORANGE ? "text-orange-500" : "text-gray-500"
      }`}
    >
      Turn {turn}
    </span>
  );
};
