const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const fixPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'admin@stackadda.com' });
    if (user) {
      user.password = 'admin123';
      await user.save(); // This will trigger the pre-save hook and hash it correctly
      console.log('Password fixed and hashed successfully!');
    } else {
      console.log('User not found');
    }
    process.exit();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

fixPassword();
