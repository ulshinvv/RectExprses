const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let db;

async function connectDb() {
  if (!db) { 
    db = await open({
      filename: './database.db',
      driver: sqlite3.Database,
    });
  }
  return db; 
}

async function createTables() {
  const db = await connectDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (item_id) REFERENCES items (id)
    );
  `);

  console.log('Таблицы успешно созданы');
}

async function getAllUsers() {
  const db = await connectDb();
  const users = await db.all('SELECT * FROM users');
  return users;
}

module.exports = { createTables, getAllUsers, connectDb };

