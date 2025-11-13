import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  useEffect(() => {
    // Add scroll reveal animation
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // Create particles
    createParticles();
  }, []);

  const createParticles = () => {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 3 + 1;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 5;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      particle.style.animationDelay = `${delay}s`;
      
      particlesContainer.appendChild(particle);
    }
  };

  const features = [
    {
      icon: '🏨',
      title: 'Smart Room Management',
      description: 'Efficiently manage all your hotel rooms with real-time availability tracking and automated status updates.'
    },
    {
      icon: '👥',
      title: 'Customer Relationship',
      description: 'Build lasting relationships with your guests through comprehensive customer profiles and booking history.'
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Make data-driven decisions with detailed reports and performance metrics for your hotel operations.'
    },
    {
      icon: '💳',
      title: 'Seamless Bookings',
      description: 'Streamline your booking process with an intuitive interface that makes reservations quick and easy.'
    },
    {
      icon: '🛎️',
      title: 'VIP Services',
      description: 'Provide exceptional service to your VIP guests with personalized attention and premium amenities.'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security and 99.9% uptime guarantee.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Hotels Trust Us' },
    { number: '50K+', label: 'Rooms Managed' },
    { number: '1M+', label: 'Happy Guests' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <div className="landing-page">
      {/* Particles Background */}
      <div className="particles"></div>

      {/* Navigation */}
      <nav className="professional-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">🏨 HotelEase Pro</Link>
          <ul className="nav-menu">
            <li><a href="#features" className="nav-link">Features</a></li>
            <li><a href="#stats" className="nav-link">Stats</a></li>
            <li><Link to="/login" className="nav-link">Login</Link></li>
            <li><Link to="/register" className="cta-button" style={{padding: '10px 25px', fontSize: '0.9rem'}}>Get Started</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">HotelEase Pro</h1>
          <p className="hero-subtitle">
            Revolutionizing Hotel Management with AI-Powered Solutions
          </p>
          <p style={{color: '#6c757d', marginBottom: '2rem', fontSize: '1.1rem'}}>
            Experience the future of hospitality management with our cutting-edge platform
          </p>
          <Link to="/register" className="cta-button">
            Start Your Journey
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card scroll-reveal">
              <span className="feature-icon">{feature.icon}</span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="stats-dashboard">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card scroll-reveal">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-section" style={{minHeight: '60vh'}}>
        <div className="hero-content">
          <h2 className="hero-title" style={{fontSize: '3rem'}}>Ready to Transform Your Hotel?</h2>
          <p className="hero-subtitle">
            Join thousands of successful hotels using HotelEase Pro
          </p>
          <div style={{display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link to="/register" className="cta-button">
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{padding: '15px 40px'}}>
              Existing User
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="professional-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🏨 HotelEase Pro</h3>
            <p>Leading the revolution in hotel management technology with innovative solutions and exceptional service.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <p><Link to="/login" style={{color: '#6c757d', textDecoration: 'none'}}>Login</Link></p>
            <p><Link to="/register" style={{color: '#6c757d', textDecoration: 'none'}}>Register</Link></p>
            <p><a href="#features" style={{color: '#6c757d', textDecoration: 'none'}}>Features</a></p>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: support@hotelease.com</p>
            <p>Phone: +1 (555) 123-HELP</p>
            <p>24/7 Support Available</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 HotelEase Pro. All rights reserved. | Premium Hotel Management Solution</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;