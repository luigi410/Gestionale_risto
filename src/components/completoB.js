import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Bambini() {
  return (
    <div>
      <h1 className="titoli-menu font-bauer">MENÙ COMPLETO BAMBINI</h1>

      <div
        className="font-marat"
        style={{ fontSize: "17px", marginTop: "3rem" }}
      >
        <p>ANTIPASTO (Prosciutto e Mozzarella) oppure FRITTINI</p>
        <p>PASTA con pomodoro</p>
        <p>Cotoletta o Salsiccia con Pattine Fritte</p>
        <p>Coperto e Bevande Incluse</p>

        <p
          className="font-marat "
          style={{
            fontSize: "25px",
            marginTop: "3rem",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          € 20.00
        </p>
      </div>
    </div>
  );
}
export default Bambini;
