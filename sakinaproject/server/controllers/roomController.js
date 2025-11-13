import Room from '../models/Room.js';

// Get all rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Add new room
export const addRoom = async (req, res) => {
  try {
    const { roomNumber, type, price, status } = req.body;

    const room = await Room.create({
      roomNumber,
      type,
      price,
      status: status || 'Available'
    });

    res.status(201).json({ success: true, message: 'Room added successfully', room });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Room number already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update room
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.json({ success: true, message: 'Room updated successfully', room });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete room
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndDelete(id);
    
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};