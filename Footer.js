import React from 'react';
import './css/Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <a href="/about">About Us</a>
        <a href="/contact">Contact</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
      </div>
      <p className="footer-text">© {new Date().getFullYear()} My Awesome App. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
