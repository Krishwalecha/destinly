import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
  );
};

export default App;