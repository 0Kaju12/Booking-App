const express = require('express');
const Booking = require('../models/Booking');
const Court = require('../models/Court');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('-');
  return new Date(`${year}-${month}-${day}`); 
};

router.post('/book', verifyToken, async (req, res) => {
  const { court_id, slot, date } = req.body;
  console.log("HERE: " + court_id + slot + date);
  try {
    if (!court_id) {
      return res.status(400).json({ message: 'Court ID is required' });
    }

    if (!date || !slot) {
      return res.status(400).json({ message: 'Date and Slot are required' });
    }

    // Use the updated parseDate function here.
    const parsedDate = parseDate(date);

    const court = await Court.findById(court_id);

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    if (!court.slots.includes(slot)) {
      return res.status(400).json({ message: `Slot ${slot} is not available for this court` });
    }

    const existingBooking = await Booking.findOne({ court_id, slot, date: parsedDate });
    if (existingBooking) {
      return res.status(400).json({ message: 'This slot is already booked for the given date' });
    }

    const booking = new Booking({
      court_id,
      slot,
      date: parsedDate,  
      user_id: req.user._id, 
    });

    await booking.save();
    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    console.error('Booking error:', error);  
    res.status(500).json({ error: 'Failed to book slot', details: error.message });
  }
});


module.exports = router;
