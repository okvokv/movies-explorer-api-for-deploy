const { celebrate, Joi } = require('celebrate');
const moviesRouter = require('express').Router();
const { regexforlink } = require('../utils/regex');
const { getMovies, postMovie, deleteMovie } = require('../controllers/movies');

// обработка запроса получения всех фильмов пользователя
moviesRouter.get('', getMovies);

// обработка запроса создания карточки фильма
moviesRouter.post('', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(1).max(100),
    director: Joi.string().required().min(1).max(100),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required().min(1).max(1000),
    image: Joi.string().required().regex(regexforlink),
    trailer: Joi.string().required().regex(regexforlink),
    thumbnail: Joi.string().required().regex(regexforlink),
    movieId: Joi.number().required().hex().length(24),
    nameRU: Joi.string().required().min(1).max(80),
    nameEN: Joi.string().required().min(1).max(80),
  }),
}), postMovie);

// обработка запроса удаления карточки фильма по id
moviesRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().required().hex().length(24),
  }),
}), deleteMovie);

module.exports = moviesRouter;
