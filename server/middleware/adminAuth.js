const auth = require('./auth');

module.exports = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return res.status(403).json({ message: 'غير مصرح، الصلاحيات غير كافية' });
    }
    next();
  });
};
