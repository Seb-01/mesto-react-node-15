import React from "react";
import PopupWithForm from "../PopupWithForm/PopupWithForm";

function AddPlacePopup(props) {
  // Добавляем стейты, которые привяжем к полям ввода (управляемые компоненты) в форме
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");

  // очищать инпуты нужно при открытии (монтировании)
  // чтобы пользователь мог сразу же еще раз добавить что-то новое
  // и ему не пришлось бы очищать инпуты вручную перед этим
  React.useEffect(() => {
    setName("");
    setLink("");
  }, [props.isOpen]);

  //обработчик изменения input
  function handleChange(event) {
    const target = event.target;
    // в поле current React запишет указатель на DOM-элемент, когда будет формировать DOM-дерево
    // обновляем стейты в зависимости от имени поля: name или link
    target.name === "name" ? setName(target.value) : setLink(target.value);
  }

  // обработчик Submit формы
  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onAddPlace({
      name: name,
      link: link,
    });
  }

  return (
    <PopupWithForm
      name="add-place"
      title="Новое место"
      buttonSubmitText="Cоздать"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <fieldset className="popup__info">
        <label className="popup__field">
          <input
            id="mesto-name-input"
            type="text"
            className="popup__input popup__input_field_mesto-name"
            name="name"
            value={name}
            placeholder="Название"
            minlenght="2"
            maxlenght="30"
            required
            onChange={handleChange}
          />
          <span className="popup__input-error mesto-name-input-error"></span>
        </label>
        <label className="popup__field">
          <input
            id="link-input"
            className="popup__input popup__input_field_link"
            name="link"
            value={link}
            placeholder="Сcылка на картинку"
            type="url"
            required
            onChange={handleChange}
          />
          <span className="popup__input-error link-input-error"></span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
