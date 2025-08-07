const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// نموذج مستخدم مؤقت
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String
});

const User = mongoose.model('User', UserSchema);

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jsb_medjez_amar')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // إنشاء مستخدم مسؤول
    const adminData = {
      username: 'admin',
      email: 'admin@jsb-medjez-amar.dz',
      role: 'admin'
    };
    
    // تشفير كلمة المرور
    bcrypt.hash('jsb2024', 10, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        process.exit(1);
      }
      
      adminData.password = hash;
      
      // حفظ المستخدم
      User.create(adminData)
        .then(() => {
          console.log('Admin user created successfully');
          process.exit(0);
        })
        .catch(err => {
          console.error('Error creating admin user:', err);
          process.exit(1);
        });
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
