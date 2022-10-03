const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request');
const InternalServerError = require('../errors/internal-server');
const DuplicateError = require('../errors/duplicate-uniq-dbfield');
const UnAuthoRizedError = require('../errors/unauthorized');
const NotFoundError = require('../errors/not-found');

const { NODE_ENV, JWT_SECRET } = process.env;

// создает пользователя
module.exports.createUser = (req, res, next) => {
  // console.log(req);
  // значения по умолчанию используем для необязательных полей
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  // сначала мы ищем юзера в базе, если он уже есть - выкидываем ошибку,
  // что он уже существует, иначе создаем!
  User.findOne({ email })
    .then((newUser) => {
      if (newUser) {
        throw new DuplicateError('Произошла ошибка: пользователь с таким email уже существует!');
      } else {
        // работаем дальше: хешируем пароль
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        console.log(JSON.stringify(user));
        return res.status(201).json({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          id: user._id,
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Произошла ошибка: некорректные данные!'));
        } else if (err.code === 11000) {
          next(new DuplicateError('Произошла ошибка: пользователь с таким email уже существует!'));
        } else {
          // отправляем ошибку в централизованный обработчик
          console.log(`Направляем ошибку в централизованный обработчик: ${err}`);
          next(err);
        }
      }));
};

// контроллер аутентификации login: получает из запроса почту и пароль
// возвращает токен, если все ОК
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password') // хеш пароля нужен!
    .then((user) => {
      if (!user) {
        // пользователь с такой почтой не найден
        next(new UnAuthoRizedError('Неправильные почта или пароль!'));
      }
      // пользователь найден
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            next(new UnAuthoRizedError('Неправильные почта или пароль!'));
          }
          // аутентификация успешна - создаем JWT сроком на неделю
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' }, // контроллер должен создавать JWT сроком на неделю
          );
          // вернём токен
          return res.send({ token });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутрення ошибка сервера!'));
    });
};

// возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => next());
};

// возвращает пользователя по _id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user.id,
        });
      }
      next(new NotFoundError('Произошла ошибка: пользователь не найден!'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутренняя ошибка сервера!'));
    });
};

// возвращает информацию по текущему пользователю
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.json({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user.id,
        });
      }
      next(new NotFoundError('Произошла ошибка: пользователь не найден!'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутренняя ошибка сервера!'));
    });
};

// обновляем профиль: имя и профессиию
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    // Передадим объект опций:
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => {
      if (user) {
        res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user.id,
        });
      }
      next(new NotFoundError('Произошла ошибка: пользователь не найден!'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутренняя ошибка сервера!'));
    });
};

// обновляем аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    // Передадим объект опций:
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false, // если пользователь не найден, он будет создан
  })
    .then((user) => {
      if (user) {
        res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user.id,
        });
      }
      next(new NotFoundError('Произошла ошибка: пользователь не найден!'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутренняя ошибка сервера!'));
    });
};
