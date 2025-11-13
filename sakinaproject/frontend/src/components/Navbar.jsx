import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/rooms', label: 'Rooms' },
    { path: '/customers', label: 'Customers' },
    { path: '/bookings', label: 'Bookings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContent}>
        <Link to="/dashboard" style={styles.brand}>
          🏨 HotelEase
        </Link>
        <div style={styles.navItems}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navLink,
                ...(isActive(item.path) ? styles.navLinkActive : {})
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div style={styles.userSection}>
          <span style={styles.welcomeText}>Welcome, {user?.name}</span>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2563eb',
    color: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
    padding: '0 20px'
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'white'
  },
  navItems: {
    display: 'flex',
    gap: '20px'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    transition: 'background-color 0.3s'
  },
  navLinkActive: {
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  welcomeText: {
    fontSize: '14px'
  },
  logoutButton: {
    backgroundColor: '#1d4ed8',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default Navbar;