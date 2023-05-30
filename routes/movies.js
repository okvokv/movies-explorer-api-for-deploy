const { celebrate, Joi } = require('celebrate');
const moviesRouter = require('express').Router();
const { regexforlink } = require('../utils/regex');
const { getMovies, postMovie, deleteMovie } = require('../controllers/movies');

// обработка запроса получения всех фильмов пользователя
moviesRouter.get('', getMovies);

// обработка запроса создания карточки фильма
moviesRouter.post('', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regexforlink),
  }),
}), postMovie);

// обработка запроса удаления карточки фильма по id
moviesRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = moviesRouter;
