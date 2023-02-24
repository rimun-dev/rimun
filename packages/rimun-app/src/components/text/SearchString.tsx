interface SearchStringProps {
  query: string;
  target: string;
}

const SearchString: React.FC<SearchStringProps> = ({ query, target }) => {
  const regex = new RegExp(`(.*)(${query})(.*)`, "gi");
  const matches = [...target.matchAll(regex)];

  if (!matches || matches.length === 0) return <>{target}</>;

  return (
    <>
      {matches[0][1].toString()}
      <span className="text-blue-500">{matches[0][2].toString()}</span>
      {matches[0][3].toString()}
    </>
  );
};

export default SearchString;
