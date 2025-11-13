import React, { useState, useEffect } from 'react';
import { getBookings, createBooking, updateBooking, deleteBooking } from '../api/endpoints';
import { getRooms } from '../api/endpoints';
import { getCustomers } from '../api/endpoints';
import BookingForm from '../components/BookingForm';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, roomsRes, customersRes] = await Promise.all([
        getBookings(),
        getRooms(),
        getCustomers()
      ]);

      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.bookings);
      }
      if (roomsRes.data.success) {
        setRooms(roomsRes.data.rooms);
      }
      if (customersRes.data.success) {
        setCustomers(customersRes.data.customers);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (bookingData) => {
    try {
      const response = await createBooking(bookingData);
      if (response.data.success) {
        setBookings([response.data.booking, ...bookings]);
        setShowForm(false);
        // Refresh rooms to update availability
        const roomsRes = await getRooms();
        if (roomsRes.data.success) {
          setRooms(roomsRes.data.rooms);
        }
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handleUpdateBooking = async (bookingData) => {
    try {
      const response = await updateBooking(editingBooking._id, bookingData);
      if (response.data.success) {
        setBookings(bookings.map(booking => 
          booking._id === editingBooking._id ? response.data.booking : booking
        ));
        setShowForm(false);
        setEditingBooking(null);
        // Refresh rooms to update availability
        const roomsRes = await getRooms();
        if (roomsRes.data.success) {
          setRooms(roomsRes.data.rooms);
        }
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await deleteBooking(id);
        if (response.data.success) {
          setBookings(bookings.filter(booking => booking._id !== id));
          // Refresh rooms to update availability
          const roomsRes = await getRooms();
          if (roomsRes.data.success) {
            setRooms(roomsRes.data.rooms);
          }
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Booking Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Create Booking
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Room {booking.roomId?.roomNumber} - {booking.roomId?.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.customerId?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.checkIn).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.checkOut).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${booking.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setEditingBooking(booking);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBooking(booking._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <BookingForm
          booking={editingBooking}
          rooms={rooms}
          customers={customers}
          onSubmit={editingBooking ? handleUpdateBooking : handleCreateBooking}
          onCancel={() => {
            setShowForm(false);
            setEditingBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default Bookings;