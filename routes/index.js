// промежуточный файл подключения роутеров
const router = require('express').Router();
const auth = require('../middlewares/auth');
const authRouter = require('./auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../middlewares/NotFoundError');

// подключение роутеров
router.use('/', authRouter);
router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);
router.use('*', auth, ((req, res, next) => next(new NotFoundError('root'))));

module.exports = router;
