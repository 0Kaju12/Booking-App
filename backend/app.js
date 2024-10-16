const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors'); 
const authRoutes = require('./routes/auth')
const bookingRoutes = require('./routes/booking');
const managerRoutes = require('./routes/manager')


dotenv.config();

const app = express();
app.use(cors())
app.use(bodyParser.json());


app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/manager', managerRoutes);



// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));