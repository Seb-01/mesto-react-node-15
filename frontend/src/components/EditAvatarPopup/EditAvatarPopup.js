import React from "react";
import PopupWithForm from "../PopupWithForm/PopupWithForm";

function EditAvatarPopup(props) {
  // записываем объект, возвращаемый хуком, в переменную
  // этот объект присваиваем элементу input с помощью атрибута ref, чтобы получить доступ к нему и его значению!
  const avatarLink = React.useRef(null);

  // очищать инпуты нужно при открытии (монтировании)
  // чтобы пользователь мог сразу же еще раз добавить что-то новое
  // и ему не пришлось бы очищать инпуты вручную перед этим
  React.useEffect(() => {
    avatarLink.current.value = "";
  }, [props.isOpen]);

  // обработчик Submit формы
  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateAvatar({
      link: avatarLink.current.value,
    });
  }

  return (
    <PopupWithForm
      name="edit-avatar"
      title="Обновить аватар"
      buttonSubmitText="Cохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <fieldset className="popup__info">
        <label className="popup__field">
          <input
            id="avatar-link-input"
            className="popup__input popup__input_field_link"
            name="link"
            placeholder="Сcылка на аватар"
            type="url"
            required
            ref={avatarLink}
          />
          <span className="popup__input-error avatar-link-input-error"></span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
