import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { endpoint } from "./admin";

function AggiungiPiatto() {
  // const endpoint = "192.168.78.78";
  const [Nome, setNome] = useState("");
  const [Descrizione, setDescrizione] = useState("");
  const [Prezzo, setPrezzo] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const [Categoria, setCategoria] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset eventuali errori precedenti
    setSuccessMessage(""); // Reset del messaggio di successo precedente
    try {
      // Esegui la richiesta POST al server
      const response = await fetch(`http://${endpoint}:3001/api/add/piatto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nome,
          Descrizione,
          Prezzo,
          Categoria,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Piatto aggiunto con successo!"); // Mostra il messaggio di successo
        setNome("");
        setDescrizione("");
        setPrezzo("");
        setCategoria("");
        console.log("piatto aggiunto");
      } else {
        // Mostra un messaggio di errore se la risposta è "false"
        setError("Errore nell'aggiunta del piatto");
      }
    } catch (error) {
      // Gestione di errori di rete o di risposta
      setError("Errore di connessione. Riprova più tardi.");
      console.error("Errore durante l'aggiunta del piatto:", error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-danger">{error}</p>}
        {successMessage && <p className="text-success">{successMessage}</p>}
        <div className="mb-3">
          <label htmlFor="InputNomePiatto" className="form-label">
            Nome Piatto
          </label>
          <input
            type="text"
            className="form-control"
            id="InputNomePiatto"
            value={Nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="es. Pasta..."
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="InputDescrizionePiatto" className="form-label">
            Descrizione Piatto
          </label>
          <input
            type="text"
            className="form-control"
            id="InputDescrizionePiatto"
            placeholder="es. Ragù/Sugo..."
            value={Descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="InputPrezzoPiatto" className="form-label">
            Prezzo Piatto
          </label>
          <div className="d-flex align-items-center">
            <input
              type="number"
              className="form-control"
              id="InputPrezzoPiatto"
              placeholder="es. 1.5/2..."
              value={Prezzo}
              onChange={(e) => setPrezzo(e.target.value)}
              style={{ width: "50%" }}
              required
            />
            <span className="ms-4" style={{ fontSize: "23px" }}>
              €
            </span>
          </div>
        </div>
        <div>
          <select
            className="form-select"
            id="SelectCategoria"
            value={Categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="" disabled>
              Seleziona la Categoria
            </option>
            <option value="Antipasti">Antipasti</option>
            <option value="Primi">Primi</option>
            <option value="Secondi">Secondi</option>
            <option value="Contorni">Contorni</option>
            <option value="Frutta">Frutta</option>

            <option value="Dolci">Dolci</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary mt-4 text-dark">
          Aggiungi
        </button>
      </form>
    </div>
  );
}
export default AggiungiPiatto;
