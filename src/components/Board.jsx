import { useState } from "react";
import { useGameStore } from "../game-store";
import { checkMove } from "../game-rules";
import { Piece } from "./Piece";
import { Modal } from "./Modal";
import lang from "../lang/es.json";

export const Board = () => {
  const [error, setError] = useState();
  const board = useGameStore((state) => state.board);
  const placePiece = useGameStore((state) => state.placePiece);
  const winner = useGameStore((state) => state.winner);
  const selectedPiece = useGameStore((state) => state.selectedPiece);

  const tryplacePiece = (x, y) => {
    const isValid = checkMove({ selectedPiece, board, x, y });
    if (isValid === true) return placePiece(x, y);
    setError(isValid.error);
  };

  return (
    <>
      <div className="board-bg rounded-lg shadow-lg">
        <div className="container flex flex-col">
          {board.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => (
                <div
                  className="w-14 md:w-24 lg:w-32 xl:w-28 h-14 md:h-24 lg:h-32 xl:h-28 flex justify-center items-center flex-col m-0.5"
                  key={`${x}_${y}`}
                  onClick={() => !winner && tryplacePiece(x, y)}
                >
                  {cell && <Piece piece={cell} />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Modal
        show={error}
        title={lang[`ERROR.${error}.TITLE`]}
        description={lang[`ERROR.${error}.DESC`]}
        onAccept={() => setError()}
        hideCancel
      />
    </>
  );
};
