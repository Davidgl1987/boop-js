export const NUM_PIECES = 8;

export const SIDES = {
  L: "left",
  R: "right",
};

export const TYPES = {
  LG: "LG",
  SM: "SM",
};

export const PIECES = {
  GK: {
    side: SIDES.L,
    type: TYPES.SM,
  },
  OK: {
    side: SIDES.R,
    type: TYPES.SM,
  },
  GC: {
    side: SIDES.L,
    type: TYPES.LG,
  },
  OC: {
    side: SIDES.R,
    type: TYPES.LG,
  },
};

export const MOVING_ERRORS = {
  UNSELECTED_TYPE: "UNSELECTED_TYPE",
  INVALID_POSITION: "INVALID_POSITION",
  NO_PIECES: "NO_PIECES",
};

export const initialState = {
  board: [
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ],
  playerLeft: {
    sm: Array.from({ length: NUM_PIECES }, () => ({
      side: SIDES.L,
      type: TYPES.SM,
    })),
    lg: [],
  },
  playerRight: {
    sm: Array.from({ length: NUM_PIECES }, () => ({
      side: SIDES.R,
      type: TYPES.SM,
    })),
    lg: [],
  },
  turn: (() => (Math.round(Math.random()) ? SIDES.L : SIDES.R))(),
  selectedPiece: TYPES.SM,
  winner: null,
};

export const checkMove = ({ selectedPiece, board, x, y }) => {
  if (!selectedPiece) return { error: MOVING_ERRORS.UNSELECTED_TYPE };
  if (board[y][x]) return { error: MOVING_ERRORS.INVALID_POSITION };
  return true;
};

export const preselectPiece = ({ turn, playerRight, playerLeft }) => {
  return turn === SIDES.L
    ? !playerRight.lg.length
      ? TYPES.SM
      : !playerRight.sm.length
      ? TYPES.LG
      : null
    : !playerLeft.lg.length
    ? TYPES.SM
    : !playerLeft.sm.length
    ? TYPES.LG
    : null;
};

export const isInside = (x, y, board) => {
  return x >= 0 && y >= 0 && x < board.length && y < board.length;
};

export const boopPiece = (
  board,
  piece,
  x1,
  x2,
  y1,
  y2,
  playerRight,
  playerLeft
) => {
  const pieceBooped =
    isInside(x1, y1, board) && board[y1][x1] !== null
      ? { ...board[y1][x1] }
      : null;
  // Si la posición de origen no está dentro o no hay nadie no hacemos nada
  if (!isInside(x1, y1, board) || !pieceBooped) return { board };
  // Si la posición de destino está ocupada, no se empuja, hace de tope
  if (isInside(x2, y2, board) && board[y2][x2]) return { board };
  // Si tenemos un gatito y el q vamos a empujar es un gato, no se mueve
  if (piece.type === TYPES.SM && pieceBooped.type === TYPES.LG)
    return { board };
  // Si la posición final está libre y es dentro del tablero, se mueve
  if (isInside(x2, y2, board) && !board[y2][x2]) {
    board[y1][x1] = null;
    board[y2][x2] = pieceBooped;
  }
  // Si la posición final no está dentro, se va a la reserva del jugador
  if (!isInside(x2, y2, board)) {
    board[y1][x1] = null;
    if (pieceBooped.side === SIDES.L) {
      if (pieceBooped.type === TYPES.SM) playerRight.sm.push(pieceBooped);
      else playerRight.lg.push(pieceBooped);
    } else {
      if (pieceBooped.type === TYPES.SM) playerLeft.sm.push(pieceBooped);
      else playerLeft.lg.push(pieceBooped);
    }
  }
  return { board, playerRight, playerLeft };
};

export const checkThreeInline = (board) => {
  // Horizontal
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board.length - 2; x++) {
      if (
        board[y][x] !== null &&
        board[y][x]?.side === board[y][x + 1]?.side &&
        board[y][x]?.side === board[y][x + 2]?.side
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
        board[y][x]?.side === board[y + 1][x]?.side &&
        board[y][x]?.side === board[y + 2][x]?.side
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
        board[y][x]?.side === board[y + 1][x + 1]?.side &&
        board[y][x]?.side === board[y + 2][x + 2]?.side
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
        board[y][x]?.side === board[y - 1][x + 1]?.side &&
        board[y][x]?.side === board[y - 2][x + 2]?.side
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

export const checkWinner = (board, playerRight, playerLeft) => {
  if (!playerRight.sm.length && !playerRight.lg.length) return SIDES.L;
  if (!playerLeft.sm.length && !playerLeft.lg.length) return SIDES.R;
  const line = checkThreeInline(board);
  if (line?.every(({ x, y }) => board[y][x].type === TYPES.LG)) {
    const [{ x, y }] = line;
    return board[y][x].side;
  }
  return null;
};

export const doPromotion = (board, playerRight, playerLeft) => {
  const line = checkThreeInline(board);
  if (line) {
    line.map(({ x, y }) => {
      if (board[y][x].side === SIDES.L) playerRight.lg.push({ ...PIECES.GC });
      else playerLeft.lg.push({ ...PIECES.OC });
      board[y][x] = null;
    });
  }
  return { board, playerRight, playerLeft };
};
