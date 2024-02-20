const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { PORT, MONGODB_URL } = require('./config');
const finalErrorHandler = require('./middlewares/finalErrorHandler');
const routes = require('./routes');
const { requestsLogger, errorsLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimiter');

// подключение серверного модуля для интерпретации файла
const app = express();

// подключение базы данных
mongoose.connect(MONGODB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// сборка объекта из JSON-формата
app.use(express.json());
// сборка приходящих cookies
app.use(cookieParser());

// подключение логгера запросов
app.use(requestsLogger);

const allowedUrls = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://okvokv.nomoredomains.rocks',
  'https://okvokv.nomoredomains.rocks',
  'http://okvokv-front.kesug.com',
  'https://okvokv-front.kesug.com',
];

// обработчик cors
app.use(cors({
  origin: allowedUrls,
  credentials: true,
}));

// ограничение числа запросов к серверу
app.use(limiter);

// реализация возможности краш-теста при запросе на роут, потом удалить
// app.get('/crash-test', () => {
// setTimeout(() => { throw new Error('Сервер сейчас упадёт'); }, 0);
// });

// подключение защиты заголовков
app.use(helmet());

// подключение роутеров
app.use(routes);

// подключение логгера ошибок (после обр. запросов, до обр. ошибок)
app.use(errorsLogger);

// обработчик ошибок celebrate
app.use(errors());

// обработчик остальных ошибок
app.use(finalErrorHandler);

// включение прослушивания  порта
app.listen(PORT, () => {
  console.log(`App server listening at: http://localhost:${PORT}`);
});
