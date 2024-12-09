
import React, { useState } from 'react';
import styles from './css/LoginForm.module.css';

const LoginForm = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/users/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Ошибка авторизации');
      const data = await response.json();
      setMessage(`Добро пожаловать, ${data.name}!`);

      onLoginSuccess(data.token, data.role);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className={styles.container}>
    <form className={styles.form} onSubmit={handleSubmit}>
      {message && <p className={styles.message}>{message}</p>}
      <div className={styles.formGroup}>
        <label className={styles.label}>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Пароль:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className={styles.input}
          required
        />
      </div>
      <button type="submit" className={styles.button}>Войти</button>
      <button
        type="button"
        className={styles.secondaryButton}
        onClick={onSwitchToRegister}
      >
        Нет аккаунта? Зарегистрироваться
      </button>
    </form>
  </div>
  );
};

export default LoginForm;
