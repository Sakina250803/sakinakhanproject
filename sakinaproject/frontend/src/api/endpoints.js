import API from './api.js';

// Auth endpoints
export const register = (userData) => API.post('/users/register', userData);
export const login = (userData) => API.post('/users/login', userData);

// Room endpoints
export const getRooms = () => API.get('/rooms');
export const addRoom = (roomData) => API.post('/rooms', roomData);
export const updateRoom = (id, roomData) => API.put(`/rooms/${id}`, roomData);
export const deleteRoom = (id) => API.delete(`/rooms/${id}`);

// Customer endpoints
export const getCustomers = () => API.get('/customers');
export const addCustomer = (customerData) => API.post('/customers', customerData);
export const updateCustomer = (id, customerData) => API.put(`/customers/${id}`, customerData);
export const deleteCustomer = (id) => API.delete(`/customers/${id}`);

// Booking endpoints
export const getBookings = () => API.get('/bookings');
export const getBookingStats = () => API.get('/bookings/stats');
export const createBooking = (bookingData) => API.post('/bookings', bookingData);
export const updateBooking = (id, bookingData) => API.put(`/bookings/${id}`, bookingData);
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);