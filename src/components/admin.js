import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";
import AggiungiPiatto from "./aggiungi_piatto.js";
import AggiungiBevande from "./aggiungi_bevande.js";
import Prenotazione from "./prenotazione.js";
// 192.168.157.78 telefono
// 192.168.0.105 casa
// 172.20.10.12 manesi
export const endpoint = "10.158.237.78";

function Admin() {
  const [Categoria, setCategoria] = useState("");

  const [prodotti, setProdotti] = useState([]);
  const [error, setError] = useState(null); // Stato per gestire gli errori
  const [checkboxState, setCheckboxState] = useState({}); // Stato dei checkbox

  const navigate = useNavigate();

  // Effettua il controllo di autenticazione al montaggio del componente
  useEffect(() => {
    let operatore = localStorage.getItem("result");
    if (!operatore) {
      // Reindirizza alla pagina di login se "result" non è presente
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchProdotti() {
      try {
        const response = await fetch(
          `http://${endpoint}:3001/api/prodotti/${Categoria}`,
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

  const apibevande = async (Tipologia) => {
    const url = Tipologia
      ? `http://${endpoint}:3001/api/${Tipologia}/bevande`
      : `http://${endpoint}:3001/api/tutteBevande`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Errore nella richiesta delle bevande");
      const data = await response.json();

      setProdotti(data);
      setError(null);
      document.getElementById("cate_selezionata").innerText =
        `Bevande - ${Tipologia}`;

      // Inizializza lo stato dei checkbox
      const initialCheckboxState = {};
      data.forEach((bevanda) => {
        initialCheckboxState[bevanda.Id] = bevanda.Disponibilità === 1;
      });
      setCheckboxState(initialCheckboxState);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCheckboxChange = async (id) => {
    const newState = !checkboxState[id]; // Inverte lo stato attuale
    setCheckboxState((prevState) => ({
      ...prevState,
      [id]: newState, // Aggiorna solo lo stato del checkbox specifico
    }));

    // Determina la tabella in base alla categoria selezionata o ai prodotti
    const table = Categoria ? "piatti" : "bevande"; // Imposta la tabella corretta

    // Aggiorna la disponibilità nel database
    try {
      const response = await fetch(
        `http://${endpoint}:3001/api/disponibilita`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            table,
            disponibilita: newState ? 1 : 0, // 1 per disponibile, 0 per non disponibile
            id,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Errore nell'aggiornamento della disponibilità");
      }
    } catch (error) {
      console.error("Errore nell'aggiornamento della disponibilità", error);
      // Ripristina lo stato precedente in caso di errore
      setCheckboxState((prevState) => ({
        ...prevState,
        [id]: !newState, // Torna indietro all'originale
      }));
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
      <h1 className="text-center">Gestionale Admin</h1>
      <nav className="navbar navbar-expand-lg ">
        <div className="container-fluid" style={{ flexWrap: "nowrap" }}>
          <div className="navbar-brand">Menù</div>

          <div
            style={{ width: "100vw " }}
            className="d-flex justify-content-end"
          >
            <button
              style={{
                height: "39.6px",
                padding: "4px 12px",
                border: "1px solid rgba(0, 0, 0, 0.15)",
                fontSize: "23px",
              }}
              aria-current="page"
              onClick={() => window.location.reload()}
              className=" btn nav-link active navbar-toggler"
            >
              <span
                className=" bi bi-arrow-bar-up"
                style={{ fontSize: "30px" }}
              ></span>
            </button>
            <div className="d-flex">
              <button
                style={{
                  height: "39.6px",
                  padding: "4px 12px",
                  border: "1px solid rgba(0, 0, 0, 0.15)",
                  fontSize: "23px",
                }}
                type="button"
                className="btn d-flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#ModalBevande"
              >
                <span className="bi bi-plus-lg d-flex"></span>
                <i className="bi bi-cup-straw"></i>
              </button>
              {/* bottone modale */}
              <button
                style={{
                  height: "39.6px",
                  padding: "4px 12px",
                  border: "1px solid rgba(0, 0, 0, 0.15)",
                  fontSize: "23px",
                }}
                type="button"
                className="btn d-flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#ModalPiatti"
              >
                <span className="bi bi-plus-lg d-flex">
                  <img
                    src="icons8-pasto-50.png"
                    style={{ height: "23px" }}
                    alt=""
                  ></img>
                </span>
              </button>

              {/* Modale Bevande */}
              <div
                className="modal fade"
                id="ModalBevande"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Aggiungi Bevanda
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <AggiungiBevande />
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary text-dark"
                        data-bs-dismiss="modal"
                      >
                        Chiudi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Modale Piatti */}
              <div
                className="modal fade"
                id="ModalPiatti"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Aggiungi Piatto
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <AggiungiPiatto />
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary text-dark"
                        data-bs-dismiss="modal"
                      >
                        Chiudi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* bottone navbar */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        <div style={{ marginLeft: "5%" }}>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {[
                "antipasti",
                "primi",
                "secondi",
                "contorni",
                "frutta",
                "dolci",
              ].map((categoria) => (
                <li key={categoria} className="nav-item">
                  <button
                    className="nav-link active"
                    aria-current="page"
                    onClick={() => CambiaCategoria(categoria)}
                  >
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                  </button>
                </li>
              ))}

              <li className="nav-item dropdown">
                <button
                  className="nav-link active dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={() => apibevande("")}
                >
                  Bevande
                </button>

                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => apibevande("Vini")}
                    >
                      Vini
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => apibevande("Alcolici")}
                    >
                      Alcolici
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => apibevande("Analcolici")}
                    >
                      Analcolici
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => apibevande("Liquori")}
                    >
                      Liquori
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => apibevande("Amari")}
                    >
                      Amari
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Messaggio di errore */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Render dei prodotti in base alla categoria scelta */}
      <div>
        <h2 className="text-center">
          Menù:{" "}
          <span id="cate_selezionata">
            {Categoria.charAt(0).toUpperCase() + Categoria.slice(1)}
          </span>
        </h2>
        {prodotti.length > 0 ? (
          <div className="d-flex justify-content-center">
            <div
              style={{ lineHeight: "2", width: "75%", marginBottom: "6rem" }}
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
                        onChange={() => handleCheckboxChange(prodotto.Id)} // Passa l'ID del prodotto
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
      </div>
      <div className="d-flex justify-content-center"></div>
      <Prenotazione />
    </div>
  );
}

export default Admin;
