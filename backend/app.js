require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const { usersRoutes } = require('./routes/users');
const { cardsRoutes } = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { Auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { urlValidation } = require('./middlewares/urlValidation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { allowedCors } = require('./middlewares/cors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.disable('x-powered-by');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB has started ...'))
  .catch((error) => console.log(error));

app.use(requestLogger);

app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  console.log(origin);
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  const { method } = req;

  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }
  return next();
});

app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(urlValidation),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/', Auth, usersRoutes);
app.use('/', Auth, cardsRoutes);

app.use('*', Auth, () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
