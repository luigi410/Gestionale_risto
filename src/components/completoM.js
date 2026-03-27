import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Mare() {
  return (
    <div>
      <h1 className="titoli-menu font-bauer">MENÙ COMPLETO MARE</h1>

      <div
        className="font-marat"
        style={{ fontSize: "17px", marginTop: "3rem" }}
      >
        <p>DEGUSTAZIONE DI ANTIPASTI DELLA TENUTA</p>
        <p>PRIMO "MARE" (a scelta)</p>
        <p>SECONDO "MARE" CON CONTORNO (a scelta)</p>

        <p style={{ marginTop: "2rem" }}>
          Acqua, 1/4 di vino e coperto inclusi
        </p>
        <p
          className="font-marat "
          style={{
            fontSize: "25px",
            marginTop: "3rem",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          € 35.00
        </p>
      </div>
    </div>
  );
}
export default Mare;
