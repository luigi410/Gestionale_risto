import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Terra from "./components/completoT.js";
import Mare from "./components/completoM.js";
import Bambini from "./components/completoB.js";
import Bevande from "./components/bevande.js";
import Piatti from "./components/piatti.js";
// import Default from "./components/mDaSelect.js";

function Home() {
  const [menuSelezionato, setMenuSelezionato] = useState(null);
  const [menuAttivo, setMenuAttivo] = useState(null); // Nuovo stato per tenere traccia del bottone attivo

  function passaMenu(menu) {
    switch (menu) {
      case 1:
        setMenuSelezionato(<Terra />);
        break;
      case 2:
        setMenuSelezionato(<Mare />);
        break;
      case 3:
        setMenuSelezionato(<Bambini />);
        break;
      case 4:
        setMenuSelezionato(<Bevande />);
        break;
      case 5:
        setMenuSelezionato(<Piatti />);
        break;
      default:
        setMenuSelezionato(null);
    }
    setMenuAttivo(menu); // Imposta il bottone attivo
  }

  return (
    <div className="App" style={{ scale: "0.6", marginTop: "-200px" }}>
      <header className="App-header">
        <div className="logo">
          <img
            src="logo_ten_M.webp"
            alt="Logo"
            onClick={() => {
              window.location.href = "/";
            }}
          />
        </div>
        <h3 className="font-bauer">Menù Digitale</h3>

        <div className="d-flex">
          <button
            className={`btn font-bottoni font-bauer color ${
              menuAttivo === 1 ? "active-btn" : ""
            }`}
            onClick={() => passaMenu(1)}
          >
            Terra
          </button>
          <button
            className={`btn font-bottoni font-bauer color ${
              menuAttivo === 2 ? "active-btn" : ""
            }`}
            onClick={() => passaMenu(2)}
          >
            Mare
          </button>
          <button
            className={`btn font-bottoni font-bauer color ${
              menuAttivo === 3 ? "active-btn" : ""
            }`}
            onClick={() => passaMenu(3)}
          >
            Bambini
          </button>
        </div>
        <div>
          <button
            className={`btn font-bottoni font-bauer color ${
              menuAttivo === 4 ? "active-btn" : ""
            }`}
            onClick={() => passaMenu(4)}
          >
            Bevande
          </button>
          <button
            className={`btn font-bottoni font-bauer color ${
              menuAttivo === 5 ? "active-btn" : ""
            }`}
            onClick={() => passaMenu(5)}
          >
            Piatti
          </button>
        </div>

        <hr style={{ width: "150%", border: "solid", opacity: "1" }}></hr>

        {/* Rendi il componente selezionato */}
        <div id="menu_selezionato" style={{ width: "145%" }}>
          {menuSelezionato}
        </div>
        <hr style={{ width: "150%", border: "solid", opacity: "1" }}></hr>
      </header>
    </div>
  );
}

export default Home;
