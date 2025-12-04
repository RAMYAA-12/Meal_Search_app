const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./favorites.db", (err) => {
  if (err) console.log(err);
  else console.log("Database connected");
});

db.run(`
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idMeal TEXT UNIQUE,
    name TEXT
  )
`);

module.exports = db;
