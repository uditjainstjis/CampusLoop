// In-memory storage for bookings
let bookings = [];

export default function handler(req, res) {
  // Only allow POST requests for creating bookings
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { mentorId, name, email, date, time, topic } = req.body;

    // Basic validation
    if (!mentorId || !name || !email || !date || !time || !topic) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Create the booking
    const newBooking = {
      id: `booking_${Date.now()}`,
      mentorId,
      name,
      email,
      date,
      time,
      topic,
      createdAt: new Date().toISOString(),
      status: 'pending' // initial status
    };

    // Add to our in-memory store
    bookings.push(newBooking);

    // Return success response
    res.status(201).json({ 
      message: 'Booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
