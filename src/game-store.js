import { create } from "zustand";
import {
  PIECES,
  SIDES,
  TYPES,
  boopPiece,
  checkMove,
  checkWinner,
  doPromotion,
  initialState,
  preselectPiece,
} from "./game-rules";

export const useGameStore = create((set) => ({
  board: JSON.parse(JSON.stringify(initialState.board)),
  playerRight: JSON.parse(JSON.stringify(initialState.playerRight)),
  playerLeft: JSON.parse(JSON.stringify(initialState.playerLeft)),
  turn: initialState.turn,
  selectedPiece: initialState.selectedPiece,
  winner: initialState.winner,
  selectPiece: (type) => {
    set(() => ({ selectedPiece: type }));
  },
  placePiece: (x, y) => {
    set((state) => {
      let { board, selectedPiece, turn, playerRight, playerLeft } = state;
      if (checkMove({ board, selectedPiece, x, y }) !== true) return state;
      let piece = null;
      if (turn === SIDES.L) {
        piece =
          selectedPiece === TYPES.SM ? { ...PIECES.GK } : { ...PIECES.GC };
        selectedPiece === TYPES.SM
          ? playerRight.sm.pop()
          : playerRight.lg.pop();
      } else {
        piece =
          selectedPiece === TYPES.SM ? { ...PIECES.OK } : { ...PIECES.OC };
        selectedPiece === TYPES.SM ? playerLeft.sm.pop() : playerLeft.lg.pop();
      }
      // Lo ponemos en el tablero
      board[y][x] = piece;
      // Empujamos
      const updState = (newState) => {
        if (newState.board) board = JSON.parse(JSON.stringify(newState.board));
        if (newState.playerRight)
          playerRight = JSON.parse(JSON.stringify(newState.playerRight));
        if (newState.playerLeft)
          playerLeft = JSON.parse(JSON.stringify(newState.playerLeft));
      };
      updState(
        boopPiece(
          board,
          piece,
          x - 1,
          x - 2,
          y - 1,
          y - 2,
          playerRight,
          playerLeft
        )
      );
      updState(
        boopPiece(board, piece, x, x, y - 1, y - 2, playerRight, playerLeft)
      );
      updState(
        boopPiece(
          board,
          piece,
          x + 1,
          x + 2,
          y - 1,
          y - 2,
          playerRight,
          playerLeft
        )
      );
      updState(
        boopPiece(board, piece, x - 1, x - 2, y, y, playerRight, playerLeft)
      );
      updState(
        boopPiece(board, piece, x + 1, x + 2, y, y, playerRight, playerLeft)
      );
      updState(
        boopPiece(
          board,
          piece,
          x - 1,
          x - 2,
          y + 1,
          y + 2,
          playerRight,
          playerLeft
        )
      );
      updState(
        boopPiece(board, piece, x, x, y + 1, y + 2, playerRight, playerLeft)
      );
      updState(
        boopPiece(
          board,
          piece,
          x + 1,
          x + 2,
          y + 1,
          y + 2,
          playerRight,
          playerLeft
        )
      );
      // Miramos si alguien ha ganado
      const winner = checkWinner(board, playerRight, playerLeft);
      if (winner)
        return { board, selectedPiece, turn, playerRight, playerLeft, winner };
      // Miramos si hay promoción de gatos
      updState(doPromotion(board, playerRight, playerLeft));
      // Actualizamos variables para el siguiente turno
      turn = turn === SIDES.L ? SIDES.R : SIDES.L;
      selectedPiece = preselectPiece({ turn, playerRight, playerLeft });

      return { board, selectedPiece, turn, playerRight, playerLeft };
    });
  },
  restart: () => {
    set(() => ({ ...initialState }));
  },
}));
