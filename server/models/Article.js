const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['أخبار', 'مقابلات', 'تحليلات', 'تقارير', 'عامة'],
    default: 'أخبار'
  },
  tags: [String],
  media: [{
    type: String
  }],
  featuredImage: String,
  status: {
    type: String,
    enum: ['مسودة', 'منشور', 'مخفي'],
    default: 'منشور'
  },
  views: {
    type: Number,
    default: 0
  },
  publishedAt: Date
}, {
  timestamps: true
});

articleSchema.pre('save', function(next) {
  if (this.status === 'منشور' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Article', articleSchema);
