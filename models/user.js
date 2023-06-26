const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
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
  },
);

module.exports = mongoose.model('user', userSchema);
