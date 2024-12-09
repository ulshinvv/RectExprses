const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectDb } = require('../db');
const JWT_SECRET = 'keyyy(секретный)';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const db = await connectDb();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    res.status(201).json({ userId: result.lastID, message: 'Регистрация прошла успешно!' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка создания пользователя' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = await connectDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Успешный вход', name: user.name, token, role: user.role, userId: user.id });
  } catch (err) {
    console.error('Ошибка при авторизации:', err);
    res.status(500).json({ error: 'Ошибка авторизации' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const db = await connectDb();
    const users = await db.all('SELECT id, name, email, role FROM users');
    res.json({ users });
  } catch (err) {
    console.error('Ошибка получения пользователей:', err);
    res.status(500).json({ error: 'Ошибка получения списка пользователей' });
  }
});

router.put('/users/:id/role', async (req, res) => {
  const { role } = req.body; 
  const { id } = req.params;

  try {
    const db = await connectDb();
    const result = await db.run('UPDATE users SET role = ? WHERE id = ?', [role, id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ message: 'Роль пользователя обновлена успешно' });
  } catch (err) {
    console.error('Ошибка обновления роли:', err);
    res.status(500).json({ error: 'Ошибка обновления роли пользователя' });
  }
});

module.exports = router;
