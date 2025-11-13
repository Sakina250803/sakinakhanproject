import React, { useState, useEffect } from 'react';

const BookingForm = ({ booking, rooms, customers, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    roomId: '',
    customerId: '',
    checkIn: '',
    checkOut: '',
    amount: ''
  });

  useEffect(() => {
    if (booking) {
      setFormData({
        roomId: booking.roomId?._id || booking.roomId,
        customerId: booking.customerId?._id || booking.customerId,
        checkIn: booking.checkIn.split('T')[0],
        checkOut: booking.checkOut.split('T')[0],
        amount: booking.amount
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const availableRooms = rooms.filter(room => room.status === 'Available');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {booking ? 'Edit Booking' : 'Create New Booking'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Room</label>
            <select
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a room</option>
              {availableRooms.map(room => (
                <option key={room._id} value={room._id}>
                  Room {room.roomNumber} - {room.type} (${room.price})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <select
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a customer</option>
              {customers.map(customer => (
                <option key={customer._id} value={customer._id}>
                  {customer.name} - {customer.contact}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {booking ? 'Update' : 'Create'} Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;