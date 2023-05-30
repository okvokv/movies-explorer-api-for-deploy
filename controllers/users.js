const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const determineError = require('../middlewares/dterrors');
const UnauthorizedError = require('../middlewares/UnauthorizedError');
const NotFoundError = require('../middlewares/NotFoundError');

// -----------------------------------------------------------------------------
// получить данные текущего пользователя
const getUser = (req, res, next) => {
  user.findById(req.user._id)
    .then((userData) => {
      if (userData) {
        res.send(userData);
        return;
      }
      next(new NotFoundError('user'));
    })
    .catch((err) => determineError(err, next));
};

// изменить данные текущего пользователя
const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  user.findOneAndUpdate(
    { _id: req.user._id }, // изменить профиль может только владелец
    { name, email },
    { new: true, runValidators: true },
  )
    .then((userData) => res.send(userData))
    .catch((err) => determineError(err, next));
};
// --------------------------------------------------------------------------

// создать пользователя
const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  // хеширование пароля
  bcrypt.hash(password, 10)
    .then((hpassword) => user.create({ email, password: hpassword, name }))
    .then((userData) => res.status(201).send({
      _id: userData._id,
      email: userData.email,
      name: userData.name,
    }))
    .catch((err) => determineError(err, next));
};

// функция создания жетона с зашифрованным _id пользователя на 7 дней
function createToken(userData) {
  return jwt.sign(
    { _id: userData._id },
    // проверка на отсутствие режима разработки
    NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
    { expiresIn: '7d' }, // на 7 дней
  );
}

// авторизовать пользователя
const login = (req, res, next) => {
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
                secure: undefined, // разрешена предача по http и по https
              })
                .send({ message: 'Авторизация успешна.' });
              return;
            }
            next(new UnauthorizedError(''));
          })
          .catch((err) => determineError(err, next));
        return;
      }
      next(new UnauthorizedError(''));
    })
    .catch((err) => determineError(err, next));
};

// разлогинить пользователя
const logout = (req, res) => {
  res.clearCookie('token')
    .send({ message: 'Выход успешен.' });
};

module.exports = {
  getUser, updateUser, createUser, login, logout,
};