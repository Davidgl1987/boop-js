import { COLORS, useGameStore } from "../game-store";

export const SelectCat = () => {
  const turn = useGameStore((state) => state.turn);
  const selectedCat = useGameStore((state) => state.selectedCat);

  return (
    <span
      className={`m-3 text-stroke font-bold ${
        turn === COLORS.ORANGE ? "text-orange-500" : "text-gray-500"
      }`}
    >
      {selectedCat ? `Selected cat: ${selectedCat}` : "Select a cat type!"}
    </span>
  );
};
