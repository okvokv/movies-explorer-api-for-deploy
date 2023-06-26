const { celebrate, Joi } = require('celebrate');
const authRouter = require('express').Router();
const { regexforpassword } = require('../utils/regex');
const { login, createUser, logout } = require('../controllers/users');

authRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(30),
  }),
}), login);

authRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().regex(regexforpassword),
  }),
}), createUser);

authRouter.delete('/signout', logout);

module.exports = authRouter;
