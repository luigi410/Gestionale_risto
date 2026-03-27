import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../App.css";
import { endpoint } from "./admin";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Esegui la richiesta POST al server
      const response = await fetch(`http://${endpoint}/checkUtenti.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mail: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.result === "true") {
        // Se l'autenticazione ha successo, reindirizza l'utente
        localStorage.setItem("result", "true");
        navigate("/Admin");
      } else {
        // Mostra un messaggio di errore se la risposta è "false"
        setError("Email o password non corretti.");
      }
    } catch (error) {
      // Gestione di errori di rete o di risposta
      setError("Errore di connessione. Riprova più tardi.");
      console.error("Errore durante l'autenticazione:", error);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="logo">
        <img
          src="logo_ten_M.webp"
          alt="Logo"
          onClick={() => {
            window.location.href = "/";
          }}
        />
      </div>
      <h4 className="text-center mt-4 mb-3 font-bauer color">LOGIN</h4>
      <div className="justify-content-center d-flex">
        <div style={{ width: "60%" }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="InputEmail" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                name="mail"
                id="InputEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="InputPass" className="form-label">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="form-control"
                id="InputPass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-danger">{error}</div>}
            <div className="d-flex justify-content-center mt-5">
              <button
                type="submit"
                className="btn"
                style={{ backgroundColor: "rgba(168, 152, 93, 0.3)" }}
              >
                Accedi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
