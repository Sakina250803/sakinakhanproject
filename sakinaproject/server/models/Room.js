import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Single', 'Double', 'Deluxe', 'Suite']
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Available',
    enum: ['Available', 'Booked', 'Maintenance']
  }
}, {
  timestamps: true
});

export default mongoose.model('Room', roomSchema);