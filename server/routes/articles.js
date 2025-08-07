const express = require('express');
const Article = require('../models/Article');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// الحصول على جميع المقالات
router.get('/', async (req, res) => {
  try {
    const { category, limit = 10, page = 1, search } = req.query;
    const query = { status: 'منشور' };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const articles = await Article.find(query)
      .populate('author', 'username')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Article.countDocuments(query);
    
    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
});

// الحصول على مقال محدد
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'username');
    
    if (!article) {
      return res.status(404).json({ message: 'المقال غير موجود' });
    }
    
    // زيادة عدد المشاهدات
    article.views += 1;
    await article.save();
    
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
});

// إضافة مقال جديد (للمسؤولين فقط)
router.post('/', adminAuth, async (req, res) => {
  try {
    const user = req.user;
    
    const article = new Article({
      ...req.body,
      author: user.userId
    });
    
    await article.save();
    
    res.status(201).json({
      message: 'تم نشر المقال بنجاح',
      article
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
});

// تحديث مقال (للمسؤولين فقط)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!article) {
      return res.status(404).json({ message: 'المقال غير موجود' });
    }
    
    res.json({
      message: 'تم تحديث المقال بنجاح',
      article
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
});

// حذف مقال (للمسؤولين فقط)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'المقال غير موجود' });
    }
    
    res.json({ message: 'تم حذف المقال بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
});

module.exports = router;
