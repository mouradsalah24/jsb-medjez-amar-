const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// استيراد المسارات
const authRoutes = require('./routes/auth');
const matchesRoutes = require('./routes/matches');
const standingsRoutes = require('./routes/standings');
const articlesRoutes = require('./routes/articles');
const playersRoutes = require('./routes/players');

const app = express();

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
.catch(err => console.error('خطأ في الاتصال بقاعدة البيانات:', err));

// الوسائط
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// تحديد معدل الطلبات
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'تجاوزت الحد الأقصى للطلبات، يرجى المحاولة مرة أخرى لاحقاً'
});
app.use('/api/', limiter);

// تقديم الملفات الثابتة
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../')));

// استخدام المسارات
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/standings', standingsRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/players', playersRoutes);

// معالجة الأخطاء
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'حدث خطأ في الخادم' });
});

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
