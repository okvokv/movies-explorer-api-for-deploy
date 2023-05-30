const jwt = require('jsonwebtoken');
const { JWT_DEVELOPMENT } = require('../config');
const UnauthorizedError = require('./UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

// проверка жетона (аутентификация пользователя) при каждом запросе
function auth(req, res, next) {
  const { token } = req.cookies;
  req.user = {};
  if (token) {
    try {
      // сверка жетона
      const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_DEVELOPMENT); // проверка на отсутствие режима разработки
      // идент. пользователя
      req.user = payload;
      next();
    } catch (err) { next(new UnauthorizedError('token')); }
    return;
  }
  next(new UnauthorizedError('header'));
}

module.exports = auth;
