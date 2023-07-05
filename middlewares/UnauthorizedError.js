class UnauthorizedError extends Error {
  constructor(message = 'Неправильные почта или пароль') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
    // ветвление в пределах ошибки одного типа
    if (message.includes('token')) {
      this.message = 'Некорректный жетон. Необходима авторизация';
      return;
    }
    if (message.includes('header')) {
      this.message = 'Некорректный заголовок запроса';
    }
  }
}

module.exports = UnauthorizedError;
