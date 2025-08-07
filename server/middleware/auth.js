const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // الحصول على التوكن من الهيدر
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'غير مصرح، التوكن مطلوب' });
    }
    
    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // الحصول على المستخدم
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'غير مصرح، المستخدم غير موجود أو غير نشط' });
    }
    
    // إضافة المستخدم إلى الطلب
    req.user = {
      userId: user._id,
      role: user.role
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'غير مصرح، التوكن غير صالح' });
  }
};
