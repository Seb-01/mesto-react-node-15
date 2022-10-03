import React from "react";

function ImagePopup(props) {
  return (
    <div
      className={`popup popup_target_picture-view ${
        props.card._id && "popup_opened"
      }`}
    >
      <div className="popup__picture-container">
        <button
          className="popup__close-button"
          type="button"
          aria-label="Close button"
          onClick={props.onClose}
        ></button>
        <figure className="popup__figure-picture">
          <img
            className="popup__picture"
            src={props.card.link}
            alt={props.card.name}
          />
          <figcaption className="popup__figure-caption">
            {props.card.name}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

export default ImagePopup;
