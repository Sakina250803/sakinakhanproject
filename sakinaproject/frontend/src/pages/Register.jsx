import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { register } from '../api/endpoints';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (response.data.success) {
        authLogin(response.data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>Join HotelEase to manage your hotel</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}
          
          <div style={styles.inputGroup}>
            <input
              name="name"
              type="text"
              required
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          <div style={styles.linkContainer}>
            <Link to="/login" style={styles.link}>
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 10px 0'
  },
  subtitle: {
    color: '#6b7280',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  error: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '5px',
    fontSize: '14px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '5px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box'
  },
  submitButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '12px 16px',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '500',
    marginTop: '10px'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  linkContainer: {
    textAlign: 'center'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '14px'
  }
};

export default Register;