class ValidationError extends Error {
  constructor(message = 'Ошибка валидации. Переданы некорректные данные') {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    if (message.includes('cast')) {
      this.message = 'Передан некорректный id';
    }
  }
}

module.exports = ValidationError;
