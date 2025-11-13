import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route imports
import userRoutes from './routes/userRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/bookings', bookingRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: '🏨 HotelEase API is running...' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});