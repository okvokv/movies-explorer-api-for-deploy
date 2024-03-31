const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser, updateUser, removeUser } = require('../controllers/users');

// получение данных текущего пользователя
usersRouter.get('/me', getUser);

// изменение данных текущего пользователя
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

// удаление пользователя
usersRouter.delete('/me', removeUser);

module.exports = usersRouter;
