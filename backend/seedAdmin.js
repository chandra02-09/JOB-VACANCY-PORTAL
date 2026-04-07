require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-job-portal';

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Check if admin already exists
    const existing = await usersCollection.findOne({ email: 'admin@aijobportal.com' });
    if (existing) {
      console.log('');
      console.log('⚠️  Admin account already exists! Use these credentials:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('   Email   : admin@aijobportal.com');
      console.log('   Password: Admin@123');
      console.log('   Role    : admin');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      await mongoose.disconnect();
      return;
    }

    // Hash password manually (bypass pre-save hook issue)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    await usersCollection.insertOne({
      name: 'Portal Admin',
      email: 'admin@aijobportal.com',
      password: hashedPassword,
      role: 'admin',
      skills: [],
      resumeUrl: '',
      portfolioUrl: '',
      experience: '',
      education: [],
      savedJobs: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('');
    console.log('✅ Admin account created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Email   : admin@aijobportal.com');
    console.log('   Password: Admin@123');
    console.log('   Role    : admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👉 Go to http://localhost:3000/login and sign in!');
    console.log('');
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
