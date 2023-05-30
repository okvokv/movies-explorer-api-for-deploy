const { celebrate, Joi } = require('celebrate');
const usersRouter = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');

// обработка запроса получения данных текущего пользователя
usersRouter.get('/me', getUser);

// обработка запроса изменения данных текущего пользователя
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

module.exports = usersRouter;
