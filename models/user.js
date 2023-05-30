const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      unique: true,
      type: String,
      required: true,
      validate: {
        validator(email) { return validator.isEmail(email); },
      },
      message: 'Ошибка валидации email',
    },
    password: {
      select: false,
      type: String,
      required: true,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      validate: {
        validator(name) { return name.length >= 2 && name.length <= 30; },
      },
      message: 'Ошибка валидации name',
    },
  },
);

module.exports = mongoose.model('user', userSchema);
