import { useState } from "react";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Chat from "./components/Chat";
import Confirm from "./components/Confirm";
import Search from "./components/Search";
import Results from "./components/Results";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

//For testing chat app using web socket
import LiveComponent from "./components/LiveComponent";

function App() {
  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    return !!accessToken;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/results" element={<Results />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/chat"
          element={
            isAuthenticated() ? <Chat /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/live" element={<LiveComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
