export const Background = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) => {
  return (
    <>
      <div className="overflow-y-scroll scrollbar-hide h-full">
        <>{children}</>
      </div>
    </>
  );
};
