import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login.tsx";
import Home from "./components/Home.tsx";
import Header from "./components/Header.tsx";
import NotFound from "./components/NotFound.tsx";
import Register from "./components/Register.tsx";
import Write from "./components/Write.tsx";
import Me from "./components/Me.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import axios from "axios";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    async function wakeServer() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/ping`,
        );
        console.log(response.data.message);
      } catch (error) {
        console.log(error);
      }
    }
    wakeServer();
  }, []);

  return (
    <>
      <AuthProvider>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Register />} />
          <Route path="/write" element={<Write />} />
          <Route path="/me" element={<Me />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
