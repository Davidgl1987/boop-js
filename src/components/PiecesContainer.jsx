import { SIDES, TYPES } from "../game-rules";
import { useGameStore } from "../game-store";
import { Piece } from "./Piece";

export const PiecesContainer = ({ side }) => {
  const playerLeft = useGameStore((state) => state.playerLeft);
  const playerRight = useGameStore((state) => state.playerRight);
  const turn = useGameStore((state) => state.turn);
  const selectPiece = useGameStore((state) => state.selectPiece);
  const selectedPiece = useGameStore((state) => state.selectedPiece);

  const lg = side === SIDES.L ? playerLeft.lg.length : playerRight.lg.length;

  const small = side === SIDES.L ? playerLeft.sm.length : playerRight.sm.length;

  return (
    <div className="flex flex-wrap justify-center">
      {lg > 0 && (
        <div className="m-1">
          <span
            className={`m-3 text-stroke font-bold ${
              side === SIDES.L ? "text-gray-500" : "text-orange-500"
            }`}
          >
            {lg}
          </span>
          <div
            className={`p-2 m-2 border-4 ${
              turn === side && selectedPiece === TYPES.LG
                ? "border-white rounded-lg"
                : "border-transparent"
            }`}
          >
            <Piece
              piece={{ side, type: TYPES.LG }}
              onClick={() => turn === side && selectPiece(TYPES.LG)}
            />
          </div>
        </div>
      )}
      {small > 0 && (
        <div className="m-1">
          <span
            className={`m-3 text-stroke font-bold ${
              side === SIDES.L ? "text-gray-500" : "text-orange-500"
            }`}
          >
            {small}
          </span>
          <div
            className={`p-2 m-2 border-4 ${
              turn === side && selectedPiece === TYPES.SM
                ? "border-white rounded-lg"
                : "border-transparent"
            }`}
          >
            <Piece
              piece={{ side, type: TYPES.SM }}
              onClick={() => turn === side && selectPiece(TYPES.SM)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
