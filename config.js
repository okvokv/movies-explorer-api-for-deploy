// файл конфигурации
const {
  PORT = 3000,
  MONGODB_URL = 'mongodb://0.0.0.0:27017/bitfilmsdb',
} = process.env;

const JWT_DEVELOPMENT = 'super-strong-secret';

module.exports = { PORT, MONGODB_URL, JWT_DEVELOPMENT };
