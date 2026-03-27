// server/index.js
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connessione a MySQL
const db = mysql.createConnection({
  host: "localhost", // L'host del server MySQL
  user: "root", // Il nome utente di MySQL
  //   password: "", // La password di MySQL
  database: "tenuta_mezzana", // Il nome del database
});

db.connect((err) => {
  if (err) {
    console.error("Errore di connessione a MySQL:", err);
  } else {
    console.log("Connesso a MySQL");
  }
});

// Endpoint di esempio per ottenere bevande
app.get("/api/bevande", (req, res) => {
  const query = "SELECT * FROM bevande WHERE Disponibilità > 0"; // Assicurati che il nome della tabella sia corretto
  db.query(query, (err, results) => {
    if (err) {
      console.error("Errore nella query SQL:", err); // Aggiungi questo log per identificare l'errore
      res.status(500).send("Errore nella query SQL");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/tavoli", (req, res) => {
  const query = "SELECT * FROM tavolo";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Errore nella query SQL:", err);
      res.status(500).send("Errore nella query SQL");
    } else {
      res.json(results);
    }
  });
});

// Endpoint di esempio per ottenere piatti
app.get("/api/piatti", (req, res) => {
  const query = "SELECT * FROM piatti WHERE Disponibilità > 0"; // Assicurati che il nome della tabella sia corretto
  db.query(query, (err, results) => {
    if (err) {
      console.error("Errore nella query SQL:", err); // Aggiungi questo log per identificare l'errore
      res.status(500).send("Errore nella query SQL");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/tutteBevande", (req, res) => {
  const query = "SELECT * FROM bevande ";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Errore nella query SQL:", err); // Aggiungi questo log per identificare l'errore
      res.status(500).send("Errore nella query SQL");
    } else {
      res.json(results);
    }
  });
});

app.post("/api/add/tavolo", (req, res) => {
  const { Numero, Capienza } = req.body;

  // Query per controllare se il tavolo esiste già
  const checkQuery = `SELECT * FROM tavolo WHERE Numero = ?`;

  db.query(checkQuery, [Numero], (err, results) => {
    if (err) {
      console.error("Errore durante il controllo del tavolo", err);
      return res.status(500).send("Errore durante il controllo del tavolo");
    }

    if (results.length > 0) {
      // Se il tavolo esiste già, restituisci un errore
      return res.status(400).send("Esiste già un tavolo con questo numero");
    }

    // Se il tavolo non esiste, esegui l'inserimento
    const insertQuery = `INSERT INTO tavolo (Numero, Capienza) VALUES (?, ?)`;

    db.query(insertQuery, [Numero, Capienza], (err, result) => {
      if (err) {
        console.error("Errore nell'aggiunta del tavolo", err);
        return res.status(500).send("Errore nell'aggiunta del tavolo");
      } else {
        return res.status(200).send("Tavolo aggiunto con successo");
      }
    });
  });
});

app.post("/api/add/piatto", (req, res) => {
  const { Nome, Descrizione, Prezzo, Categoria } = req.body;
  const query = `INSERT INTO piatti (Nome, Descrizione, Prezzo, Disponibilità, Categoria) VALUES (?, ?, ?, 1, ?)`;
  db.query(query, [Nome, Descrizione, Prezzo, Categoria], (err, result) => {
    if (err) {
      console.error("Errore nell'aggiunta del piatto", err);
      return res.status(500).send("Errore nell'aggiunta del piatto");
    } else {
      return res.status(200).send("Piatto Aggiunto con successo");
    }
  });
});
app.post("/api/add/bevanda", (req, res) => {
  const { Nome, Descrizione, Prezzo, Tipologia } = req.body;
  const query = `INSERT INTO bevande (Nome, Descrizione, Prezzo, Disponibilità, Tipologia) VALUES (?, ?, ?, 1, ?)`;
  db.query(query, [Nome, Descrizione, Prezzo, Tipologia], (err, result) => {
    if (err) {
      console.error("Errore nell'aggiunta della bevanda", err);
      return res.status(500).send("Errore nell'aggiunta della bevanda");
    } else {
      return res.status(200).send("Bevanda Aggiunto con successo");
    }
  });
});

// Array di tabelle consentite per prevenire SQL injection
const allowedCategorias = [
  "antipasti",
  "primi",
  "secondi",
  "contorni",
  "frutta",
  "dolci",
  "Vuoto",
]; // Aggiungi qui i nomi delle tabelle che puoi usare

app.get("/api/prodotti/:Categoria", (req, res) => {
  const Categoria = req.params.Categoria;

  // Controlla se la tabella è nella lista consentita
  if (!allowedCategorias.includes(Categoria)) {
    return res.status(400).send("Nome tabella non valido.");
  }

  // Prepara la query
  const query = `SELECT * FROM piatti WHERE Categoria= ? `; // Usa il segnaposto per maggiore sicurezza
  db.query(query, [Categoria], (err, results) => {
    if (err) {
      console.error("Errore nella query SQL:", err);
      res.status(500).send("Errore nella query SQL");
    } else {
      res.setHeader("Content-Type", "application/json"); // Imposta il tipo di contenuto
      res.json(results);
    }
  });
});

const Tipologie = ["Vini", "Alcolici", "Analcolici", "Liquori", "Amari"]; // Aggiungi qui i nomi delle tabelle che puoi usare

app.get("/api/:Tipologia/bevande", (req, res) => {
  const Tipologia = req.params.Tipologia;

  // Controlla se la tabella è nella lista consentita
  if (!Tipologie.includes(Tipologia)) {
    return res.status(400).send("Nome tabella non valido.");
  }

  // Prepara la query
  const query = `SELECT * FROM bevande WHERE Tipologia= ? `; // Usa il segnaposto per maggiore sicurezza
  db.query(query, [Tipologia], (err, results) => {
    if (err) {
      console.error("Errore nella query SQL:", err);
      res.status(500).send("Errore nella query SQL");
    } else {
      res.setHeader("Content-Type", "application/json"); // Imposta il tipo di contenuto
      res.json(results);
    }
  });
});

const ListaTable = ["piatti", "bevande"];

// Endpoint per aggiornare la disponibilità
app.post("/api/disponibilita", (req, res) => {
  const { table, disponibilita, id } = req.body;

  // Controlla se la tabella è nella lista consentita
  if (!ListaTable.includes(table)) {
    return res.status(400).send("Nome tabella non valido.");
  }

  const query = `UPDATE ?? SET Disponibilità = ? WHERE id = ?`;

  db.query(query, [table, disponibilita, id], (err, result) => {
    if (err) {
      console.error("Errore nell'aggiornamento della disponibilità:", err);
      return res
        .status(500)
        .send("Errore nell'aggiornamento della disponibilità");
    } else {
      return res.status(200).send("Disponibilità aggiornata con successo");
    }
  });
});

app.post("/api/PiattiTavolo", (req, res) => {
  const { Numero } = req.body;

  // Validazione input
  if (!Numero || isNaN(Numero)) {
    return res.status(400).send("Numero tavolo non valido");
  }

  const query = `
    SELECT 
      tavolo.Numero AS NumeroTavolo, 
      piatti.Nome AS NomePiatto, 
      piatti.Descrizione AS DescrizionePiatto,
      dettagliocomanda.Quantità AS Quantita,
      piatti.Prezzo AS PrezzoUnitario,
      piatti.Prezzo * dettagliocomanda.Quantità AS Totale
    FROM dettagliocomanda
    INNER JOIN comanda ON dettagliocomanda.ComandaID = comanda.ComandaID
    INNER JOIN tavolo ON comanda.TavoloID = tavolo.TavoloID
    INNER JOIN piatti ON dettagliocomanda.PiattoID = piatti.Id
    WHERE dettagliocomanda.PiattoID IS NOT NULL AND tavolo.Numero = ?;
  `;

  db.query(query, [Numero], (err, results) => {
    if (err) {
      console.error("Errore nella query SQL:", err);
      return res.status(500).send("Errore nella query SQL");
    }

    if (results.length === 0) {
      return res
        .status(200)
        .json({ message: "Nessun piatto trovato per questo tavolo" });
    }

    res.json(results);
  });
});

// Avvia il server
const PORT = 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
