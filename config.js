// файл конфигурации
const {
  PORT = 3000,
  MONGODB_URL = 'mongodb://0.0.0.0:27017/bitfilmsdb',
} = process.env;

module.exports = { PORT, MONGODB_URL };
