import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { endpoint } from "./admin";

function RitornaPiatti() {
  const [Categoria, setCategoria] = useState("");

  const [prodotti, setProdotti] = useState([]);
  const [error, setError] = useState(null); // Stato per gestire gli errori
  const [checkboxState, setCheckboxState] = useState({}); // Stato dei checkbox

  useEffect(() => {
    async function fetchProdotti() {
      try {
        const response = await fetch(
          `http://${endpoint}:3001/api/prodotti/${Categoria}`
        );
        if (response.ok) {
          const data = await response.json();
          setProdotti(data);
          setError(null); // Resetta eventuali errori precedenti

          // Stampa i dati ricevuti per debug
          console.log("Prodotti ricevuti:", data);

          // Inizializza lo stato dei checkbox in base ai prodotti ricevuti
          const initialCheckboxState = {};
          data.forEach((prodotto) => {
            // Assicurati che 'Disponibilità' sia 1 o 0
            initialCheckboxState[prodotto.Id] = prodotto.Disponibilità === 1; // 1 = selezionato
          });
          setCheckboxState(initialCheckboxState);
        } else {
          setError("Errore nella richiesta API");
          console.error("Errore nella richiesta API");
        }
      } catch (error) {
        setError("Errore di rete. Controlla la connessione.");
        console.error("Errore di rete:", error);
      }
    }

    if (Categoria) fetchProdotti();
  }, [Categoria]); // `Categoria` come dipendenza

  const CambiaCategoria = (CategoriaSelezionata) => {
    // Svuota i prodotti e lo stato dei checkbox prima di caricare la nuova categoria
    setProdotti([]);
    setCheckboxState({});
    setCategoria(CategoriaSelezionata); // Imposta la nuova categoria
  };
  return (
    <>
      {/* Render dei prodotti in base alla categoria scelta */}
      {/* <div>
        <h2 className="text-center">
          Menù:{" "}
          <span id="cate_selezionata">
            {Categoria.charAt(0).toUpperCase() + Categoria.slice(1)}
          </span>
        </h2>
        {prodotti.length > 0 ? (
          <div className="d-flex justify-content-center">
            <div
              style={{ lineHeight: "1.8", width: "50%", marginBottom: "6rem" }}
            >
              <div
                style={{
                  fontSize: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <strong>Nome</strong>
                <strong>Visualizzabile</strong>
              </div>
              <div id="Prodotto">
                {prodotti.map((prodotto) => (
                  <div
                    key={prodotto.Id}
                    className="d-flex justify-content-between"
                  >
                    <div>
                      {prodotto.Nome} - {prodotto.Descrizione}
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={checkboxState[prodotto.Id] || false} // Usa lo stato dei checkbox
                        // onChange={() => handleCheckboxChange(prodotto.Id)} // Passa l'ID del prodotto
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p>Nessun prodotto trovato per questa categoria.</p>
        )}
      </div> */}
    </>
  );
}
export default RitornaPiatti;
