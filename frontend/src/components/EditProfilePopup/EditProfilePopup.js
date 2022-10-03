import React from "react";
import PopupWithForm from "../PopupWithForm/PopupWithForm";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

function EditProfilePopup(props) {
  // подписываемся на контекст CurrentUserContext
  const currentUser = React.useContext(CurrentUserContext);

  // Добавляем стейты, которые привяжем к полям ввода (управляемые компоненты) в форме
  // name
  const [name, setName] = React.useState(currentUser.name);
  // description
  const [description, setDescription] = React.useState(currentUser.about);

  // После загрузки текущего пользователя из API его данные будут использованы в управляемых компонентах.
  // Нужно также следить за isOpen (за состоянием открытия), чтобы вставлять в инпуты данные пользователя,
  // иначе, если мы удалим информацию из инпутов и просто закроем попап,
  // то при следующем открытии инпуты будут пустые (без данных пользователя)
  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  //обработчик изменения input
  function handleChange(event) {
    const target = event.target;
    // обновляем стейты в зависимости от имени поля: name или job
    target.name === "name"
      ? setName(target.value)
      : setDescription(target.value);
  }

  // обработчик Submit формы
  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser({
      name: name,
      job: description,
    });
  }

  return (
    <PopupWithForm
      name="edit-profile"
      title="Редактировать профиль"
      buttonSubmitText="Cохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <fieldset className="popup__info">
        <label className="popup__field">
          <input
            id="name-input"
            type="text"
            className="popup__input popup__input_field_name"
            value={name}
            name="name"
            placeholder="Введите имя"
            minlenght="2"
            maxlenght="40"
            required
            onChange={handleChange}
          />
          <span className="popup__input-error name-input-error"></span>
        </label>
        <label className="popup__field">
          <input
            id="job-input"
            type="text"
            className="popup__input popup__input_field_job"
            value={description}
            name="job"
            placeholder="Введите род занятий"
            minlenght="2"
            maxlenght="200"
            required
            onChange={handleChange}
          />
          <span className="popup__input-error job-input-error"></span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
