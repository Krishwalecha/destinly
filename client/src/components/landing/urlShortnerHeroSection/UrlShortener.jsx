import { useState } from "react";
import UrlGenerator from "./UrlGenerator";
import ResultCard from "./ResultCard";

const UrlShortener = () => {
  const [shortened, setShortened] = useState(null);

  return shortened ? (
    <ResultCard shortened={shortened} setShortened={setShortened} />
  ) : (
    <UrlGenerator setShortened={setShortened} />
  );
};

export default UrlShortener;
