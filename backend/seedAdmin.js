require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stackadda";

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected for Seeding");
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@stackadda.com' });
    
    if (existingAdmin) {
      console.log("Admin account already exists!");
      console.log("Email: admin@stackadda.com");
      console.log("Password: admin123");
      process.exit();
    }

    // Create Admin User
    const adminUser = await User.create({
      name: "Super Admin",
      email: "admin@stackadda.com",
      password: "admin123",
      role: "admin"
    });

    console.log("SUCCESS! Admin Account Created!");
    console.log("===============================");
    console.log("Email: admin@stackadda.com");
    console.log("Password: admin123");
    console.log("===============================");
    
    process.exit();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });
