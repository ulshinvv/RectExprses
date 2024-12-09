import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './css/HomePage.css';

const HomePage = ({ onLogout, userId }) => {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:3001/items');
        if (!response.ok) {
          throw new Error('Ошибка загрузки товаров');
        }
        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error('Ошибка загрузки товаров:', err);
        alert('Ошибка при загрузке товаров');
      }
    };

    fetchItems();
  }, []);

  const handleAddToCart = async (itemId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('Пользователь не авторизован');
      return;
    }

    let decodedToken;
    try {
      decodedToken = jwtDecode(token);
    } catch (err) {
      console.error('Ошибка декодирования токена:', err);
      setMessage('Ошибка авторизации');
      return;
    }

    const userId = decodedToken.id;

    try {
      console.log('Отправка данных на сервер:', { userId, itemId, quantity: 1 });

      const response = await fetch('http://localhost:3001/carts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          itemId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error || 'Ошибка добавления товара в корзину');
      }
    } catch (err) {
      console.error('Ошибка добавления товара в корзину:', err);
      setMessage('Ошибка добавления товара в корзину');
    }
  };

  return (
    <div className="homepage-container">
      <h1 className="homepage-header">Главная страница</h1>
      
      <button className="cart-button" onClick={() => navigate('/cart')}>Перейти в корзину</button>

      <h2 className="items-header">Список товаров</h2>
      {message && <p className="message">{message}</p>}
      <ul className="items-list">
        {items.map((item) => (
          <li key={item.id}>
            <p>{item.name}</p>
            <p>{item.description}</p>
            <p>Цена: {item.price} руб.</p>
            <button
              className="add-to-cart-button"
              onClick={() => handleAddToCart(item.id)}
            >
              Добавить в корзину
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;