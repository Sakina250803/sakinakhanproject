import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth.js';

import { 
  login, 
  register, 
  getBookingStats, 
  getRooms, 
  getCustomers, 
  getBookings, 
  addRoom, 
  updateRoom, 
  deleteRoom, 
  addCustomer, 
  updateCustomer, 
  deleteCustomer, 
  createBooking, 
  updateBooking, 
  deleteBooking 
} from './api/endpoints.js';
import './index.css';

// Hotel Images for Slider
const hotelImages = {
  hero1: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=600&q=80",
  hero2: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
  hero3: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
  hero4: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
  room1: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80",
  room2: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80",
  room3: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80",
  room4: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80",
  lobby: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80",
  pool: "https://images.unsplash.com/photo-1531685250784-7569952593d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80",
  dining: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80"
};

// Hero slider images array
const heroSlides = [
  {
    image: hotelImages.hero1,
    title: "Welcome to BUNIIVELLA",
    subtitle: "Experience Luxury Redefined"
  },
  {
    image: hotelImages.hero2,
    title: "Luxury Accommodations",
    subtitle: "Your Comfort is Our Priority"
  },
  {
    image: hotelImages.hero3,
    title: "Premium Services",
    subtitle: "Unmatched Hospitality Experience"
  },
  {
    image: hotelImages.hero4,
    title: "Book Your Stay",
    subtitle: "Create Unforgettable Memories"
  }
];

function App() {
  const { user, login: authLogin, logout } = useAuth();
  const [currentView, setCurrentView] = useState('login');
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    bookedRooms: 0,
    totalCustomers: 0,
    totalBookings: 0,
    activeBookings: 0
  });
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [authError, setAuthError] = useState('');

  // Auth Form State
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Demo data with Pakistani touch and rupees
  const demoRooms = [
    { _id: '1', roomNumber: 101, type: 'Deluxe', price: 20000, status: 'Available', image: hotelImages.room1 },
    { _id: '2', roomNumber: 102, type: 'Suite', price: 35000, status: 'Available', image: hotelImages.room2 },
    { _id: '3', roomNumber: 103, type: 'Single', price: 12000, status: 'Available', image: hotelImages.room3 },
    { _id: '4', roomNumber: 104, type: 'Double', price: 18000, status: 'Available', image: hotelImages.room4 },
    { _id: '5', roomNumber: 201, type: 'Deluxe', price: 22000, status: 'Available', image: hotelImages.room1 },
    { _id: '6', roomNumber: 202, type: 'Suite', price: 40000, status: 'Available', image: hotelImages.room2 },
    { _id: '7', roomNumber: 203, type: 'Single', price: 10000, status: 'Available', image: hotelImages.room3 }
  ];
  
  const demoCustomers = [
    { _id: '1', name: 'Ali Khan', contact: 'ali@email.com', address: '123 Main Street, Karachi' },
    { _id: '2', name: 'Fatima Ahmed', contact: 'fatima@email.com', address: '456 Gulberg, Lahore' },
    { _id: '3', name: 'Ahmed Raza', contact: 'ahmed@company.com', address: '789 Clifton, Karachi' },
    { _id: '4', name: 'Sara Malik', contact: 'sara@email.com', address: '321 F-7, Islamabad' }
  ];
  
  const demoBookings = [];

  // Hotel Features Data with Pakistani touch
const hotelFeatures = [
  {
    icon: '🩶',
    title: 'Swimming Pool',
    description: 'Beautiful pool with traditional mosaic designs'
  },
  {
    icon: '🩶',
    title: 'Pakistani Cuisine',
    description: 'Authentic local and continental dining experience'
  },
  {
    icon: '🩶',
    title: 'Spa & Wellness',
    description: 'Traditional Pakistani massage therapies'
  },
  {
    icon: '🩶',
    title: 'Fitness Center',
    description: 'Modern gym with professional trainers'
  },
  {
    icon: '🩶',
    title: 'Free WiFi',
    description: 'High-speed internet throughout the hotel'
  },
  {
    icon: '🩶',
    title: 'Prayer Area',
    description: 'Dedicated space for prayers and meditation'
  }
];
  // Room Types Data with rupees
  const roomTypes = [
    {
      type: 'Single',
      price: '₨12,000',
      description: 'Comfortable single room with modern amenities',
      features: ['1 Single Bed', 'Free WiFi', 'Work Desk', 'AC'],
      image: hotelImages.room3
    },
    {
      type: 'Double',
      price: '₨18,000',
      description: 'Spacious double room perfect for couples',
      features: ['1 Double Bed', 'City View', 'Mini Bar', 'AC'],
      image: hotelImages.room4
    },
    {
      type: 'Deluxe',
      price: '₨22,000',
      description: 'Luxurious deluxe room with premium amenities',
      features: ['King Size Bed', 'Balcony', 'Jacuzzi', 'AC'],
      image: hotelImages.room1
    },
    {
      type: 'Suite',
      price: '₨35,000',
      description: 'Executive suite with separate living area',
      features: ['Separate Living Room', 'Kitchenette', 'Butler Service', 'AC'],
      image: hotelImages.room2
    }
  ];

  // Hero slider auto-rotate
  useEffect(() => {
    if (user && currentView === 'dashboard') {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user, currentView]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
      setCurrentView('dashboard');
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Try to load data from API first
      const [statsRes, roomsRes, customersRes, bookingsRes] = await Promise.all([
        getBookingStats(),
        getRooms(),
        getCustomers(),
        getBookings()
      ]);

      // If API calls succeed, use the data
      if (statsRes?.data?.success) setStats(statsRes.data.stats);
      if (roomsRes?.data?.success) setRooms(roomsRes.data.rooms);
      if (customersRes?.data?.success) setCustomers(customersRes.data.customers);
      if (bookingsRes?.data?.success) setBookings(bookingsRes.data.bookings);
    } catch (error) {
      console.error('Error loading data, using demo data:', error);
      // Use demo data if API fails
      setRooms(demoRooms);
      setCustomers(demoCustomers);
      setBookings(demoBookings);
      updateStatsFromData(demoRooms, demoCustomers, demoBookings);
    } finally {
      setLoading(false);
    }
  };

  const updateStatsFromData = (roomsData, customersData, bookingsData) => {
    setStats({
      totalRooms: roomsData.length,
      availableRooms: roomsData.filter(r => r.status === 'Available').length,
      bookedRooms: roomsData.filter(r => r.status === 'Booked').length,
      totalCustomers: customersData.length,
      totalBookings: bookingsData.length,
      activeBookings: bookingsData.filter(b => b.status === 'Active').length
    });
  };

  const handleAuthChange = (e) => {
    setAuthForm({
      ...authForm,
      [e.target.name]: e.target.value
    });
    setAuthError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login({
        email: authForm.email,
        password: authForm.password
      });
      if (response.data.success) {
        authLogin(response.data.user);
      }
    } catch (error) {
      // Demo mode: Auto-login with demo user
      const demoUser = {
        id: '1',
        name: authForm.email.split('@')[0] || 'Demo User',
        email: authForm.email
      };
      authLogin(demoUser);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (authForm.password !== authForm.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await register({
        name: authForm.name,
        email: authForm.email,
        password: authForm.password
      });
      if (response.data.success) {
        authLogin(response.data.user);
      }
    } catch (error) {
      // Demo mode: Auto-register with demo user
      const demoUser = {
        id: '1',
        name: authForm.name,
        email: authForm.email
      };
      authLogin(demoUser);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      let response;
      
      if (currentView === 'rooms') {
        const roomData = {
          roomNumber: parseInt(formData.roomNumber),
          type: formData.type,
          price: parseInt(formData.price),
          status: formData.status || 'Available'
        };

        if (editingItem) {
          response = await updateRoom(editingItem._id, roomData);
        } else {
          response = await addRoom(roomData);
        }
        
        if (response?.data?.success) {
          loadDashboardData();
        } else {
          throw new Error('Room operation failed');
        }
      } 
      else if (currentView === 'customers') {
        const customerData = {
          name: formData.name,
          contact: formData.contact,
          address: formData.address
        };

        if (editingItem) {
          response = await updateCustomer(editingItem._id, customerData);
        } else {
          response = await addCustomer(customerData);
        }
        
        if (response?.data?.success) {
          loadDashboardData();
        } else {
          throw new Error('Customer operation failed');
        }
      } 
      else if (currentView === 'bookings') {
        if (!formData.roomId || !formData.customerId || !formData.checkIn || !formData.checkOut || !formData.amount) {
          alert('Please fill all booking fields');
          return;
        }

        const bookingData = {
          roomId: formData.roomId,
          customerId: formData.customerId,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          amount: parseInt(formData.amount)
        };

        if (editingItem) {
          response = await updateBooking(editingItem._id, bookingData);
        } else {
          response = await createBooking(bookingData);
        }
        
        if (response?.data?.success) {
          loadDashboardData();
        } else {
          throw new Error('Booking operation failed');
        }
      }
      
      setShowForm(false);
      setFormData({});
      setEditingItem(null);
      
    } catch (error) {
      console.error('Error saving data, using demo save:', error);
      handleDemoSave();
    }
  };

  const handleDemoSave = () => {
    if (currentView === 'rooms') {
      const newRoom = {
        _id: editingItem ? editingItem._id : `room-${Date.now()}`,
        roomNumber: parseInt(formData.roomNumber),
        type: formData.type,
        price: parseInt(formData.price),
        status: formData.status || 'Available'
      };
      
      let updatedRooms;
      if (editingItem) {
        updatedRooms = rooms.map(room => 
          room._id === editingItem._id ? newRoom : room
        );
      } else {
        updatedRooms = [...rooms, newRoom];
      }
      setRooms(updatedRooms);
      updateStatsFromData(updatedRooms, customers, bookings);
    }
    else if (currentView === 'customers') {
      const newCustomer = {
        _id: editingItem ? editingItem._id : `customer-${Date.now()}`,
        name: formData.name,
        contact: formData.contact,
        address: formData.address
      };
      
      let updatedCustomers;
      if (editingItem) {
        updatedCustomers = customers.map(customer => 
          customer._id === editingItem._id ? newCustomer : customer
        );
      } else {
        updatedCustomers = [...customers, newCustomer];
      }
      setCustomers(updatedCustomers);
      updateStatsFromData(rooms, updatedCustomers, bookings);
    }
    else if (currentView === 'bookings') {
      const selectedRoom = rooms.find(r => r._id === formData.roomId);
      const selectedCustomer = customers.find(c => c._id === formData.customerId);
      
      if (!selectedRoom || !selectedCustomer) {
        alert('Please select a valid room and customer');
        return;
      }
      
      const newBooking = {
        _id: editingItem ? editingItem._id : `booking-${Date.now()}`,
        roomId: {
          _id: selectedRoom._id,
          roomNumber: selectedRoom.roomNumber,
          type: selectedRoom.type
        },
        customerId: {
          _id: selectedCustomer._id,
          name: selectedCustomer.name
        },
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        amount: parseInt(formData.amount),
        status: 'Active'
      };
      
      let updatedBookings;
      if (editingItem) {
        updatedBookings = bookings.map(booking => 
          booking._id === editingItem._id ? newBooking : booking
        );
      } else {
        updatedBookings = [...bookings, newBooking];
        
        // Update room status to Booked for new bookings
        const updatedRooms = rooms.map(room => 
          room._id === formData.roomId ? { ...room, status: 'Booked' } : room
        );
        setRooms(updatedRooms);
        updateStatsFromData(updatedRooms, customers, updatedBookings);
      }
      setBookings(updatedBookings);
    }
    
    setShowForm(false);
    setFormData({});
    setEditingItem(null);
  };

  const handleDelete = async (id, deleteFunction, itemType) => {
    if (window.confirm(`Are you sure you want to delete this ${itemType}?`)) {
      try {
        await deleteFunction(id);
        loadDashboardData();
      } catch (error) {
        console.error('Error deleting:', error);
        handleDemoDelete(id, itemType);
      }
    }
  };

  const handleDemoDelete = (id, itemType) => {
    if (itemType === 'room') {
      const updatedRooms = rooms.filter(r => r._id !== id);
      const updatedBookings = bookings.filter(b => b.roomId?._id !== id);
      setRooms(updatedRooms);
      setBookings(updatedBookings);
      updateStatsFromData(updatedRooms, customers, updatedBookings);
    }
    else if (itemType === 'customer') {
      const updatedCustomers = customers.filter(c => c._id !== id);
      const updatedBookings = bookings.filter(b => b.customerId?._id !== id);
      setCustomers(updatedCustomers);
      setBookings(updatedBookings);
      updateStatsFromData(rooms, updatedCustomers, updatedBookings);
    }
    else if (itemType === 'booking') {
      const bookingToDelete = bookings.find(b => b._id === id);
      const updatedBookings = bookings.filter(b => b._id !== id);
      
      if (bookingToDelete) {
        const updatedRooms = rooms.map(room => 
          room._id === bookingToDelete.roomId?._id ? { ...room, status: 'Available' } : room
        );
        setRooms(updatedRooms);
        updateStatsFromData(updatedRooms, customers, updatedBookings);
      }
      setBookings(updatedBookings);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentView('login');
    setAuthForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const getAvailableRooms = () => {
    return rooms.filter(room => room.status === 'Available');
  };

  const openForm = (item = null) => {
    setEditingItem(item);
    
    if (item) {
      let formDataToSet = { ...item };
      
      if (currentView === 'bookings' && item) {
        formDataToSet.roomId = item.roomId?._id || item.roomId;
        formDataToSet.customerId = item.customerId?._id || item.customerId;
        
        if (item.checkIn) {
          formDataToSet.checkIn = item.checkIn.split('T')[0];
        }
        if (item.checkOut) {
          formDataToSet.checkOut = item.checkOut.split('T')[0];
        }
      }
      
      setFormData(formDataToSet);
    } else {
      setFormData({});
    }
    
    setShowForm(true);
  };

  // Format price in Pakistani rupees
  const formatPrice = (price) => {
    return `₨${price?.toLocaleString() || '0'}`;
  };

  // Render different views based on current state
  if (!user) {
    return (
      <div className="app">
        <div className="auth-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>

        <div className="auth-container">
          {currentView === 'login' && (
            <div className="auth-card slide-in">
              <div className="auth-header">
                <div className="logo">
                  <span className="logo-icon">SK</span>
                  <span className="logo-text">BUNIVELLA</span>
                </div>
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to your hotel management dashboard</p>
              </div>
              
              <form onSubmit={handleLogin} className="auth-form">
                {authError && (
                  <div className="error-message">
                    <span className="error-icon">!</span>
                    {authError}
                  </div>
                )}
                
                <div className="form-group">
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email Address"
                    value={authForm.email}
                    onChange={handleAuthChange}
                    className="form-input"
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    value={authForm.password}
                    onChange={handleAuthChange}
                    className="form-input"
                    disabled={loading}
                  />
                </div>

                <button type="submit" disabled={loading} className="auth-button">
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <div className="auth-footer">
                  <p>
                    Don't have an account?{' '}
                    <button 
                      type="button" 
                      className="auth-link"
                      onClick={() => setCurrentView('register')}
                    >
                      Create one here
                    </button>
                  </p>
                </div>

                
              </form>
            </div>
          )}

          {currentView === 'register' && (
            <div className="auth-card slide-in">
              <div className="auth-header">
                <div className="logo">
                  <span className="logo-icon">SK</span>
                  <span className="logo-text">BUNIVELLA</span>
                </div>
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join our hotel management platform</p>
              </div>
              
              <form onSubmit={handleRegister} className="auth-form">
                {authError && (
                  <div className="error-message">
                    <span className="error-icon">!</span>
                    {authError}
                  </div>
                )}
                
                <div className="form-group">
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Full Name"
                    value={authForm.name}
                    onChange={handleAuthChange}
                    className="form-input"
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email Address"
                    value={authForm.email}
                    onChange={handleAuthChange}
                    className="form-input"
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    value={authForm.password}
                    onChange={handleAuthChange}
                    className="form-input"
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Confirm Password"
                    value={authForm.confirmPassword}
                    onChange={handleAuthChange}
                    className="form-input"
                    disabled={loading}
                  />
                </div>

                <button type="submit" disabled={loading} className="auth-button">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="auth-footer">
                  <p>
                    Already have an account?{' '}
                    <button 
                      type="button" 
                      className="auth-link"
                      onClick={() => setCurrentView('login')}
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="logo-icon">SK</span>
            <span className="logo-text">BUNIVELLA</span>
          </div>
          <div className="nav-menu">
            <button 
              className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-link ${currentView === 'rooms' ? 'active' : ''}`}
              onClick={() => setCurrentView('rooms')}
            >
              Rooms
            </button>
            <button 
              className={`nav-link ${currentView === 'customers' ? 'active' : ''}`}
              onClick={() => setCurrentView('customers')}
            >
              Customers
            </button>
            <button 
              className={`nav-link ${currentView === 'bookings' ? 'active' : ''}`}
              onClick={() => setCurrentView('bookings')}
            >
              Bookings
            </button>
            <div className="user-info">
              <span> {user.name}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {loading && (
          <div className="global-loading">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        )}
        
        {currentView === 'dashboard' && (
          <div className="dashboard-view">
            {/* Hero Section with Slider */}
            <section className="hero-section">
              <div className="hero-background">
                <img 
                  src={heroSlides[currentSlide].image} 
                  alt="Hotel" 
                  className="hero-image" 
                />
                <div className="hero-overlay"></div>
                <div className="hero-content">
                  <h1 className="hero-title">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <p className="hero-subtitle">{heroSlides[currentSlide].subtitle}</p>
                  
                  {/* Slider Indicators */}
                  <div className="slider-indicators">
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        className={`slider-indicator ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </div>

                  <div className="quick-stats">
                    <div className="stat-card">
                      <div className="stat-icon">🏨</div>
                      <div className="stat-content">
                        <div className="stat-number">{stats.totalRooms || 0}</div>
                        <div className="stat-label">Total Rooms</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">✅</div>
                      <div className="stat-content">
                        <div className="stat-number">{stats.availableRooms || 0}</div>
                        <div className="stat-label">Available</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">👥</div>
                      <div className="stat-content">
                        <div className="stat-number">{stats.totalCustomers || 0}</div>
                        <div className="stat-label">Customers</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">📅</div>
                      <div className="stat-content">
                        <div className="stat-number">{stats.activeBookings || 0}</div>
                        <div className="stat-label">Active Bookings</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="dashboard-section">
              <h2 className="section-title">Quick Actions</h2>
              <div className="actions-grid">
                <button className="action-btn primary" onClick={() => { setCurrentView('rooms'); openForm(); }}>
                  <span className="action-icon">➕</span>
                  Add Room
                </button>
                <button className="action-btn secondary" onClick={() => setCurrentView('bookings')}>
                  <span className="action-icon">📊</span>
                  View Bookings
                </button>
                <button className="action-btn secondary" onClick={() => { setCurrentView('customers'); openForm(); }}>
                  <span className="action-icon">👤</span>
                  Add Customer
                </button>
                <button className="action-btn primary" onClick={() => { setCurrentView('bookings'); openForm(); }}>
                  <span className="action-icon">📅</span>
                  Create Booking
                </button>
              </div>
            </section>

            {/* Hotel Features */}
            <section className="dashboard-section">
              <h2 className="section-title">Hotel Amenities</h2>
              <div className="features-grid">
                {hotelFeatures.map((feature, index) => (
                  <div key={index} className="feature-card">
                    <div className="feature-icon">{feature.icon}</div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Room Types */}
            <section className="dashboard-section">
              <h2 className="section-title">Our Room Types</h2>
              <div className="rooms-grid">
                {roomTypes.map((room, index) => (
                  <div key={index} className="room-card">
                    <div className="room-image">
                      <img src={room.image} alt={room.type} />
                      <div className="room-price">{room.price}/night</div>
                    </div>
                    <div className="room-content">
                      <h3 className="room-type">{room.type} Room</h3>
                      <p className="room-description">{room.description}</p>
                      <ul className="room-features">
                        {room.features.map((feature, idx) => (
                          <li key={idx}>✓ {feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {currentView === 'rooms' && (
          <div className="management-view">
            <div className="view-header">
              <h2 className="view-title">Room Management</h2>
              <div className="view-actions">
                <button className="add-btn" onClick={() => openForm()}>
                  + Add Room
                </button>
              </div>
            </div>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Room No</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room._id}>
                      <td>{room.roomNumber}</td>
                      <td>{room.type}</td>
                      <td>{formatPrice(room.price)}</td>
                      <td>
                        <span className={`status-badge ${room.status.toLowerCase()}`}>
                          {room.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="edit-btn"
                            onClick={() => openForm(room)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDelete(room._id, deleteRoom, 'room')}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentView === 'customers' && (
          <div className="management-view">
            <div className="view-header">
              <h2 className="view-title">Customer Management</h2>
              <div className="view-actions">
                <button className="add-btn" onClick={() => openForm()}>
                  + Add Customer
                </button>
              </div>
            </div>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(customer => (
                    <tr key={customer._id}>
                      <td>{customer.name}</td>
                      <td>{customer.contact}</td>
                      <td>{customer.address}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="edit-btn"
                            onClick={() => openForm(customer)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDelete(customer._id, deleteCustomer, 'customer')}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentView === 'bookings' && (
          <div className="management-view">
            <div className="view-header">
              <h2 className="view-title">Booking Management</h2>
              <div className="view-actions">
                <button className="add-btn" onClick={() => openForm()}>
                  + Create Booking
                </button>
              </div>
            </div>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Customer</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>Room {booking.roomId?.roomNumber}</td>
                      <td>{booking.customerId?.name}</td>
                      <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                      <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                      <td>{formatPrice(booking.amount)}</td>
                      <td>
                        <span className={`status-badge ${booking.status?.toLowerCase() || 'active'}`}>
                          {booking.status || 'Active'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="edit-btn"
                            onClick={() => openForm(booking)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDelete(booking._id, deleteBooking, 'booking')}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal Forms */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingItem ? 'Edit' : 'Add New'} 
                {currentView === 'rooms' && ' Room'}
                {currentView === 'customers' && ' Customer'}
                {currentView === 'bookings' && ' Booking'}
              </h3>
              <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            </div>
            
            <div className="modal-body">
              {currentView === 'rooms' && (
                <div className="form-grid">
                  <div className="form-group">
                    <input type="number" name="roomNumber" placeholder="Room Number" value={formData.roomNumber || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <select name="type" value={formData.type || ''} onChange={handleFormChange}>
                      <option value="">Select Type</option>
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Suite">Suite</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <input type="number" name="price" placeholder="Price in Rupees" value={formData.price || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <select name="status" value={formData.status || ''} onChange={handleFormChange}>
                      <option value="Available">Available</option>
                      <option value="Booked">Booked</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
              )}

              {currentView === 'customers' && (
                <div className="form-grid">
                  <div className="form-group">
                    <input type="text" name="name" placeholder="Full Name" value={formData.name || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <input type="text" name="contact" placeholder="Contact" value={formData.contact || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <textarea name="address" placeholder="Address" value={formData.address || ''} onChange={handleFormChange} rows="3"></textarea>
                  </div>
                </div>
              )}

              {currentView === 'bookings' && (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Select Room:</label>
                    <select name="roomId" value={formData.roomId || ''} onChange={handleFormChange}>
                      <option value="">Choose a room...</option>
                      {getAvailableRooms().map(room => (
                        <option key={room._id} value={room._id}>
                          Room {room.roomNumber} - {room.type} ({formatPrice(room.price)}/night)
                        </option>
                      ))}
                    </select>
                    {getAvailableRooms().length === 0 && (
                      <p style={{color: 'red', fontSize: '14px', marginTop: '5px'}}>
                        No available rooms. Please add rooms first.
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Select Customer:</label>
                    <select name="customerId" value={formData.customerId || ''} onChange={handleFormChange}>
                      <option value="">Choose a customer...</option>
                      {customers.map(customer => (
                        <option key={customer._id} value={customer._id}>
                          {customer.name} ({customer.contact})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Check-in Date:</label>
                    <input type="date" name="checkIn" value={formData.checkIn || ''} onChange={handleFormChange} />
                  </div>

                  <div className="form-group">
                    <label>Check-out Date:</label>
                    <input type="date" name="checkOut" value={formData.checkOut || ''} onChange={handleFormChange} />
                  </div>

                  <div className="form-group">
                    <label>Total Amount (Rupees):</label>
                    <input type="number" name="amount" placeholder="Enter amount" value={formData.amount || ''} onChange={handleFormChange} />
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="save-btn" onClick={handleSave}>
                {editingItem ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">SK</span>
              <span className="logo-text">BUNIVELLA</span>
            </div>
            <p className="footer-description">
              Professional hotel management solution for modern hospitality businesses in Pakistan. 
              Streamline your operations with our comprehensive platform.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">f</a>
              <a href="#" className="social-link">t</a>
              <a href="#" className="social-link">in</a>
              <a href="#" className="social-link">ig</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#dashboard" onClick={() => setCurrentView('dashboard')}>Dashboard</a></li>
              <li><a href="#rooms" onClick={() => setCurrentView('rooms')}>Room Management</a></li>
              <li><a href="#customers" onClick={() => setCurrentView('customers')}>Customer Management</a></li>
              <li><a href="#bookings" onClick={() => setCurrentView('bookings')}>Booking Management</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Contact Info</h3>
            <div className="contact-info">
              <p>📧 support@buniivella.com</p>
              <p>📞 +92 (300) 123-4567</p>
              <p>🏢 BADIN GOLARCHI</p>
              <p>🌐 www.bunivella.com</p>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Features</h3>
            <ul className="footer-links">
              <li><a href="#analytics">Real-time Analytics</a></li>
              <li><a href="#booking">Secure Booking System</a></li>
              <li><a href="#management">Efficient Management</a></li>
              <li><a href="#support">24/7 Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 BUNIVELLA. All rights reserved. | Built with LOVE for Pakistani hospitality industry</p>
        </div>
      </footer>
    </div>
  );
}

export default App;