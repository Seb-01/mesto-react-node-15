import React from "react";
import { useEffect, useState } from "react";

import logoMestoHeader from "../../../src/images/logo_mesto_header.svg";
import successPic from "../../../src/images/success_pic.svg";
import unsuccessPic from "../../../src/images/unsuccess_pic.svg";

import avatar from "../../../src/images/photo_j_i_kusto.jpg";

import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import PopupWithForm from "../PopupWithForm/PopupWithForm";

import ImagePopup from "../ImagePopup/ImagePopup";

import { CurrentUserContext } from "../../contexts/CurrentUserContext";
//import { api, apiAuth } from "../../utils/Api";
import { api } from "../../utils/Api";

import EditProfilePopup from "../EditProfilePopup/EditProfilePopup";
import EditAvatarPopup from "../EditAvatarPopup/EditAvatarPopup";
import AddPlacePopup from "../AddPlacePopup/AddPlacePopup";
import InfoToolTip2 from "../InfoToolTip2/InfoToolTip2";

import { Route, Switch } from "react-router-dom";
import Login from "../Login/Login";
import Registration from "../Registration/Registration";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { withRouter, useHistory } from "react-router-dom";

function App() {
  // переменная состояния, отвечающая за стейт данных о карточках
  const [cards, setCards] = useState([]);

  // данные текущего пользователя
  const [currentUser, setCurrentUser] = useState({
    name: "",
    about: "",
    avatar: "",
    _id: "",
  });

  // стейт-переменная со статусом пользователя - вошел в систему или нет?
  const [loggedIn, setLoggedIn] = useState(false);

  // стейт-переменная с email пользователя
  const [userEmail, setUserEmail] = useState("");

  // стейт-переменная с результатом регистрации
  const [isSuccessRegLog, setIsSuccessRegLog] = useState(false);

  function handleLogin(userEmail) {
    setLoggedIn(true);
    setUserEmail(userEmail);
  }

  function handleSuccessRegLog(res) {
    if (res) setIsSuccessRegLog(true);
    else setIsSuccessRegLog(false);
    setPopups({
      ...popups, // здесь мы копируем текущее состояние объекта
      isInfoToolTipOpen: true, //здесь перезаписываем свойство isInfoToolTipOpen
    });
  }

  const history = useHistory();

  // разлогон делаем
  function onSignOut() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setUserEmail("");
    history.push("/sign-in");
  }

  // добавляем эффект, вызываемый при монтировании компонента, который будет совершать
  // запрос в API за профилем пользователя
  useEffect(() => {
    if (loggedIn) {
      api
        .getUserProfile()
        // обрабатываем полученные данные и деструктурируем ответ от сервера, чтобы было понятнее, что пришло
        .then((userData) => {
          // меняем состояние профиля пользователя
          console.log(userData);
          setCurrentUser(userData);
        })
        .catch((err) => {
          console.log(`Ошибка при запросе данных пользователя: ${err}!`);
        });
    }
  }, [loggedIn]);

  // Проверка токена
  function checkToken() {
    // если у пользователя есть токен в localStorage,
    // эта функция проверит валидность токена
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      // apiAuth
      api
        .getContent(jwt)
        .then((res) => {
          // console.log(jwt);
          // console.log(JSON.stringify(res));
          if (res) {
            // setUserEmail(res.data.email);
            setUserEmail(res.email);
            setLoggedIn(true);
          }
          history.push("/");
        })
        .catch((err) => {
          console.log(`Ошибка при проверке токена: ${err}!`);
        });
    }
  }

  //
  useEffect(() => {
    checkToken();
  }, [loggedIn]);

  // обработчик клика на кнопку лайк
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        // теперь нужно эту карточку в нашем стейте найти и проапдейтить. Это вызовет ее перерисовку!
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(`Ошибка при обновлении данных карточки: ${err}!`);
      });
  }

  // обработчик удаления карточки
  function handleCardDelete(card) {
    // Отправляем запрос в API на удаление карточки
    api
      .deleteCard(card._id)
      .then(() => {
        // теперь нужно эту карточку убрать из нашего стейта. Это вызовет ее перерисовку (удаление из DOM)!
        // создаем копию массива, исключив из него удалённую карточку
        // колбэк обновит существующую коллекцию из стейта — на вход идет значение текущего стейта,
        // на выход — не совершенно новое (ключи!), а обновленное значение (коллекция без удаляемой карточки):
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(`Ошибка при удалении карточки: ${err}!`);
      });
  }

  // добавляем эффект, вызываемый при монтировании компонента, который будет совершать
  // запрос в API за карточками
  useEffect(() => {
    if (loggedIn) {
      api
        .getInitialCards()
        // обрабатываем полученные данные деструктурируем ответ от сервера, чтобы было понятнее, что пришло
        .then((cards) => {
          // карточки загружаем
          console.log(cards);
          setCards(cards);
        })
        .catch((err) => {
          console.log(`Ошибка при запросе карточек: ${err}!`);
        });
    }
  }, [loggedIn]);

  // переменная состояния, отвечающая за полноразмерную картинку
  // {} т.к. ожидаем что здесь будет объект с данными карточки
  const [selectedCard, setSelectedCard] = useState({});

  // обработчики нажатия на карточку
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  // переменные состояния, отвечающие за видимость попапов
  const [popups, setPopups] = useState({
    isEditProfilePopupOpen: false,
    isAddPlacePopupOpen: false,
    isEditAvatarPopupOpen: false,
    isInfoToolTipOpen: false,
  });

  // обработчики нажатия на кнопки
  function handleEditAvatarClick(evt) {
    setPopups({
      ...popups, // здесь мы копируем текущее состояние объекта
      isEditAvatarPopupOpen: true, //здесь перезаписываем свойство isEditAvatarPopupOpen
    });
  }

  function handleEditProfileClick(evt) {
    setPopups({
      ...popups, // здесь мы копируем текущее состояние объекта
      isEditProfilePopupOpen: true, //здесь перезаписываем свойство isEditProfilePopupOpen
    });
  }

  function handleAddPlaceClick(evt) {
    setPopups({
      ...popups, // здесь мы копируем текущее состояние объекта
      isAddPlacePopupOpen: true, //здесь перезаписываем свойство isAddPlacePopupOpen
    });
  }

  // закрытие попапов
  function closeAllPopups(evt) {
    setPopups({
      isEditProfilePopupOpen: false,
      isAddPlacePopupOpen: false,
      isEditAvatarPopupOpen: false,
      isInfoToolTipOpen: false,
    });

    setSelectedCard({});
  }

  // обработчик изменения профиля пользователя
  function handleUpdateUser(newProfile) {
    // запрос на сервер: сохранить новые данные пользователя
    api
      .saveNewProfile(newProfile)
      // обрабатываем полученные данные и деструктурируем ответ от сервера, чтобы было понятнее, что пришло
      .then((userData) => {
        // меняем состояние профиля пользователя
        setCurrentUser({
          ...currentUser,
          name: userData.name,
          about: userData.about,
        });
        // закрываем все модальные окна
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка при сохранении данных пользователя: ${err}!`);
      });
  }

  // обработчик изменения аватара пользователя
  function handleUpdateAvatar(newAvatar) {
    // запрос на сервер: сохранить новые данные пользователя
    api
      .updateAvatar(newAvatar)
      // обрабатываем полученные данные и деструктурируем ответ от сервера, чтобы было понятнее, что пришло
      .then((userData) => {
        // меняем состояние профиля пользователя
        setCurrentUser({
          ...currentUser,
          avatar: userData.avatar,
        });
        // закрываем все модальные окна
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка при сохранении аватара пользователя: ${err}!`);
      });
  }

  // обработчик добавления новой карточки
  function handleAddPlaceSubmit(cardData) {
    api
      .addCard(cardData)
      // обновляем стейт cards с помощью расширенной копии текущего массива — используя spred оператор ...
      .then((newCard) => {
        // меняем стейт с набором карточек
        setCards([newCard, ...cards]);
        // закрываем все модальные окна
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка при сохранении новой карточки: ${err}!`);
      });
  }

  // обработчик login submit
  function handleLoginSubmit(password, email) {
    // сюда добавим логику обработки формы логина
    // Отправляем запрос в API регистрацию пользователя
    // apiAuth
    api
      .login(password, email)
      // здесь уже данные пользователя от сервера
      .then((data) => {
        if (data.token) {
          handleLogin(email);
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(`Ошибка при логине пользователя: ${err}!`);
        handleSuccessRegLog(false);
      });
  }

  // обработчик registration
  function handleRegisterSubmit(password, email) {
    // сюда добавим логику обработки формы регистрации
    // Отправляем запрос в API регистрацию пользователя
    // apiAuth
    api
      .register(password, email)
      // здесь уже данные пользователя от сервера
      .then((res) => {
        console.log(`Получаю результат registration: ${res}`);
        if (res) {
          history.push("/sign-in");
          handleSuccessRegLog(true);
        }
      })
      .catch((err) => {
        console.log(`Ошибка при регистрации пользователя: ${err}!`);
        handleSuccessRegLog(false);
      });
  }

  return (
    // внедряем общий контекст с помощью провайдера со значением стейта currentUser
    <CurrentUserContext.Provider value={currentUser}>
      <div>
        <Header
          logo={logoMestoHeader}
          email={userEmail}
          onSignOut={onSignOut}
          // goToRegister={goToRegister}
        />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            loggedIn={loggedIn}
            component={Main}
            avatar={avatar}
            name="Жак-Ив Кусто"
            about="Исследователь океана"
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />
          {/* регистрация пользователей */}
          <Route path="/sign-up">
            <Registration
              name="registration"
              title="Регистрация"
              buttonSubmitText="Зарегистрироваться"
              onRegister={handleRegisterSubmit}
            />
          </Route>
          {/* авторизация пользователей */}
          <Route path="/sign-in">
            <Login
              name="login"
              title="Вход"
              email={userEmail}
              buttonSubmitText="Войти"
              onLogin={handleLoginSubmit}
            />
          </Route>
        </Switch>

        {/* popups */}
        {/* профиль пользователя */}
        <EditProfilePopup
          isOpen={popups.isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        {/* добавление карточки */}
        <AddPlacePopup
          isOpen={popups.isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        {/* аватар пользователя */}
        <EditAvatarPopup
          isOpen={popups.isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        {/* конфирм удаления карточки */}
        <PopupWithForm
          name="confirm-delete"
          title="Вы уверены?"
          buttonSubmitText="Да"
        />
        {/* показ карточки при клике на нее */}
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        {/* инфо о результате регистрации */}
        <InfoToolTip2
          isOpen={popups.isInfoToolTipOpen}
          onClose={closeAllPopups}
          successReg={isSuccessRegLog}
          success_pic={successPic}
          unsuccess_pic={unsuccessPic}
        />

        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
