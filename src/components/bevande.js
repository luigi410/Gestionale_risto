// src/App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { endpoint } from "./admin";

function Bevande() {
  // const endpoint = "192.168.78.78";

  const [dati, setDati] = useState([]);

  useEffect(() => {
    // Effettua una richiesta GET al server
    axios
      .get(`http://${endpoint}:3001/api/bevande`)
      .then((response) => {
        setDati(response.data); // Memorizza i dati nella variabile di stato
      })
      .catch((error) => {
        console.error("Errore nel recupero delle bevande:", error);
      });
  }, []);
  console.log(dati);
  const datiPuliti = dati.map((dato) => ({
    ...dato,
    Nome: dato.Nome.replace(/^"|"$/g, ""),
  }));

  // Funzione per aggregare descrizioni e prezzi per nome
  const aggregateDescriptionsAndPrices = (prodotti) => {
    return prodotti.reduce((acc, prodotto) => {
      if (prodotto.Disponibilità > 0) {
        // Filtra solo quelli disponibili
        // Controlla se il nome esiste già nell'accumulatore
        if (!acc[prodotto.Nome]) {
          acc[prodotto.Nome] = {
            descrizioni: [],
            prezzi: new Set(), // Usa un Set per gestire i prezzi unici
          };
        }
        // Aggiungi la descrizione
        acc[prodotto.Nome].descrizioni.push(prodotto.Descrizione);
        // Aggiungi il prezzo al Set
        acc[prodotto.Nome].prezzi.add(prodotto.Prezzo.toFixed(2));
      }
      return acc;
    }, {});
  };

  // Raggruppa i dati per tipologia
  const groupByTipologia = (prodotti) => {
    return prodotti.reduce((acc, prodotto) => {
      const tipologia = prodotto.Tipologia || "Altro"; // Imposta una tipologia di default se manca
      if (!acc[tipologia]) {
        acc[tipologia] = [];
      }
      acc[tipologia].push(prodotto);
      return acc;
    }, {});
  };

  const prodottiRaggruppati = groupByTipologia(datiPuliti);

  return (
    <div>
      <h1
        style={{ fontSize: "18px", fontWeight: "900", letterSpacing: "4px" }}
        className="titoli-menu font-bauer"
      >
        VINI E BEVANDE
      </h1>

      {Object.entries(prodottiRaggruppati).map(([tipologia, prodotti]) => {
        const aggregatedData = aggregateDescriptionsAndPrices(prodotti);

        return (
          <div key={tipologia}>
            <h2
              className="mt-4 font-bauer titoli-menu"
              style={{ fontSize: "16px", fontWeight: "700" }}
            >
              {tipologia.toUpperCase()}
            </h2>
            {Object.entries(aggregatedData).map(
              ([nome, { descrizioni, prezzi }]) => {
                const prezziArray = Array.from(prezzi);
                const prezzoDisplay =
                  prezziArray.length === 1
                    ? prezziArray[0]
                    : prezziArray.join(" / ");

                return (
                  <div
                    key={nome}
                    className="font d-flex justify-content-between font-marat"
                  >
                    <div className="prodotto">
                      {nome} {"-- " + descrizioni.join("- ")}
                    </div>
                    <div className="prezzo">{prezzoDisplay} €</div>
                  </div>
                );
              }
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Bevande;
