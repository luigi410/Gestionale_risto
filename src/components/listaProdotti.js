import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const ListaProdotti = ({
  tipologia,
  categoria,
  prodotti,
  searchTerm,
  handleSearch,
  toggleSelezione,
  selezionati,
}) => {
  return (
    <div id="form&listaProdotti">
      <h4 id="cate_selezionata">
        <span>Prodotti - </span>
        <span>{tipologia}</span>
        <span>{categoria}</span>
      </h4>
      <form className="d-flex mb-4" role="search">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Cerca"
          aria-label="Search"
          value={searchTerm}
          onChange={handleSearch} // Gestore dell'evento onChange
        />
      </form>
      {/* Rendering della lista dei prodotti filtrati */}
      <ul className="list-group" id="listaProdotti">
        {prodotti.map((prodotto, index) => (
          <li key={`${prodotto.Nome}-${index}`} className="list-group-item">
            <strong>{prodotto.Nome}</strong>
            <div className="d-flex">
              <div>
                {Array.isArray(prodotto.Descrizione) ? (
                  prodotto.Descrizione.map((item, idx) => (
                    <div
                      key={`${prodotto.Nome}-${item.descrizione}-${item.sezione}-${item.id}-${idx}`}
                    >
                      <button
                        className={`btn m-1 d-flex justify-content-between ${
                          selezionati[
                            `${prodotto.Nome}-${item.descrizione}-${item.sezione}-${item.id}`
                          ]
                            ? "btn-outline-white bordo-nero bg-success text-white "
                            : "btn-outline-white bordo-nero "
                        }`}
                        style={{ width: "100%" }}
                        onClick={() =>
                          toggleSelezione(
                            prodotto.Nome, // Nome della prodotto
                            item.descrizione,
                            item.sezione,
                            item.id
                          )
                        }
                      >
                        <div
                          key={`prodotto-${item.descrizione}- ${item.prezzo}`}
                          className="d-flex justify-content-between"
                          style={{ width: "100%" }}
                        >
                          {item.descrizione} - {item.prezzo} €
                          <span
                            key={`span-select-${prodotto.Nome}-${item.id}-${idx}`}
                          >
                            <select
                              type="number"
                              style={{ height: "100%" }}
                              key={`select-${prodotto.Nome}-${item.id}-${idx}`}
                            >
                              <option key={`${item.nome}-${item.id}-1`}>
                                1
                              </option>
                              <option key={`${item.nome}-${item.id}-2`}>
                                2
                              </option>
                              <option key={`${item.nome}-${item.id}-3`}>
                                3
                              </option>
                              <option key={`${item.nome}-${item.id}-4`}>
                                4
                              </option>
                              <option key={`${item.nome}-${item.id}-5`}>
                                5
                              </option>
                              <option key={`${item.nome}-${item.id}-6`}>
                                6
                              </option>
                            </select>
                          </span>
                        </div>
                      </button>
                    </div>
                  ))
                ) : (
                  <button
                    key={`${prodotto.Nome}-0`} // Key per la singola prodotto senza 'prodotto'
                    className={`btn m-1 ${
                      selezionati[`${prodotto.Nome}-0`]
                        ? "btn-outline-white bordo-nero bg-success text-white"
                        : "btn-outline-white bordo-nero"
                    }`}
                    onClick={() => toggleSelezione(prodotto.Nome, 0)} // Singola prodotto
                  >
                    {prodotto.Nome} - {prodotto.Prezzo?.toFixed(2) || "0.00"} €
                  </button>
                )}

                <input
                  className="form-control me-2"
                  type="text"
                  placeholder="Aggiuntive..."
                  style={{ width: "70%" }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaProdotti;
