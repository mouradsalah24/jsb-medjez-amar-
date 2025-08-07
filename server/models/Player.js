const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    enum: ['حارس مرمى', 'مدافع', 'لاعب وسط', 'مهاجم'],
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  nationality: {
    type: String,
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  height: {
    type: Number,
    min: 100,
    max: 250
  },
  weight: {
    type: Number,
    min: 30,
    max: 150
  },
  photo: String,
  bio: String,
  career: [{
    team: String,
    from: Date,
    to: Date,
    appearances: Number,
    goals: Number
  }],
  statistics: {
    appearances: {
      type: Number,
      default: 0
    },
    goals: {
      type: Number,
      default: 0
    },
    assists: {
      type: Number,
      default: 0
    },
    yellowCards: {
      type: Number,
      default: 0
    },
    redCards: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['نشط', 'مصاب', 'معار', 'متقاعد'],
    default: 'نشط'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  contractUntil: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);
