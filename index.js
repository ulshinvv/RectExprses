const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createTables } = require('./db');
const JWT_SECRET = 'keyyy(секретный)';//'your_jwt_secret_key';
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 3001;

const users = require('./routes/users');
const items = require('./routes/items');
const carts = require('./routes/carts');

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', users);
app.use('/items', items);
app.use('/carts', carts);

function checkAdmin(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Нет доступа' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Не авторизован' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Нет прав администратора' });
    }

    req.user = decoded;
    next();
  });
}

app.put('/admin/edit', checkAdmin, (req, res) => {
  res.json({ message: 'Доступ разрешен, редактирование успешно выполнено!' });
});

(async () => {
  try {
    await createTables();
    app.listen(port, () => {
      console.log(`Сервер запущен на порту ${port}`);
    });
  } catch (err) {
    console.error('Ошибка при создании таблиц:', err);
  }
})();
