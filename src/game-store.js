import { create } from "zustand";

export const NUM_CATS = 8;

export const COLORS = {
  GRAY: "gray",
  ORANGE: "orange",
};

export const TYPES = {
  KITTY: "kitty",
  CAT: "cat",
};

export const CATS = {
  GK: {
    color: COLORS.GRAY,
    type: TYPES.KITTY,
  },
  OK: {
    color: COLORS.ORANGE,
    type: TYPES.KITTY,
  },
  GC: {
    color: COLORS.GRAY,
    type: TYPES.CAT,
  },
  OC: {
    color: COLORS.ORANGE,
    type: TYPES.CAT,
  },
};

const initialState = {
  //Array.from({ length: 6 }, () => Array(6).fill(null)),
  board: [
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ],
  grayPlayer: {
    kitties: Array.from({ length: NUM_CATS }, () => ({ ...CATS.GK })),
    cats: [],
  },
  orangePlayer: {
    kitties: Array.from({ length: NUM_CATS }, () => ({ ...CATS.OK })),
    cats: [],
  },
  turn: (() => (Math.round(Math.random()) ? COLORS.GRAY : COLORS.ORANGE))(),
  selectedCat: TYPES.KITTY,
  winner: null,
};

export const useGameStore = create((set) => ({
  board: JSON.parse(JSON.stringify(initialState.board)),
  grayPlayer: JSON.parse(JSON.stringify(initialState.grayPlayer)),
  orangePlayer: JSON.parse(JSON.stringify(initialState.orangePlayer)),
  turn: initialState.turn,
  selectedCat: initialState.selectedCat,
  winner: null,
  selectCat: (type) => {
    set(() => ({ selectedCat: type }));
  },
  placeCat: (x, y) => {
    set((state) => {
      let { board, selectedCat, turn, grayPlayer, orangePlayer } = state;
      if (!checkMove(state, x, y)) return state;
      let cat = null;
      if (turn === COLORS.GRAY) {
        cat = selectedCat === TYPES.KITTY ? { ...CATS.GK } : { ...CATS.GC };
        selectedCat === TYPES.KITTY
          ? grayPlayer.kitties.pop()
          : grayPlayer.cats.pop();
      } else {
        cat = selectedCat === TYPES.KITTY ? { ...CATS.OK } : { ...CATS.OC };
        selectedCat === TYPES.KITTY
          ? orangePlayer.kitties.pop()
          : orangePlayer.cats.pop();
      }
      // Lo ponemos en el tablero
      board[y][x] = cat;
      // Empujamos
      const updState = (newState) => {
        if (newState.board) board = JSON.parse(JSON.stringify(newState.board));
        if (newState.grayPlayer)
          grayPlayer = JSON.parse(JSON.stringify(newState.grayPlayer));
        if (newState.orangePlayer)
          orangePlayer = JSON.parse(JSON.stringify(newState.orangePlayer));
      };
      updState(
        boopCat(
          board,
          cat,
          x - 1,
          x - 2,
          y - 1,
          y - 2,
          grayPlayer,
          orangePlayer
        )
      );
      updState(
        boopCat(board, cat, x, x, y - 1, y - 2, grayPlayer, orangePlayer)
      );
      updState(
        boopCat(
          board,
          cat,
          x + 1,
          x + 2,
          y - 1,
          y - 2,
          grayPlayer,
          orangePlayer
        )
      );
      updState(
        boopCat(board, cat, x - 1, x - 2, y, y, grayPlayer, orangePlayer)
      );
      updState(
        boopCat(board, cat, x + 1, x + 2, y, y, grayPlayer, orangePlayer)
      );
      updState(
        boopCat(
          board,
          cat,
          x - 1,
          x - 2,
          y + 1,
          y + 2,
          grayPlayer,
          orangePlayer
        )
      );
      updState(
        boopCat(board, cat, x, x, y + 1, y + 2, grayPlayer, orangePlayer)
      );
      updState(
        boopCat(
          board,
          cat,
          x + 1,
          x + 2,
          y + 1,
          y + 2,
          grayPlayer,
          orangePlayer
        )
      );
      // Miramos si alguien ha ganado
      const winner = checkWinner(board, grayPlayer, orangePlayer);
      if (winner)
        return { board, selectedCat, turn, grayPlayer, orangePlayer, winner };
      // Miramos si hay promoción de gatos
      updState(doPromotion(board, grayPlayer, orangePlayer));
      // Actualizamos variables para el siguiente turno
      turn = turn === COLORS.GRAY ? COLORS.ORANGE : COLORS.GRAY;
      selectedCat = preSelectCat({ turn, grayPlayer, orangePlayer });

      return { board, selectedCat, turn, grayPlayer, orangePlayer };
    });
  },
  restart: () => {
    set(() => ({
      board: JSON.parse(JSON.stringify(initialState.board)),
      grayPlayer: JSON.parse(JSON.stringify(initialState.grayPlayer)),
      orangePlayer: JSON.parse(JSON.stringify(initialState.orangePlayer)),
      turn: initialState.turn,
      selectedCat: initialState.selectedCat,
      winner: null,
    }));
  },
}));

const checkMove = (state, x, y) => {
  const { selectedCat, turn, board, grayPlayer, orangePlayer } = state;
  if (!selectedCat) {
    alert("Select a " + turn + " cat from the bottom");
    return false;
  }
  if (board[y][x]) {
    alert("Select another position");
    return false;
  }
  if (
    turn === COLORS.GRAY &&
    !grayPlayer.kitties.length &&
    !grayPlayer.cats.length
  ) {
    alert("No quedan gatos...");
    return false;
  }
  if (
    turn === COLORS.ORANGE &&
    !orangePlayer.kitties.length &&
    !orangePlayer.cats.length
  ) {
    alert("No quedan gatos...");
    return false;
  }
  return true;
};

const preSelectCat = ({ turn, grayPlayer, orangePlayer }) => {
  return turn === COLORS.GRAY
    ? !grayPlayer.cats.length
      ? TYPES.KITTY
      : !grayPlayer.kitties.length
      ? TYPES.CAT
      : null
    : !orangePlayer.cats.length
    ? TYPES.KITTY
    : !orangePlayer.kitties.length
    ? TYPES.CAT
    : null;
};

const isInside = (x, y, board) => {
  return x >= 0 && y >= 0 && x < board.length && y < board.length;
};

const boopCat = (board, cat, x1, x2, y1, y2, grayPlayer, orangePlayer) => {
  const catBooped =
    isInside(x1, y1, board) && board[y1][x1] !== null
      ? { ...board[y1][x1] }
      : null;
  // Si la posición de origen no está dentro o no hay nadie no hacemos nada
  if (!isInside(x1, y1, board) || !catBooped) return { board };
  // Si la posición de destino está ocupada, no se empuja, hace de tope
  if (isInside(x2, y2, board) && board[y2][x2]) return { board };
  // Si tenemos un gatito y el q vamos a empujar es un gato, no se mueve
  if (cat.type === TYPES.KITTY && catBooped.type === TYPES.CAT)
    return { board };
  // Si la posición final está libre y es dentro del tablero, se mueve
  if (isInside(x2, y2, board) && !board[y2][x2]) {
    board[y1][x1] = null;
    board[y2][x2] = catBooped;
  }
  // Si la posición final no está dentro, se va a la reserva del jugador
  if (!isInside(x2, y2, board)) {
    board[y1][x1] = null;
    if (catBooped.color === COLORS.GRAY) {
      if (catBooped.type === TYPES.KITTY) grayPlayer.kitties.push(catBooped);
      else grayPlayer.cats.push(catBooped);
    } else {
      if (catBooped.type === TYPES.KITTY) orangePlayer.kitties.push(catBooped);
      else orangePlayer.cats.push(catBooped);
    }
  }
  return { board, grayPlayer, orangePlayer };
};

const checkThreeInline = (board) => {
  // Horizontal
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board.length - 2; x++) {
      if (
        board[y][x] !== null &&
        board[y][x]?.color === board[y][x + 1]?.color &&
        board[y][x]?.color === board[y][x + 2]?.color
      ) {
        return [
          { y, x },
          { y, x: x + 1 },
          { y, x: x + 2 },
        ];
      }
    }
  }

  // Vertical
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board.length - 2; y++) {
      if (
        board[y][x] !== null &&
        board[y][x]?.color === board[y + 1][x]?.color &&
        board[y][x]?.color === board[y + 2][x]?.color
      ) {
        return [
          { y, x },
          { y: y + 1, x },
          { y: y + 2, x },
        ];
      }
    }
  }

  // Diagonal arriba-izquierda > abajo-derecha
  for (let y = 0; y < board.length - 2; y++) {
    for (let x = 0; x < board.length - 2; x++) {
      if (
        board[y][x] !== null &&
        board[y][x]?.color === board[y + 1][x + 1]?.color &&
        board[y][x]?.color === board[y + 2][x + 2]?.color
      ) {
        return [
          { y, x },
          { y: y + 1, x: x + 1 },
          { y: y + 2, x: x + 2 },
        ];
      }
    }
  }

  // Diagonal abajo-izquierda > arriba-derecha
  for (let y = 2; y < board.length; y++) {
    for (let x = 0; x < board.length - 2; x++) {
      if (
        board[y][x] !== null &&
        board[y][x]?.color === board[y - 1][x + 1]?.color &&
        board[y][x]?.color === board[y - 2][x + 2]?.color
      ) {
        return [
          { y, x },
          { y: y - 1, x: x + 1 },
          { y: y - 2, x: x + 2 },
        ];
      }
    }
  }

  return null;
};

const checkWinner = (board, grayPlayer, orangePlayer) => {
  if (!grayPlayer.kitties.length && !grayPlayer.cats.length) return COLORS.GRAY;
  if (!orangePlayer.kitties.length && !orangePlayer.cats.length)
    return COLORS.ORANGE;
  const line = checkThreeInline(board);
  if (line?.every(({ x, y }) => board[y][x].type === TYPES.CAT)) {
    const [{ x, y }] = line;
    return board[y][x].color;
  }
  return null;
};

const doPromotion = (board, grayPlayer, orangePlayer) => {
  const line = checkThreeInline(board);
  if (line) {
    line.map(({ x, y }) => {
      if (board[y][x].color === COLORS.GRAY)
        grayPlayer.cats.push({ ...CATS.GC });
      else orangePlayer.cats.push({ ...CATS.OC });
      board[y][x] = null;
    });
  }
  return { board, grayPlayer, orangePlayer };
};
