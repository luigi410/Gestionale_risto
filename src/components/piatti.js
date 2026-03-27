import React, { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { endpoint } from "./admin";

function Piatti() {
  // const endpoint = "192.168.78.78";
  const [dati, setDati] = useState([]);

  useEffect(() => {
    // Effettua una richiesta GET al server usando fetch
    fetch(`http://${endpoint}:3001/api/piatti`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nel recupero dei piatti");
        }
        return response.json();
      })
      .then((data) => {
        // Definisci l'ordine delle categorie desiderato
        const ordineCategorie = [
          "Antipasti",
          "Primi",
          "Secondi",
          "Contorni",
          "Frutta",
          "Dolci",
        ];

        // Pulisce le categorie rimuovendo spazi indesiderati e unificando i nomi
        const datiPuliti = data.map((dato) => ({
          ...dato,
          Nome: dato.Nome.replace(/^"|"$/g, ""), // Rimuove eventuali doppi apici da Nome
          Categoria: dato.Categoria.trim(),
        }));

        // Raggruppa i piatti per categoria e filtra le categorie senza piatti
        const datiRaggruppati = ordineCategorie
          .map((categoria) => ({
            categoria,
            piatti: datiPuliti.filter((dato) => dato.Categoria === categoria),
          }))
          .filter((gruppo) => gruppo.piatti.length > 0); // Filtra le categorie vuote

        setDati(datiRaggruppati); // Salva i dati raggruppati e filtrati nello stato
      })
      .catch((error) => {
        console.error("Errore nel recupero delle bevande:", error);
      });
  }, []);
  return (
    <div>
      {/* Renderizza solo le categorie che contengono piatti */}
      {dati.map((gruppo, index) => (
        <div key={index} className="categoria-gruppo mb-5">
          <h2
            className="mt-4 font-bauer titoli-menu"
            style={{ fontSize: "16px", fontWeight: "700" }}
          >
            {gruppo.categoria.toUpperCase()}
          </h2>
          {gruppo.piatti.map((piatto, piattoIndex) => (
            <div
              key={piattoIndex}
              className="font d-flex justify-content-between font-marat"
            >
              <div className="prodotto">
                {piatto.Nome}-- {piatto.Descrizione}
              </div>
              <div>
                <div className="prezzo"> {piatto.Prezzo.toFixed(2)} €</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
export default Piatti;
