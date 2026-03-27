import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Collapse from "bootstrap/js/dist/collapse";

import "../App.css";

import BottoniNav from "./bottoni-nav-prenotazione";
import Nav from "./nav";
import ListaProdotti from "./listaProdotti";
import { endpoint } from "./admin";

function Prenotazione() {
  const [id, setid] = useState("");
  const [NumeroTavolo, setNumeroTavolo] = useState("");
  const [Persone, setPersone] = useState("");
  const [prodotti, setProdotti] = useState([]); // Prodotti filtrati
  const [tipologia, setTipologia] = useState(""); // Tipologia selezionata
  const [categoria, setCategoria] = useState(""); // Categoria selezionata

  const [piattiDisponibili, setPiattiDisponibili] = useState([]);
  const [bevandeDisponibili, setBevandeDisponibili] = useState([]);
  const [selezionati, setSelezionati] = useState([]); // Stato per tenere traccia dei prodotti selezionati
  const [searchTerm, setSearchTerm] = useState("");
  const [risultatiRicerca, setRisultatiRicerca] = useState([]);
  const [prodottiAggregati, setProdottiAggregati] = useState({});
  const [tavoliOccupati, setTavoliOccupati] = useState({});
  const [PiattiDelTavolo, setPiattiDelTavolo] = useState({});

  const [error, setError] = useState(null);

  function chiudiComanda() {
    const navbarPiatti = document.querySelector("#navPiatti");
    const navbarBevande = document.querySelector("#navBevande");

    if (navbarPiatti.classList.contains("show")) {
      // Chiude solo la navbar Piatti se aperta
      const bootstrapCollapsePiatti = new Collapse(navbarPiatti, {
        toggle: false, // Imposta false per evitare il comportamento di toggle
      });
      bootstrapCollapsePiatti.hide();
    }

    if (navbarBevande.classList.contains("show")) {
      // Chiude solo la navbar Bevande se aperta
      const bootstrapCollapseBevande = new Collapse(navbarBevande, {
        toggle: false, // Imposta false per evitare il comportamento di toggle
      });
      bootstrapCollapseBevande.hide();
    }

    if (
      !navbarPiatti.classList.contains("show") &&
      !navbarBevande.classList.contains("show")
    ) {
      console.log("Già chiuse");
    }

    setProdotti([]);
    setRisultatiRicerca([]); // Rimuove i risultati
    setSearchTerm("");
    setSelezionati([]);
  }

  const addTavolo = async () => {
    try {
      // Esegui la richiesta POST al server
      const response = await fetch(`http://${endpoint}:3001/api/add/tavolo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Numero: NumeroTavolo,
          Capienza: Persone,
        }),
      });

      if (response.ok) {
        console.log("Tavolo aggiunto con successo");
        setError("Tavolo aggiunto con successo"); // Nessun errore
        // setSuccessMessage("Tavolo aggiunto con successo");
      } else {
        const errorMessage = await response.text(); // Leggi il messaggio di errore dal server
        if (response.status === 400) {
          console.log("Il tavolo esiste già");
          setError(errorMessage || "Il tavolo esiste già");
        } else {
          console.log("Errore nell'aggiunta del tavolo");
          setError("Errore durante l'aggiunta del tavolo. Riprova.");
        }
      }
    } catch (error) {
      // Gestione di errori di rete o di risposta
      console.error("Errore durante l'aggiunta del tavolo:", error);
      setError("Errore di connessione. Riprova più tardi.");
    }
  };

  function addComanda() {
    if (!NumeroTavolo || !Persone || NumeroTavolo <= 0 || Persone <= 0) {
      setError("Inserisci valori validi per Numero Tavolo e Numero Persone.");
      return;
    }

    // Logica per aggiungere il tavolo
    console.log("Tavolo aggiunto:", { NumeroTavolo, Persone });
    // Resetta i campi se necessario
    setNumeroTavolo("");
    setPersone("");

    console.log(selezionati);

    addTavolo();
    Object.keys(selezionati).forEach((chiave) => {
      const id = estraiidFinale(chiave);
      const categoria = estraiCategoria(chiave);
      console.log(`id: ${id}, categoria: ${categoria}`);
      setid(id);
      setCategoria(categoria);
    });
  }
  // Funzione per estrarre il numero finale con regex
  const estraiidFinale = (chiave) => {
    const match = chiave.match(/-(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
  };
  function estraiCategoria(chiave) {
    // Regex per catturare la parte della categoria (tra il penultimo e l'ultimo trattino)
    const match = chiave.match(/-(\w+)-\d+$/); // \w+ cattura una parola composta da lettere e numeri
    return match ? match[1] : null; // Restituisce la categoria trovata
  }
  // Funzione per aggregare descrizioni e prezzi per nome
  const aggregateDescriptionsAndPrices = (prodotti) => {
    return prodotti.reduce((acc, prodotto) => {
      // Controlla se il nome esiste già nell'accumulatore
      if (!acc[prodotto.Nome]) {
        acc[prodotto.Nome] = {
          descrizioni: [], // Contiene un array di oggetti con descrizione e prezzo
        };
      }
      // Aggiungi la descrizione e il relativo prezzo
      acc[prodotto.Nome].descrizioni.push({
        descrizione: prodotto.Descrizione,
        prezzo: prodotto.Prezzo.toFixed(2), // Formattiamo il prezzo a due decimali
        id: prodotto.Id,
        sezione: prodotto.Sezione,
      });

      return acc;
    }, {});
  };

  const CambiaTipologia = (TipologiaSelezionata) => {
    setTipologia(TipologiaSelezionata);
    console.log("Tipologia selezionata:", TipologiaSelezionata);
    console.log("bevande disponibili:", bevandeDisponibili);

    // Filtra le bevande disponibili in base alla Tipologia selezionata
    const prodottiFiltrati = bevandeDisponibili.filter(
      (prodotto) =>
        prodotto.Tipologia.toLowerCase() === TipologiaSelezionata.toLowerCase()
    );

    // Aggrega le descrizioni e i prezzi dei prodotti filtrati
    const prodottiAggregati = aggregateDescriptionsAndPrices(prodottiFiltrati);

    // Verifica se la struttura è corretta
    console.log("Prodotti aggregati:", prodottiAggregati);

    // Converti l'oggetto aggregato in un array di prodotti per il rendering
    const prodottiAggregatiArray = Object.entries(prodottiAggregati).map(
      ([nome, { descrizioni }]) => ({
        Nome: nome,
        Descrizione: descrizioni, // Ogni descrizione ora è un oggetto con descrizione e prezzo
      })
    );
    setCategoria([]);
    setProdotti(prodottiAggregatiArray);
  };

  const CambiaCategoria = (CategoriaSelezionata) => {
    setCategoria(CategoriaSelezionata);
    console.log("Categoria selezionata:", CategoriaSelezionata);
    console.log("Piatti disponibili:", piattiDisponibili);

    // Filtra le bevande disponibili in base alla Categoria selezionata
    const prodottiFiltrati = piattiDisponibili.filter(
      (prodotto) =>
        prodotto.Categoria.toLowerCase() === CategoriaSelezionata.toLowerCase()
    );

    // Aggrega le descrizioni e i prezzi dei prodotti filtrati
    const prodottiAggregati = aggregateDescriptionsAndPrices(prodottiFiltrati);

    // Verifica se la struttura è corretta
    console.log("Prodotti aggregati:", prodottiAggregati);

    // Converti l'oggetto aggregato in un array di prodotti per il rendering
    const prodottiAggregatiArray = Object.entries(prodottiAggregati).map(
      ([nome, { descrizioni }]) => ({
        Nome: nome,
        Descrizione: descrizioni, // Ogni descrizione ora è un oggetto con descrizione e prezzo
      })
    );
    setTipologia([]);
    setProdotti(prodottiAggregatiArray);
  };

  const fetchProdotti = async () => {
    try {
      const [piattiResponse, bevandeResponse, tavoliResponse] =
        await Promise.all([
          fetch(`http://${endpoint}:3001/api/piatti?Disponibilita=1`),
          fetch(`http://${endpoint}:3001/api/bevande?Disponibilita=1`),
          fetch(`http://${endpoint}:3001/api/tavoli`),
        ]);

      if (!piattiResponse.ok || !bevandeResponse.ok || !tavoliResponse.ok) {
        setError("Errore nella richiesta API");
        console.log("Errore nella richiesta API");
        return;
      }

      const [piattiData, bevandeData, tavoliData] = await Promise.all([
        piattiResponse.json(),
        bevandeResponse.json(),
        tavoliResponse.json(),
      ]);

      const BevandeConSezione = bevandeData.map((bevanda) => ({
        ...bevanda,
        Sezione: "Bevanda",
      }));
      const PiattiConSezione = piattiData.map((piatti) => ({
        ...piatti,
        Sezione: "Piatto",
      }));
      const tavoliOrdinati = tavoliData.sort((a, b) => a.Numero - b.Numero);
      setTavoliOccupati(tavoliOrdinati);
      setPiattiDisponibili(PiattiConSezione);
      setBevandeDisponibili(BevandeConSezione);

      console.log(PiattiConSezione, BevandeConSezione, tavoliData);
      setError(null);
    } catch (error) {
      setError("Errore di rete. Controlla la connessione.");
      console.log("Errore di rete:", error);
    }
  };
  // Funzione per gestire l'evento del modale
  const initializeModalEvents = () => {
    const exampleModal = document.getElementById("ModaleTavoli");
    if (exampleModal) {
      exampleModal.addEventListener("show.bs.modal", (event) => {
        // Bottone che ha attivato il modale
        const button = event.relatedTarget;
        // Estrai il valore di `data-bs-numero`
        const recipientNumero = button.getAttribute("data-bs-numero");
        const recipientePersone = button.getAttribute("data-bs-capienza");
        // Aggiorna il campo "Recipient" del modale
        const recipientNumeroInput =
          exampleModal.querySelector("#numeroTavolo");
        const recipientPersoneInput =
          exampleModal.querySelector("#personeTavolo");

        if (recipientNumeroInput && recipientPersoneInput) {
          recipientNumeroInput.value = recipientNumero;
          recipientPersoneInput.value = recipientePersone;
        }
      });
    }
  };
  useEffect(() => {
    fetchProdotti();
    initializeModalEvents();
  }, []);

  const fetchPiattiTavolo = async (numero) => {
    try {
      const PiattiTavoloResponse = await fetch(
        `http://${endpoint}:3001/api/PiattiTavolo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Numero: numero,
          }),
        }
      );

      if (PiattiTavoloResponse.ok) {
        const datiPiatti = await PiattiTavoloResponse.json();

        // Controlla se la risposta contiene un messaggio o i dati dei piatti
        if (Array.isArray(datiPiatti) && datiPiatti.length > 0) {
          // Se ci sono piatti, aggiornali nello stato
          setPiattiDelTavolo(datiPiatti);
          console.log("Piatti Tavolo:", datiPiatti);
        } else if (datiPiatti.message) {
          // Se c'è un messaggio dalla API, loggalo e aggiorna lo stato con un array vuoto
          console.log(datiPiatti.message);
          setPiattiDelTavolo([]);
        } else {
          // Caso fallback se la struttura di dati non è quella prevista
          console.log("Struttura di risposta inattesa dalla API");
          setPiattiDelTavolo([]);
        }
      } else {
        console.log("Errore nella risposta dei piatti del tavolo");
        setPiattiDelTavolo([]); // Gestione fallback
      }
    } catch (error) {
      console.log("Errore risposta piatti tavolo:", error);
      setPiattiDelTavolo([]); // Gestione fallback
    }
  };

  const toggleSelezione = (nome, descrizione, sezione, id) => {
    const key = `${nome}-${descrizione}-${sezione}-${id}`;
    console.log("Stato selezionato prima del toggle:", selezionati);
    console.log("Toggle key:", key);

    setSelezionati((prevSelezionati) => {
      const newSelezionati = {
        ...prevSelezionati,
        [key]: !prevSelezionati[key], // Inverti il valore corrente
      };

      console.log("Nuovo stato selezionato:", newSelezionati);
      return newSelezionati;
    });
  };

  const handleSearch = (event) => {
    const value = event.target.value.trim();

    console.log(value); // Log per il debug
    setTipologia([]);
    // Se il campo è vuoto, rimuovi i risultati
    if (value === "" || value === " ") {
      setRisultatiRicerca([]); // Rimuove i risultati
      setSearchTerm(""); // Resetta il termine di ricerca
      setProdotti([]);
    } else {
      setSearchTerm(value); // Aggiorna il termine di ricerca

      // Combina i due array in un unico array temporaneo
      const allProducts = [...piattiDisponibili, ...bevandeDisponibili];

      // Filtra i prodotti che contengono la stringa cercata nel nome
      const risultati = allProducts.filter((item) =>
        item.Nome.toLowerCase().includes(value.toLowerCase())
      );

      console.log(risultati); // Log dei risultati per il debug
      // Aggrega le descrizioni e i prezzi dei prodotti filtrati
      const prodottiAggregati = aggregateDescriptionsAndPrices(risultati);

      // Verifica se la struttura è corretta
      console.log("Prodotti aggregati:", prodottiAggregati);

      // Converti l'oggetto aggregato in un array di prodotti per il rendering
      const prodottiAggregatiArray = Object.entries(prodottiAggregati).map(
        ([nome, { descrizioni }]) => ({
          Nome: nome,
          Descrizione: descrizioni, // Ogni descrizione ora è un oggetto con descrizione e prezzo
        })
      );

      setProdotti(prodottiAggregatiArray);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        {/* Button trigger modal */}
        <button
          type="button"
          className="btn btn-primary btn-lg"
          data-bs-toggle="modal"
          data-bs-target="#ModalPrenotazione"
          style={{ width: "50%" }}
          //onClick={fetchProdotti} // Richiama fetchProdotti al click sul bottone
        >
          <i
            className="bi bi-plus-lg text-black"
            style={{ fontSize: "35px" }}
          ></i>
        </button>

        {/* Modale */}
        <div
          className="modal fade"
          id="ModalPrenotazione"
          tabIndex="-1"
          aria-labelledby="ModalPrenotazioneLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="ModalPrenotazioneLabel">
                  Aggiungi Tavolo
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={chiudiComanda}
                ></button>
              </div>
              <div className="modal-body">
                <div className="d-flex justify-content-between">
                  <label
                    htmlFor="InputNumeroTavolo"
                    className="form-label"
                    style={{ width: "40%" }}
                  >
                    Numero Tavolo
                  </label>
                  <label
                    htmlFor="InputPersoneTavolo"
                    className="form-label"
                    style={{ width: "40%", textAlign: "center" }}
                  >
                    N <i className="bi bi-person-fill"></i>
                  </label>
                </div>
                <div className="d-flex justify-content-between">
                  <input
                    type="number"
                    style={{ width: "40%" }}
                    className="form-control"
                    id="InputNumeroTavolo"
                    value={NumeroTavolo}
                    onChange={(e) => setNumeroTavolo(e.target.value)}
                    placeholder="es. 1..."
                    required
                  />

                  <input
                    type="number"
                    style={{ width: "40%" }}
                    className="form-control"
                    id="InputPersoneTavolo"
                    value={Persone}
                    onChange={(e) => setPersone(e.target.value)}
                    placeholder="es. 1..."
                    required
                  />
                </div>
                {error}

                <div className="d-flex justify-content-center">
                  <BottoniNav />
                </div>
                <Nav
                  CambiaCategoria={CambiaCategoria}
                  CambiaTipologia={CambiaTipologia}
                />
                <ListaProdotti
                  tipologia={tipologia}
                  categoria={categoria}
                  prodotti={prodotti}
                  searchTerm={searchTerm}
                  handleSearch={handleSearch}
                  toggleSelezione={toggleSelezione}
                  selezionati={selezionati}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={chiudiComanda}
                >
                  Chiudi
                </button>
                <button
                  type="button"
                  className="btn btn-primary text-black"
                  onClick={addComanda}
                >
                  Aggiungi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <div
          id="tavoli"
          className="d-flex justify-content-evenly mt-4 flex-wrap"
          style={{ width: "90%" }}
        >
          {Array.isArray(tavoliOccupati) &&
            tavoliOccupati.map((tavolo) => (
              <button
                type="button"
                key={`${tavolo.Numero}-${tavolo.TavoloID}`}
                className="btn bg-transprent border-black mx-2 mt-3"
                style={{
                  display: "flex",
                  fontSize: "180%",
                  width: "16%",
                  height: "40%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                data-bs-toggle="modal"
                data-bs-target="#ModaleTavoli"
                data-bs-numero={tavolo.Numero}
                data-bs-capienza={tavolo.Capienza}
                onClick={() => fetchPiattiTavolo(tavolo.Numero)}
              >
                <strong>{tavolo.Numero}</strong>
              </button>
            ))}
        </div>
      </div>

      <div
        className="modal fade"
        id="ModaleTavoli"
        tabIndex="-1"
        aria-labelledby="ModaleTavoliLabel"
        aria-hidden="false"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="ModaleTavoliLabel">
                Modifiche Tavolo
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-between">
                <label
                  htmlFor="numeroTavolo"
                  className="col-form-label"
                  style={{ width: "40%" }}
                >
                  Numero Tavolo
                </label>
                <label
                  className="form-label"
                  htmlFor="personeTavolo"
                  style={{ width: "40%", textAlign: "center" }}
                >
                  N <i className="bi bi-person-fill"></i>
                </label>
              </div>
              <div className="d-flex justify-content-between">
                <input
                  type="text"
                  id="numeroTavolo"
                  className="form-control"
                  style={{ width: "40%" }}
                  readOnly
                />

                <input
                  type="text"
                  style={{ width: "40%" }}
                  className="form-control"
                  id="personeTavolo"
                />
              </div>

              <div className="d-flex justify-content-center ">
                <BottoniNav />
              </div>
              <Nav
                CambiaCategoria={CambiaCategoria}
                CambiaTipologia={CambiaTipologia}
              />
              <ListaProdotti
                tipologia={tipologia}
                categoria={categoria}
                prodotti={prodotti}
                searchTerm={searchTerm}
                handleSearch={handleSearch}
                toggleSelezione={toggleSelezione}
                selezionati={selezionati}
              />
              <div>
                {Array.isArray(PiattiDelTavolo) &&
                PiattiDelTavolo.length > 0 ? (
                  PiattiDelTavolo.map((piatto) => (
                    <div
                      className="d-flex justify-content-between"
                      key={`${piatto.NomePiatto} - ${piatto.DescrizionePiatto} `}
                    >
                      <div>
                        {piatto.NomePiatto} - {piatto.DescrizionePiatto}
                      </div>
                      <div>
                        {piatto.PrezzoUnitario}€ x {piatto.Quantita} --{" "}
                        {piatto.Totale}€
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="d-flex justify-content-center text-danger">
                    <b style={{ fontSize: "1.2rem" }}>
                      ! Nessun piatto per questo tavolo !
                    </b>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={chiudiComanda}
                >
                  Chiudi
                </button>
                <button type="button" className="btn btn-primary text-dark">
                  Aggiorna
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Prenotazione;
