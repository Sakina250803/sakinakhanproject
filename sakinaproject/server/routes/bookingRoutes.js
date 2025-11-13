import express from 'express';
import { 
  getBookings, 
  getBooking, 
  createBooking, 
  updateBooking, 
  deleteBooking,
  getDashboardStats 
} from '../controllers/bookingController.js';

const router = express.Router();

// GET /api/bookings - Get all bookings with room and customer details
router.get('/', getBookings);

// GET /api/bookings/stats - Get dashboard statistics
router.get('/stats', getDashboardStats);

// GET /api/bookings/:id - Get single booking
router.get('/:id', getBooking);

// POST /api/bookings - Create new booking
router.post('/', createBooking);

// PUT /api/bookings/:id - Update booking
router.put('/:id', updateBooking);

// DELETE /api/bookings/:id - Delete booking
router.delete('/:id', deleteBooking);

export default router;