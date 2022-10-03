import React from "react";
import PopupWithoutForm from "../PopupWithoutForm/PopupWithoutForm";

function InfoToolTip2(props) {
  return (
    <PopupWithoutForm isOpen={props.isOpen} onClose={props.onClose}>
      {props.successReg ? (
        <div className="popup__success-container">
          <img
            className="popup__success-pic"
            src={props.success_pic}
            alt="Pic success"
          />

          <p className="popup__exclamation">
            Вы успешно
            <br />
            зарегистрировались!
          </p>
        </div>
      ) : (
        <div className="popup__success-container">
          <img
            className="popup__success-pic"
            src={props.unsuccess_pic}
            alt="Pic unsuccess"
          />

          <p className="popup__exclamation">
            Что-то пошло не так!
            <br />
            Попробуйте еще раз.
          </p>
        </div>
      )}
    </PopupWithoutForm>
  );
}

export default InfoToolTip2;
