const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Sign-up logic
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User signed up successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error signing up', error });
  }
};

// Updated Login logic
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' }); // Incorrect password
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' }); // No user found with that email
    }
  } catch (error) {
    res.status(400).json({ message: 'Error logging in', error });
  }
};
