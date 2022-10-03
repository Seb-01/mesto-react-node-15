import React from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

function Card(props) {
  // подписываемся на контекст CurrentUserContext
  const currentUser = React.useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = props.card.owner._id === currentUser._id;

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = `elements__trash-button ${
    isOwn ? "" : "elements__trash-button_hidden"
  }`;

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = props.card.likes.some((i) => i._id === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `elements__like-button ${
    isLiked ? "elements__like-button_active" : ""
  }`;

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }

  return (
    <article className="elements__card">
      <button
        className={cardDeleteButtonClassName}
        type="button"
        aria-label="Trash button"
        onClick={handleDeleteClick}
      ></button>
      <img
        className="elements__photo"
        src={props.card.link}
        alt={props.card.name}
        // не забываем добавить обработчик клика на карточке
        onClick={handleClick}
      />
      <div className="elements__wrapper">
        <h2 className="elements__title">{props.card.name}</h2>
        <div className="elements__like-zone-wrapper">
          <button
            className={cardLikeButtonClassName}
            type="button"
            aria-label="Like button"
            onClick={handleLikeClick}
          ></button>
          <p className="elements__likes-number">{props.card.likes.length}</p>
        </div>
      </div>
    </article>
  );
}

export default Card;
