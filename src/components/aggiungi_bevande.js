import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { endpoint } from "./admin";

function AggiungiBevande() {
  // const endpoint = "192.168.78.78";
  const [Nome, setNome] = useState("");
  const [Descrizione, setDescrizione] = useState("");
  const [Prezzo, setPrezzo] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [Tipologia, setTipologia] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset eventuali errori precedenti
    setSuccessMessage(""); // Reset del messaggio di successo precedente
    try {
      // Esegui la richiesta POST al server
      const response = await fetch(`http://${endpoint}:3001/api/add/bevanda`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nome,
          Descrizione,
          Prezzo,
          Tipologia,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Bevanda aggiunta con successo!"); // Mostra il messaggio di successo
        setNome("");
        setDescrizione("");
        setPrezzo("");
        setTipologia("");
        console.log("bevanda aggiunta");
      } else {
        // Mostra un messaggio di errore se la risposta è "false"
        setError("Errore nell'aggiunta della bevanda");
      }
    } catch (error) {
      // Gestione di errori di rete o di risposta
      setError("Errore di connessione. Riprova più tardi.");
      console.error("Errore durante l'aggiunta della bevanda:", error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-danger">{error}</p>}
        {successMessage && <p className="text-success">{successMessage}</p>}
        <div className="mb-3">
          <label htmlFor="InputNomeBevanda" className="form-label">
            Nome Bevanda
          </label>
          <input
            type="text"
            className="form-control"
            id="InputNomeBevanda"
            value={Nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="es. Birra/Vino"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="InputDescrizioneBevanda" className="form-label">
            Descrizione Bevanda
          </label>
          <input
            type="text"
            className="form-control"
            id="InputDescrizioneBevanda"
            value={Descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            placeholder="es. 1L/Bottiglia..."
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="InputPrezzoBevanda" className="form-label">
            Prezzo Bevanda
          </label>
          <div className="d-flex align-items-center">
            <input
              type="number"
              className="form-control"
              id="InputPrezzoBevanda"
              value={Prezzo}
              onChange={(e) => setPrezzo(e.target.value)}
              placeholder="es. 1.5/2..."
              style={{ width: "50%" }}
              required
            />

            <span className="ms-4" style={{ fontSize: "23px" }}>
              €
            </span>
          </div>
        </div>

        <div>
          {/* <label htmlFor="tipologia" className="form-label">
            Seleziona tipologia
          </label> */}
          <select
            className="form-select"
            id="tipologia"
            value={Tipologia}
            onChange={(e) => setTipologia(e.target.value)}
            required
          >
            <option value="" disabled>
              Seleziona la Tipologia
            </option>
            <option value="Vini">Vini</option>
            <option value="Alcolici">Alcolici</option>
            <option value="Analcolici">Analcolici</option>
            <option value="Liquori">Liquori</option>
            <option value="Amari">Amari</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-4 text-dark">
          Aggiungi
        </button>
      </form>
    </div>
  );
}
export default AggiungiBevande;
