import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import { Signin } from "./pages/Signin.jsx";
import { SignUp } from "./pages/Signup.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default App;
