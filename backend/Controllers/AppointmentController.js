const Appointment = require('../Models/Appointment');
const Business = require('../Models/Business');

// Create Appointment (Customer books with business name)
const createAppointment = async (req, res) => {
  try {
    const { businessName, date, time} = req.body;

    // Find the business and populate the owner's name
    const business = await Business.findOne({ name: businessName }).populate('owner', 'name');
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const existingAppointment = await Appointment.findOne({
      business: business._id,
      date,
      time,
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }
    const userID=req.user.id;
    const name=req.user.name;
    
    const newAppointment = new Appointment({
      customer: userID, 
      name, // Assuming req.user contains customer info
      business: business._id,
      owner: business.owner.name, 
      businessName: business.name,
      date,
      time,
    });

    await newAppointment.save();

    res.status(201).json({ message: 'Appointment booked', appointment: newAppointment });
  } catch (error) {
    console.error('Create Appointment Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get Appointments for Logged In User (Customer or Business Owner)
const getAppointments = async (req, res) => {
  try {
    let appointments;
    const userID=req.user.id;
    if (req.user.roles.includes('customer')) {
      appointments = await Appointment.find({ customer: userID })
        .populate('business', 'name email');
    } else if (req.user.roles.includes('business_owner')) {
      appointments = await Appointment.find({ business: req.user.id })
        .populate('customer', 'name email');
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Get Appointments Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Appointment (Customer can reschedule)
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, service } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only the customer who booked can update
    if (appointment.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to update this appointment' });
    }

    // If either date or time is being changed, check for conflicts
    if ((date && date !== appointment.date.toISOString().split('T')[0]) ||
        (time && time !== appointment.time)) {
      
      const conflict = await Appointment.findOne({
        _id: { $ne: id }, // Exclude the current appointment
        business: appointment.business,
        date: date || appointment.date,
        time: time || appointment.time
      });

      if (conflict) {
        return res.status(400).json({ message: 'Selected time slot is already booked' });
      }
    }

    // Update fields
    appointment.date = date || appointment.date;
    appointment.time = time || appointment.time;
    appointment.service = service || appointment.service;

    await appointment.save();

    res.status(200).json({ message: 'Appointment updated', appointment });
  } catch (error) {
    console.error('Update Appointment Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Delete Appointment (Customer can cancel)
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to delete this appointment' });
    }

    await Appointment.findByIdAndDelete(id);

    res.status(200).json({ message: 'Appointment cancelled' });
  } catch (error) {
    console.error('Delete Appointment Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
};
