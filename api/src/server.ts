// Installed Utils
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// App Utils
import mongoDB from './configuration/db';
import authRoute from './routes/authRoutes';
import userRoute from './routes/userRoutes';

// Express App
const app = express();

// Default Port
const port = 5000

// Cors Configuration
app.use(cors({
  origin: process.env.WEBSITE_URL,
  optionsSuccessStatus: 200,
}));

// Connect to MongoDB
mongoDB();

// Allow JSON parameters
app.use(express.json());

// Set Routes for auth
app.use('/api/auth', authRoute);

// Set Routes for user
app.use('/api/user', userRoute);

// Run Express Server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})