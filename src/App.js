// src/App.js
import React from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import Home from "./Temphome.js";
import Login from "./components/Login.js";
import Admin from "./components/admin.js";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  const navigate = useNavigate();

  return (
    <div>
      <button
        className="btn"
        onClick={() => {
          navigate("/Login");
        }}
      >
        <i className="bi bi-person-fill"></i>
      </button>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
