const { celebrate, Joi } = require('celebrate');
const moviesRouter = require('express').Router();
const { regexforlink, regexforpic } = require('../utils/regex');
const { getMovies, postMovie, deleteMovie } = require('../controllers/movies');

// обработка запроса получения всех фильмов пользователя
moviesRouter.get('', getMovies);

// обработка запроса создания карточки фильма
moviesRouter.post('', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(1).max(200),
    director: Joi.string().required().min(1).max(200),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(6),
    description: Joi.string().required().min(1).max(5000),
    image: Joi.string().required().regex(regexforpic),
    trailerLink: Joi.string().required().regex(regexforlink),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(1).max(100),
    nameEN: Joi.string().required().min(1).max(100),
  }),
}), postMovie);

// обработка запроса удаления карточки фильма по id
moviesRouter.delete('/:savedMovId', celebrate({
  params: Joi.object().keys({
    savedMovId: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);

module.exports = moviesRouter;
