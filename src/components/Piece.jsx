export const Piece = ({ piece, onClick }) => {
  const { side, type } = piece;
  return (
    <div
      onClick={onClick}
      className={`${side.toLowerCase()}-${type.toLowerCase()} 
        w-12 md:w-20 lg:w-24 h-12 md:h-20 lg:h-24
      `}
    />
  );
};
