const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const JWT_SECRET = 'keyyy(секретный)';

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('Подключение к базе данных установлено (для carts)');
  }
});

router.post('/add', async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    if (!userId || !itemId || !quantity) {
      return res.status(400).json({ error: 'Не все данные указаны' });
    }

    const item = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM items WHERE id = ?', [itemId], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (!item) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    const existingItem = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM cart WHERE user_id = ? AND item_id = ?', [userId, itemId], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (existingItem) {
      db.run('UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND item_id = ?', [quantity, userId, itemId], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Ошибка при обновлении корзины' });
        }
        res.json({ message: 'Товар обновлен в корзине' });
      });
    } else {
      db.run('INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, ?)', [userId, itemId, quantity], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Ошибка при добавлении товара в корзину' });
        }
        res.json({ message: 'Товар добавлен в корзину' });
      });
    }

  } catch (err) {
    console.error('Ошибка добавления товара в корзину:', err);
    res.status(500).json({ error: 'Ошибка при добавлении товара в корзину' });
  }
});

router.get('/load', async (req, res) => { 
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ error: 'Нет доступа' });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Не авторизован' });
      }

      const userId = decoded.id;

      const cartItems = await new Promise((resolve, reject) => {
        db.all(
          `SELECT cart.id, items.name, items.price, cart.quantity
           FROM cart
           JOIN items ON cart.item_id = items.id
           WHERE cart.user_id = ?`,
          [userId],
          (err, rows) => {
            if (err) reject(err);
            resolve(rows);
          }
        );
      });

      if (cartItems.length === 0) {
        return res.status(404).json({ message: 'Корзина пуста' });
      }

      res.json({ cartItems });
    });
  } catch (err) {
    console.error('Ошибка при получении корзины:', err);
    res.status(500).json({ error: 'Ошибка при получении корзины' });
  }
});

router.patch('/remove', async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    if (!userId || !itemId) {
      return res.status(400).json({ error: 'Не все данные указаны' });
    }
    else{
      try {
        db.run('DELETE FROM cart WHERE id = ? AND user_id = ?' , [itemId, userId]);
        console.log('Количество товара обновлено');
      } catch (err) {
        console.error('Ошибка при обновлении товара:', err);
        return res.status(500).json({ error: 'Ошибка при обновлении товара' });
      }
    }

    res.json({ message: 'Количество товара обновлено' });

  } catch (err) {
    console.error('Ошибка при обновлении корзины:', err);
    res.status(500).json({ error: 'Ошибка при обновлении корзины' });
  }
});

module.exports = router;
