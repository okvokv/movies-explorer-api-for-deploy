const mongoose = require('mongoose');
const { regexforlink, regexforpic } = require('../utils/regex');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator(link) {
          return regexforpic.test(link);
        },
        message: 'Ошибка валидации ссылки',
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator(link) {
          return regexforlink.test(link);
        },
        message: 'Ошибка валидации ссылки',
      },
    },
    ownerId: { // тот, кто сохранил фильм в свою базу из общей
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
);

module.exports = mongoose.model('movie', movieSchema);
