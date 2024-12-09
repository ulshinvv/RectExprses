const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('Подключение к базе данных установлено (для items)');
  }
});

router.get('/', (req, res) => {
  const query = 'SELECT * FROM items';

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err.message);
      return res.status(500).json({ error: 'Ошибка при извлечении данных из базы данных', details: err.message });
    }
    if (rows.length === 0) {
      console.log('Таблица "items" пуста');
    }
    res.json(rows);
  });
});

module.exports = router;
  