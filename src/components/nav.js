import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const nav = ({ CambiaCategoria, CambiaTipologia }) => {
  return (
    <>
      <div className="d-flex justify-content-center">
        <div
          className="d-flex justify-content-between align-items-start"
          style={{ width: "94%" }}
        >
          <nav className="navbar navbar-expand-lg justify-content-center">
            <div className="container-fluid" style={{ flexWrap: "nowrap" }}>
              <div className="navbar-brand"></div>
            </div>
            <div style={{ marginLeft: "5%" }}>
              <div className="collapse navbar-collapse" id="navPiatti">
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
                        className="btn btn-link nav-link"
                        onClick={() => CambiaCategoria(categoria.toLowerCase())}
                      >
                        {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>

          <nav className="navbar navbar-expand-lg justify-content-center">
            <div className="container-fluid" style={{ flexWrap: "nowrap" }}>
              <div className="navbar-brand"></div>
            </div>
            <div style={{ marginLeft: "5%" }}>
              <div className="collapse navbar-collapse" id="navBevande">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  {["Analcolici", "Alcolici", "Vini", "Amari", "Liquori"].map(
                    (tipologia) => (
                      <li key={tipologia} className="nav-item">
                        <button
                          className="btn btn-link nav-link"
                          onClick={() =>
                            CambiaTipologia(tipologia.toLowerCase())
                          }
                        >
                          {tipologia.charAt(0).toUpperCase() +
                            tipologia.slice(1)}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};
export default nav;
