import "./App.css";
import { Route, Routes } from "react-router-dom";
import TestApi from "./components/TestApi";
import TestMongo from "./components/TestMongo";
import RequireAuth from "./middleware/RequireAuth";
import Profile from "./components/Profile";
import Home from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/test_api" element={<TestApi />} />
      <Route path="/test_mongo" element={<TestMongo />} />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
      <Route
        path="/logout"
        element={
          <RequireAuth>
            <Logout />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
