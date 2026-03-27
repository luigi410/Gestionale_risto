import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Bottoni() {
  return (
    <div
      className="d-flex justify-content-between w-60 mt-3 mx-3"
      style={{ width: "75%" }}
    >
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navPiatti"
        aria-controls="navPiatti"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar">
          <img
            src="icons8-pasto-50.png"
            alt=""
            style={{ height: "2rem" }}
          ></img>
        </span>
      </button>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navBevande"
        aria-controls="navBevande"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar ">
          <i className="bi bi-cup-straw" style={{ fontSize: "2rem" }}></i>
        </span>
      </button>
    </div>
  );
}
export default Bottoni;
