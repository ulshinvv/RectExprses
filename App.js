import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import HomePage from './HomePage';
import EditPage from './EditPage';
import Header from './Header';
import Footer from './Footer';
import Cart from './Cart';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');
  const [isRegistering, setIsRegistering] = useState(true);
  const [userId, setUserId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          handleLogout();
        } else {
          setIsAuthenticated(true);
          setRole(decodedToken.role);
          setUserId(decodedToken.id);
          const savedPath = localStorage.getItem('currentPath');
          if (savedPath && savedPath !== '/register' && savedPath !== '/login') {
            navigate(savedPath);
          }
        }
      } catch (err) {
        console.error('Ошибка декодирования токена:', err);
        handleLogout();
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('currentPath', location.pathname);
    }
  }, [location.pathname, isAuthenticated]);

  const handleLoginSuccess = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      localStorage.setItem('authToken', token);
      setIsAuthenticated(true);
      setRole(decodedToken.role);
      setUserId(decodedToken.id);
      navigate('/');
    } catch (err) {
      console.error('Ошибка обработки токена при логине:', err);
    }
  };

  const handleRegistrationSuccess = () => {
    setIsRegistering(false);
  };

  const handleSwitchToLogin = () => {
    setIsRegistering(false);
  };

  const handleSwitchToRegister = () => {
    setIsRegistering(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentPath');
    setIsAuthenticated(false);
    setRole('');
    setUserId(null);
    navigate('/login');
  };

  return (
    <>
      <Header onLogout={handleLogout} isAuthenticated={isAuthenticated} />
<main style={{
     
    }}

>
  <TransitionGroup>
    <CSSTransition
      key={location.key}
      classNames="fade"
      timeout={500}
    >
      <Routes location={location}>
        {isAuthenticated ? (
          role === 'admin' ? (
            <>
              <Route path="/" element={<EditPage onLogout={handleLogout} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<HomePage onLogout={handleLogout} userId={userId} />} />
              <Route path="/cart" element={<Cart userId={userId} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )
        ) : (
          <>
            {isRegistering ? (
              <Route
                path="/register"
                element={
                  <RegistrationForm
                    onRegistrationSuccess={handleRegistrationSuccess}
                    onSwitchToLogin={handleSwitchToLogin}
                  />
                }
              />
            ) : (
              <Route
                path="/login"
                element={
                  <LoginForm
                    onLoginSuccess={handleLoginSuccess}
                    onSwitchToRegister={handleSwitchToRegister}
                  />
                }
              />
            )}
            <Route path="*" element={<Navigate to={isRegistering ? '/register' : '/login'} />} />
          </>
        )}
      </Routes>
    </CSSTransition>
  </TransitionGroup>
</main>
<Footer />
    </>
  );
}

export default App;
