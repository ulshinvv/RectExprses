import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './css/Cart.css'; 

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleRemoveItem = async (itemId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Пользователь не авторизован');
      return;
    }
    let decodedToken;
    decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    try {
      console.log('Отправка данных на сервер для уменьшения количества товара:', { userId: userId, itemId: itemId });
  
      const response = await fetch('http://localhost:3001/carts/remove', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId, 
          itemId: itemId,
        }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Ошибка от сервера:', errorResponse);
        throw new Error('Не удалось уменьшить количество товара');
      }

      const data = await response.json();
      console.log('Ответ от сервера:', data);
      
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
    } catch (err) {
      console.error('Ошибка при уменьшении количества товара:', err);
      setError('Ошибка при уменьшении количества товара');
    }
  };

  useEffect(() => {

    const fetchCartItems = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Пользователь не авторизован');
        setLoading(false);
        return;
      }
    
      try {
        const response = await fetch('http://localhost:3001/carts/load', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        console.log('Ответ сервера:', data);
    
        if (data && Array.isArray(data.cartItems)) {
          console.log('Корзина:', data.cartItems);
          setCartItems(data.cartItems);
        } else {
          setError('Корзина пуста');
        }
      } catch (err) {
        console.error('Ошибка загрузки корзины:', err);
        setError('Ошибка загрузки корзины');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCartItems();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="cart-container">
      <h2 className="cart-header">Корзина</h2>
      <button className="back-button" onClick={handleBack}>Назад</button>
      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Корзина пуста</p>
      ) : (
        <ul className="cart-items-list">
          {cartItems.map((item) => (
            <li key={item.id}>
              <div>{item.name} - {item.quantity} x {item.price} ₽</div>
              <div>Итого: {item.quantity * item.price} ₽</div>
              <button
                className="remove-item-button"
                onClick={() => handleRemoveItem(item.id)}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
