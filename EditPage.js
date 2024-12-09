import React, { useState, useEffect } from 'react';
import styles from './css/EditPage.module.css';

const EditPage = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/users/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.users);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка при загрузке пользователей:', err);
        setLoading(false);
      });
  }, []);

  const handleRoleChange = (userId, newRole) => {
    fetch(`http://localhost:3001/users/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: newRole }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
        }
      })
      .catch((err) => {
        console.error('Ошибка при обновлении роли:', err);
      });
  };

  return (
    <div className={styles['edit-page-container']}>
      <h1 className={styles['edit-page-header']}>Страница для администратора</h1>
      <p className={styles['edit-page-subheader']}>Здесь могут редактировать только администраторы.</p>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <table className={styles['users-table']}>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Изменить роль</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EditPage;
