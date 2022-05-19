require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
//  const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const { usersRoutes } = require('./routes/users');
const { cardsRoutes } = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { Auth } = require('./middlewares/auth');
const { cors } = require('./middlewares/cors');
const NotFoundError = require('./errors/not-found-err');
const { urlValidation } = require('./middlewares/urlValidation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;
const app = express();

//  app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.disable('x-powered-by');

app.use((req, res, next) => cors(req, res, next));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB has started ...'))
  .catch((error) => console.log(error));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
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

app.use(errors());
app.use(errorLogger); // подключаем логгер ошибок
app.use((err, req, res, next) => errorHandler(err, req, res, next));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
