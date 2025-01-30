// scripts/createAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UserModel from '../models/users.js';
import dotenv from 'dotenv';
dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI);
    console.log('Connected to MongoDB');

    const adminData = {
      name: 'Admin',
      email: 'admin@ycme.com',
      password: await bcrypt.hash('admin123', 12),
      isAdmin: true
    };

    // Check if admin already exists
    const existingAdmin = await UserModel.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    // Create new admin
    const admin = new UserModel(adminData);
    await admin.save();
    console.log('Admin created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();