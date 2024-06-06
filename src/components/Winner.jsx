import { useGameStore } from "../game-store";

export const Winner = () => {
  const winner = useGameStore((state) => state.winner);
  const restart = useGameStore((state) => state.restart);

  return (
    <>
      <h1 className="text-3xl font-bold m-3">Winner: {winner}</h1>
      <button className="border-2 bg-gray-200 rounded" onClick={restart}>
        Restart
      </button>
    </>
  );
};
