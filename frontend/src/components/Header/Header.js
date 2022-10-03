import React from "react";
import { Route, Link, Switch } from "react-router-dom";

function Header(props) {
  return (
    <header className="header">
      <img className="header__logo" src={props.logo} alt="Лого Mesto Russia" />
      <div className="header__authorization-place">
        <p className="header__email">{props.email}</p>
        <Switch>
          <Route exact path="/">
            <button
              className="header__link-button"
              type="button"
              aria-label="Link button"
              onClick={props.onSignOut}
            >
              Выйти
            </button>
          </Route>

          <Route path="/sign-up">
            <Link to="/sign-in" className="header__link">
              Войти
            </Link>
          </Route>

          <Route path="/sign-in">
            <Link to="/sign-up" className="header__link">
              Регистрация
            </Link>
          </Route>
        </Switch>
      </div>
    </header>
  );
}

export default Header;
