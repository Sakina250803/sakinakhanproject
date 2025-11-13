import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import Customer from '../models/Customer.js';

// Get all bookings with populated room and customer details
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('roomId', 'roomNumber type price status')
      .populate('customerId', 'name contact address')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get single booking
export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate('roomId', 'roomNumber type price status')
      .populate('customerId', 'name contact address');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const { roomId, customerId, checkIn, checkOut, amount } = req.body;

    // Check if room exists and is available
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (room.status !== 'Available') {
      return res.status(400).json({ success: false, message: 'Room is not available' });
    }

    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Check for booking conflicts
    const existingBooking = await Booking.findOne({
      roomId,
      status: 'Active',
      $or: [
        { checkIn: { $lte: new Date(checkOut) }, checkOut: { $gte: new Date(checkIn) } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: 'Room is already booked for the selected dates' 
      });
    }

    // Create booking
    const booking = await Booking.create({
      roomId,
      customerId,
      checkIn,
      checkOut,
      amount,
      status: 'Active'
    });

    // Update room status to Booked
    await Room.findByIdAndUpdate(roomId, { status: 'Booked' });

    // Populate the new booking with room and customer details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('roomId', 'roomNumber type price status')
      .populate('customerId', 'name contact address');

    res.status(201).json({ 
      success: true, 
      message: 'Booking created successfully', 
      booking: populatedBooking 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId, customerId, checkIn, checkOut, amount, status } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // If room is being changed or booking is completed/cancelled
    if (roomId && roomId !== booking.roomId.toString()) {
      // Free up the old room
      await Room.findByIdAndUpdate(booking.roomId, { status: 'Available' });

      // Check if new room is available
      const newRoom = await Room.findById(roomId);
      if (!newRoom) {
        return res.status(404).json({ success: false, message: 'New room not found' });
      }

      if (newRoom.status !== 'Available' && status !== 'Cancelled') {
        return res.status(400).json({ success: false, message: 'New room is not available' });
      }

      // Book the new room
      if (status !== 'Cancelled') {
        await Room.findByIdAndUpdate(roomId, { status: 'Booked' });
      }
    }

    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { roomId, customerId, checkIn, checkOut, amount, status },
      { new: true }
    ).populate('roomId', 'roomNumber type price status')
     .populate('customerId', 'name contact address');

    // Update room status based on booking status
    if (status === 'Completed' || status === 'Cancelled') {
      await Room.findByIdAndUpdate(updatedBooking.roomId, { status: 'Available' });
    }

    res.json({ 
      success: true, 
      message: 'Booking updated successfully', 
      booking: updatedBooking 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Free up the room when booking is deleted
    await Room.findByIdAndUpdate(booking.roomId, { status: 'Available' });

    await Booking.findByIdAndDelete(id);

    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'Available' });
    const bookedRooms = await Room.countDocuments({ status: 'Booked' });
    const totalCustomers = await Customer.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'Active' });

    res.json({
      success: true,
      stats: {
        totalRooms,
        availableRooms,
        bookedRooms,
        totalCustomers,
        totalBookings,
        activeBookings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};