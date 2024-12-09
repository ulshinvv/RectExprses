import React from 'react';
import './css/Header.css'; // Стили для шапки

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

const Header = ({ onLogout, isAuthenticated }) => {
  return (
    <header className="site-header">
  <h1>🌟 {getGreeting()} </h1>
  <nav>
    {isAuthenticated ? (
      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    ) : (
      <p></p>
    )}
  </nav>
</header>
  );
};

export default Header;
