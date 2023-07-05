class WrongEmailError extends Error {
  constructor(message = 'Пользователь с таким email уже существует') {
    super(message);
    this.statusCode = 409;
    this.name = 'WrongEmailError';
  }
}

module.exports = WrongEmailError;
