import React, { useState } from 'react';
import styles from './css/RegistrationForm.module.css';

const RegistrationForm = ({ onRegistrationSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
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

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Ошибка при регистрации');
      const data = await response.json();
      setMessage(data.message);
      onRegistrationSuccess();
    } catch (error) {
      setMessage(error.message);
    }
  };
  
  return (
<div className={styles.container}>
    <form className={styles.form} onSubmit={handleRegister}>
        {message && <p className={styles.message}>{message}</p>}
        <div className={styles.formGroup}>
            <label className={styles.label}>Имя:</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
                required
            />
        </div>
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
        <button type="submit" className={styles.button}>Зарегистрироваться</button>
        <button
            type="button"
            className={styles.secondaryButton}
            onClick={onSwitchToLogin}
        >
            Уже есть аккаунт? Войти
        </button>
    </form>
</div>

  );
};

export default RegistrationForm;