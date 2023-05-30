const movie = require('../models/movie');
const determineError = require('../middlewares/dterrors');
const ForbiddenError = require('../middlewares/ForbiddenError');
const NotFoundError = require('../middlewares/NotFoundError');

// получить все карточки фильмов
const getMovies = (req, res, next) => {
  const ownerId = req.user._id;
  movie.find(ownerId)
    .then((userMovies) => res.send(userMovies))
    .catch((err) => determineError(err, next));
};

// создать карточку фильма
const postMovie = (req, res, next) => {
  const ownerId = req.user._id;
  const movieData = req.body;
  movie.create({ ownerId, ...movieData })
    .then((data) => res.status(201).send(data))
    .catch((err) => determineError(err, next));
};

// удалить карточку фильма
const deleteMovie = (req, res, next) => {
  // проверка существования карточки  с данным _id в бд
  movie.findById(req.params.movieId)
    .then((movieData) => {
      if (movieData) {
        // карточку может удалить только владелец
        const ownerId = movieData.ownerId.toString();
        if (ownerId === req.user._id) {
          movie.findByIdAndRemove(req.params.movieId, { ownerId: req.user._id })
            .then(() => {
              res.send({ message: 'Пост удален' });
            })
            .catch((err) => determineError(err, next));
          return;
        }
        next(new ForbiddenError());
        return;
      }
      next(new NotFoundError('card'));
    })
    .catch((err) => determineError(err, next));
};

module.exports = { getMovies, postMovie, deleteMovie };
