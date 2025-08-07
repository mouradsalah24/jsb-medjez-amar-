const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  opponent: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['ذهاب', 'إياب', 'ودي', 'دوري', 'كأس'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  competition: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['مجدول', 'مباشر', 'منتهي', 'مؤجل', 'ملغي'],
    default: 'مجدول'
  },
  result: {
    homeTeam: {
      type: Number,
      default: 0
    },
    awayTeam: {
      type: Number,
      default: 0
    }
  },
  highlights: [{
    type: String
  }],
  manOfTheMatch: String,
  attendance: Number,
  referee: String,
  description: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Match', matchSchema);
