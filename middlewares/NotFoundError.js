class NotFoundError extends Error {
  constructor(message = 'Объект не найден') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    // ветвление в пределах ошибки одного типа
    if (message.includes('user')) {
      this.message = 'Запрашиваемый пользователь не найден';
      return;
    }
    if (message.includes('card')) {
      this.message = 'Запрашиваемая карточка не найдена';
      return;
    }
    if (message.includes('root')) {
      this.message = 'Ошибка маршрутизации';
    }
  }
}

module.exports = NotFoundError;
