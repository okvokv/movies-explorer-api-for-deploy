class ForbiddenError extends Error {
  constructor(message = 'Нет прав на удаление') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}
module.exports = ForbiddenError;
