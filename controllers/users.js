const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_DEVELOPMENT } = require('../config');
const user = require('../models/user');
const determineError = require('../middlewares/dterrors');
const UnauthorizedError = require('../middlewares/UnauthorizedError');
const NotFoundError = require('../middlewares/NotFoundError');
const ForbiddenError = require('../middlewares/ForbiddenError');

const { NODE_ENV, JWT_SECRET } = process.env;
// -----------------------------------------------------------------------------
// получить данные текущего пользователя
function getUser(req, res, next) {
  user.findById(req.user._id)
    .then((userData) => {
      if (userData) {
        res.send(userData);
        return;
      }
      next(new NotFoundError('user'));
    })
    .catch((err) => determineError(err, next));
}

// изменить данные текущего пользователя
function updateUser(req, res, next) {
  const { name, email } = req.body;
  user.findOneAndUpdate(
    { _id: req.user._id }, // изменить профиль может только владелец
    { name, email },
    { new: true, runValidators: true },
  )
    .then((userData) => res.send(userData))
    .catch((err) => determineError(err, next));
}
// --------------------------------------------------------------------------
// функция создания жетона с зашифрованным _id пользователя на 7 дней
function createToken(userData) {
  return jwt.sign(
    { _id: userData._id },
    // проверка на отсутствие режима разработки
    NODE_ENV === 'production' ? JWT_SECRET : JWT_DEVELOPMENT,
    { expiresIn: '7d' }, // на 7 дней
  );
}

// создать пользователя
function createUser(req, res, next) {
  const { name, email, password } = req.body;
  // хеширование пароля
  bcrypt.hash(password, 10)
    .then((hpassword) => user.create({ email, password: hpassword, name }))
    .then((userData) => {
      const token = createToken(userData);
      // выдача жетона пользователю в coookies
      res.status(201).cookie('token', token, {
        maxAge: 3600000 * 24 * 7, // 7 дней
        httpOnly: true, // закрыт доступ через js-код на фронтенде
        sameSite: 'lax', // разрешена передача с одного и с разных сайтов
        secure: false, // разрешена предача по http и по https
      })
        .send({ message: 'Регистрация успешна.' });
    })
    .catch((err) => determineError(err, next));
}

// авторизовать пользователя
function login(req, res, next) {
  const { email, password } = req.body;
  user.findOne({ email }).select('+password')
    .then((userData) => {
      if (userData) {
        bcrypt.compare(password, userData.password)
          .then((matched) => {
            if (matched) {
              const token = createToken(userData);
              // выдача жетона пользователю в coookies
              res.cookie('token', token, {
                maxAge: 3600000 * 24 * 7, // 7 дней
                httpOnly: true, // нет доступа через js-код
                sameSite: 'lax', // разрешена передача с одного и с разных сайтов
                secure: false, // разрешена предача по http и по https
              })
                .send({ message: 'Авторизация успешна.' });
              return;
            }
            next(new UnauthorizedError());
          })
          .catch((err) => determineError(err, next));
        return;
      }
      next(new UnauthorizedError());
    })
    .catch((err) => determineError(err, next));
}

// разлогинить пользователя
function logout(req, res) {
  res.clearCookie('token')
    .send({ message: 'Выход успешен.' });
}

// удалить пользователя
function removeUser(req, res, next) {
  // проверка существования пользователя с данным _id в бд
  user.findById(req.user._id)
    .then((userData) => {
      if (userData) {
        // пользователя может удалить только владелец
        user.findByIdAndRemove(req.user._id, { _id: req.user._id })
          .then(() => {
            res.clearCookie('token')
              .send({ message: 'Пользователь удалён' });
          })
          .catch((err) => determineError(err, next));
        return;
      }
      next(new ForbiddenError());
    });
  next(new NotFoundError('user'));
}

module.exports = {
  getUser, updateUser, createUser, login, logout, removeUser,
};
