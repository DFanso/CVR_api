import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import reservationRoutes from './routes/reservationRoutes';
import availabilityRoutes from './routes/availabilityRoutes';

const app = express();
const port = 3000;

require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI!, { retryWrites: true, w: "majority" })
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.log("Error connecting to MongoDB:", error));

// Middleware
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/availability', availabilityRoutes);



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
