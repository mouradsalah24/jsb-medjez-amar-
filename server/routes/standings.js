const express = require('express');
const router = express.Router();

// نموذج مؤقت لجدول الترتيب
let standings = [
  { name: 'جيل مجاز عمار', played: 5, won: 3, drawn: 1, lost: 1, points: 10 },
  { name: 'فريق آخر', played: 5, won: 2, drawn: 2, lost: 1, points: 8 },
  { name: 'فريق ثالث', played: 5, won: 2, drawn: 1, lost: 2, points: 7 }
];

// الحصول على جدول الترتيب
router.get('/', async (req, res) => {
  try {
    // فرز حسب النقاط
    const sortedStandings = [...standings].sort((a, b) => b.points - a.points);
    res.json(sortedStandings);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
});

// إضافة أو تحديث فريق في جدول الترتيب
router.post('/', async (req, res) => {
  try {
    const team = req.body;
    
    // التحقق من وجود الفريق
    const existingIndex = standings.findIndex(t => t.name === team.name);
    
    if (existingIndex !== -1) {
      // تحديث الفريق الموجود
      standings[existingIndex] = team;
    } else {
      // إضافة فريق جديد
      standings.push(team);
    }
    
    // فرز حسب النقاط
    standings.sort((a, b) => b.points - a.points);
    
    res.json({
      message: 'تم تحديث جدول الترتيب بنجاح',
      standings
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
});

module.exports = router;
