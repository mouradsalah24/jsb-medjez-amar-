const express = require('express');
const Player = require('../models/Player');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// الحصول على جميع اللاعبين
router.get('/', async (req, res) => {
  try {
    const { position, status, limit = 10, page = 1 } = req.query;
    const query = {};
    
    if (position) {
      query.position = position;
    }
    
    if (status) {
      query.status = status;
    }
    
    const players = await Player.find(query)
      .sort({ number: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Player.countDocuments(query);
    
    res.json({
      players,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
});

// الحصول على لاعب محدد
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    
    if (!player) {
      return res.status(404).json({ message: 'اللاعب غير موجود' });
    }
    
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
});

// إضافة لاعب جديد (للمسؤولين فقط)
router.post('/', adminAuth, async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    
    res.status(201).json({
      message: 'تم إضافة اللاعب بنجاح',
      player
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
});

// تحديث لاعب (للمسؤولين فقط)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!player) {
      return res.status(404).json({ message: 'اللاعب غير موجود' });
    }
    
    res.json({
      message: 'تم تحديث بيانات اللاعب بنجاح',
      player
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
});

// حذف لاعب (للمسؤولين فقط)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    
    if (!player) {
      return res.status(404).json({ message: 'اللاعب غير موجود' });
    }
    
    res.json({ message: 'تم حذف اللاعب بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
});

// الحصول على أفضل الهدافين
router.get('/top-scorers', async (req, res) => {
  try {
    const players = await Player.find({ status: 'نشط' })
      .sort({ 'statistics.goals': -1 })
      .limit(10);
    
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
  }
});

module.exports = router;
