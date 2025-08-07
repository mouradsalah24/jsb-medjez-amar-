const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, profile } = req.body;
    
    // التحقق من وجود المستخدم مسبقاً
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'المستخدم موجود بالفعل' });
    }
    
    // إنشاء مستخدم جديد
    const user = new User({ username, email, password, profile });
    await user.save();
    
    // إنشاء توكن JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // البحث عن المستخدم
    const user = await User.findOne({ $or: [{ email: username }, { username }] });
    if (!user) {
      return res.status(400).json({ message: 'بيانات الاعتماد غير صحيحة' });
    }
    
    // التحقق من كلمة المرور
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'بيانات الاعتماد غير صحيحة' });
    }
    
    // تحديث آخر تسجيل دخول
    user.lastLogin = new Date();
    await user.save();
    
    // إنشاء توكن JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
});

// الحصول على بيانات المستخدم الحالي
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
});

module.exports = router;
