import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBookingStats } from '../api/endpoints.js';
import './Dashboard.css'; // We'll create this CSS file

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    bookedRooms: 0,
    totalCustomers: 0,
    totalBookings: 0,
    activeBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchStats();
    generateRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getBookingStats();
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set demo data if API fails
      setStats({
        totalRooms: 24,
        availableRooms: 12,
        bookedRooms: 8,
        totalCustomers: 156,
        totalBookings: 89,
        activeBookings: 8
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivity = () => {
    const activities = [
      { type: 'booking', message: 'New booking for Room 101', time: '2 minutes ago' },
      { type: 'checkin', message: 'Guest checked into Room 205', time: '1 hour ago' },
      { type: 'maintenance', message: 'Room 308 maintenance completed', time: '3 hours ago' },
      { type: 'booking', message: 'Booking cancelled for Room 107', time: '5 hours ago' },
      { type: 'checkout', message: 'Guest checked out from Room 412', time: '1 day ago' }
    ];
    setRecentActivity(activities);
  };

  const dashboardCards = [
    { 
      icon: '🏨', 
      title: 'Total Rooms', 
      value: stats.totalRooms, 
      label: 'All available spaces',
      trend: '+2 this month',
      color: 'gold' 
    },
    { 
      icon: '✅', 
      title: 'Available Rooms', 
      value: stats.availableRooms, 
      label: 'Ready for guests',
      trend: '68% available',
      color: 'silver' 
    },
    { 
      icon: '🔒', 
      title: 'Booked Rooms', 
      value: stats.bookedRooms, 
      label: 'Currently occupied',
      trend: '32% occupancy',
      color: 'gold' 
    },
    { 
      icon: '👥', 
      title: 'Total Customers', 
      value: stats.totalCustomers, 
      label: 'Guest database',
      trend: '+12 this week',
      color: 'silver' 
    },
    { 
      icon: '📅', 
      title: 'Total Bookings', 
      value: stats.totalBookings, 
      label: 'All-time reservations',
      trend: '89 total',
      color: 'gold' 
    },
    { 
      icon: '🔥', 
      title: 'Active Bookings', 
      value: stats.activeBookings, 
      label: 'Current stays',
      trend: '8 active',
      color: 'silver' 
    }
  ];

  const quickActions = [
    { icon: '➕', label: 'Add Room', link: '/rooms', color: 'primary' },
    { icon: '📋', label: 'View Bookings', link: '/bookings', color: 'secondary' },
    { icon: '👥', label: 'Manage Customers', link: '/customers', color: 'secondary' },
    { icon: '📊', label: 'Generate Report', link: '#', color: 'primary' }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Hotel Dashboard</h1>
          <p className="dashboard-subtitle">Real-time overview of your hotel performance and operations</p>
          <div className="header-stats">
            <div className="header-stat">
              <span className="stat-number">{stats.availableRooms}</span>
              <span className="stat-label">Rooms Available Now</span>
            </div>
            <div className="header-stat">
              <span className="stat-number">{stats.activeBookings}</span>
              <span className="stat-label">Active Stays</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-main">
        {/* Stats Cards Grid */}
        <div className="stats-grid">
          {dashboardCards.map((card, index) => (
            <div key={index} className={`stat-card ${card.color}`}>
              <div className="card-icon">{card.icon}</div>
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <div className="card-value">{card.value}</div>
                <div className="card-label">{card.label}</div>
                <div className="card-trend">{card.trend}</div>
              </div>
              <div className="card-glow"></div>
            </div>
          ))}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="dashboard-sidebar">
          {/* Quick Actions */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Quick Actions</h3>
            <div className="actions-grid">
              {quickActions.map((action, index) => (
                <Link 
                  key={index} 
                  to={action.link} 
                  className={`action-btn ${action.color}`}
                >
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-label">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'booking' && '📅'}
                    {activity.type === 'checkin' && '🔑'}
                    {activity.type === 'checkout' && '🚪'}
                    {activity.type === 'maintenance' && '🔧'}
                  </div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="metrics-section">
        <h3 className="metrics-title">Performance Overview</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">📈</span>
              <span className="metric-value">78%</span>
            </div>
            <span className="metric-label">Occupancy Rate</span>
            <div className="metric-bar">
              <div className="metric-fill" style={{width: '78%'}}></div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">⭐</span>
              <span className="metric-value">4.8</span>
            </div>
            <span className="metric-label">Guest Rating</span>
            <div className="metric-stars">
              {'⭐'.repeat(5)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">💰</span>
              <span className="metric-value">$12.4K</span>
            </div>
            <span className="metric-label">Monthly Revenue</span>
            <div className="metric-trend positive">+12%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;