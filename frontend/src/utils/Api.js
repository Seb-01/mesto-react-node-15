// import { cohort, token } from "./utils";

/** Класс Api, который предоставляет методы для запросов к сервису mesto
 *
 */
class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  /** Приватный метод, который проверяет ответ от сервера
   * @param {object} res - значение, переданное resolve (вызывается при успешном запросе) при создании промиса
   */
  _checkResponse(res) {
    console.log(`Проверка результат ${res}`);
    console.log(`Проверка результат ${res.ok}`);
    console.log(JSON.stringify(res));

    if (res.ok) {
      // Метод json читает ответ от сервера в формате json и возвращает промис для обработки следующим then
      return res.json();
    }
    // если ошибка, отклоняем промис
    return Promise.reject(`Ошибка выполнении запроса к серверу: ${res.status}`);
  }

  /** Публичный метод для загрузки карточек
   *
   */
  getInitialCards() {
    const request = this._baseUrl + "/cards";
    // возвращаем промис
    return (
      fetch(request, {
        method: "GET",
        headers: this._headers,
      })
        // выполнится, если промис исполнен. Аргумент - функция обработчик успешного выполнения промиса
        .then((res) => this._checkResponse(res))
    );
  }

  /** Публичный метод для загрузки пользовательского профиля
   *
   */
  getUserProfile() {
    const request = this._baseUrl + "/users/me";
    const newHeaders = this._headers;
    const jwt = localStorage.getItem("jwt");
    newHeaders["Content-Type"] = "application/json";
    newHeaders["Authorization"] = `Bearer ${jwt}`;

    return fetch(request, {
      method: "GET",
      headers: newHeaders,
    }).then((res) => this._checkResponse(res));
  }

  /** Публичный метод для удаления карточки
   * @param {object} formPopup - экземпляр popup с подтверждением удаления карточки
   */
  deleteCard(cardId) {
    const request = this._baseUrl + `/cards/${cardId}`;
    // удаляем элемент с сервера
    return fetch(request, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => this._checkResponse(res));
  }

  /** Публичный метод для добавления карточки
   * @param {object} cardData - данные карточки
   */
  addCard(cardData) {
    const request = this._baseUrl + "/cards";
    const newHeaders = this._headers;
    newHeaders["Content-Type"] = "application/json";
    // отправляем запрос на добавление карточки
    return fetch(request, {
      method: "POST",
      headers: newHeaders,
      body: JSON.stringify({
        name: cardData.name,
        link: cardData.link,
      }),
    }).then((res) => this._checkResponse(res));
  }

  /** Публичный метод для сохранения данных профиля пользователя
   * @param {object} profileData - данные карточки
   */
  saveNewProfile(profileData) {
    const request = this._baseUrl + "/users/me";
    const jwt = localStorage.getItem("jwt");
    const newHeaders = this._headers;
    newHeaders["Content-Type"] = "application/json";
    newHeaders["Authorization"] = `Bearer ${jwt}`;

    // отправляем запрос
    return fetch(request, {
      method: "PATCH",
      headers: newHeaders,
      body: JSON.stringify({
        name: profileData.name,
        about: profileData.job,
      }),
    }).then((res) => this._checkResponse(res));
  }

  /** Публичный метод для Обновления автара в профиле пользователя
   * @param {object} newAvatar - ссылка на новый аватар
   */
  updateAvatar(newAvatar) {
    const request = this._baseUrl + "/users/me/avatar";
    const newHeaders = this._headers;
    newHeaders["Content-Type"] = "application/json";
    // отправляем запрос
    return fetch(request, {
      method: "PATCH",
      headers: newHeaders,
      body: JSON.stringify({
        avatar: newAvatar.link,
      }),
    }).then((res) => this._checkResponse(res));
  }

  /** Публичный метод для удаления лайка карточки
   * @param {object} cardId - id карточки
   */
  deleteLike(cardId) {
    const request = this._baseUrl + `/cards/${cardId}/likes`;
    // отправляем запрос
    return fetch(request, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => this._checkResponse(res));
  }

  /** Публичный метод для лайка карточки
   * @param {object} cardId - id карточки
   */
  likeCard(cardId) {
    const request = this._baseUrl + `/cards/${cardId}/likes`;
    // отправляем запрос
    return fetch(request, {
      method: "PUT",
      headers: this._headers,
    }).then((res) => this._checkResponse(res));
  }

  /** Изменить статус лайка на противоположный))
   *
   * @param {*} cardID
   * @param {*} isLiked
   */
  changeLikeCardStatus(cardId, isLiked) {
    const method = isLiked ? "DELETE" : "PUT";
    const request = this._baseUrl + `/cards/${cardId}/likes`;
    // отправляем запрос
    return fetch(request, {
      method: method,
      headers: this._headers,
    }).then((res) => this._checkResponse(res));
  }

  /** создать (зарегистрировать) пользователя
   *
   */
  register(password, email) {
    const request = this._baseUrl + "/signup";
    console.log(request);
    console.log(password);
    console.log(email);
    console.log(JSON.stringify({ email, password }));

    return (
      fetch(request, {
        method: "POST",
        // headers: this._headers,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
        // JSON.stringify - для преобразования объекта в JSON
        body: JSON.stringify({ email, password }),
      })
        // выполнится, если промис исполнен. Аргумент - функция обработчик успешного выполнения промиса
        .then((res) => this._checkResponse(res))
    );
  }

  /** авторизация пользователя
   *
   */
  login(password, email) {
    const request = this._baseUrl + "/signin";

    return (
      fetch(request, {
        method: "POST",
        // headers: this._headers,
        headers: { "Content-Type": "application/json" },
        // JSON.stringify - для преобразования объекта в JSON
        body: JSON.stringify({ password, email }),
      })
        // выполнится, если промис исполнен. Аргумент - функция обработчик успешного выполнения промиса
        .then((res) => this._checkResponse(res))
        .then((data) => {
          if (data.token) {
            // сохраняем токен
            localStorage.setItem("jwt", data.token);
            console.log(data.token);
            return data;
          } else {
            return;
          }
        })
    );
  }

  /** проверка токена
   *
   */
  getContent(token) {
    const request = this._baseUrl + "/users/me";
    // newHeaders = this._headers;
    const newHeaders = this._headers;
    const jwt = localStorage.getItem("jwt");
    newHeaders["Content-Type"] = "application/json";
    newHeaders["Authorization"] = `Bearer ${jwt}`;

    console.log(`Токен: ${jwt}`);
    return (
      fetch(request, {
        method: "GET",
        headers: newHeaders,
      })
        // выполнится, если промис исполнен. Аргумент - функция обработчик успешного выполнения промиса
        .then((res) => this._checkResponse(res))
        .then((data) => {
          return data;
        })
    );
  }
}

// Здесь создаем экземпляр класса Api с нужными параметрами, включая токен, и экспортируем этот экземпляр вместо самого класса
// export const api = new Api({
//   baseUrl: `https://mesto.nomoreparties.co/v1/${cohort}`,
//   headers: { authorization: token },
// });

export const api = new Api({
  baseUrl: 'http://localhost:3001',
  // headers: { authorization: token },
  headers: {},
});


// // Здесь создаем экземпляр класса Api и экспортируем этот экземпляр вместо самого класса
// export const apiAuth = new Api({
//   baseUrl: "https://auth.nomoreparties.co",
//   headers: { "Content-Type": "application/json" },
// });
