export const Cat = ({ cat, onClick }) => {
  const { color, type } = cat;
  return (
    <div
      onClick={onClick}
      className={`${color.toLowerCase()}-${type.toLowerCase()} 
        w-12 md:w-20 lg:w-24 h-12 md:h-20 lg:h-24
      `}
    />
  );
};
