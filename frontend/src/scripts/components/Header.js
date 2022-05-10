import logo from '../../images/logo__theme_black.svg';
import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import AppContext from "../../contexts/AppContext";

function Header() {
  const history = useHistory();
  const value = React.useContext(AppContext);

  function signOut(){
    localStorage.removeItem('token');
    history.push('/sign-in');
    value.loggedIn = false;
  }
  const location = useLocation();
  return (
    <header className="header page__header">
      <img src={logo} alt="Логотип проекта" className="header__logo" />
      {value.loggedIn ?
        <div className="header__login">
          <p className="header__email">{value.email}</p>
          <button className="header__button" onClick={signOut}>Выйти</button>
        </div>
        : ( (location.pathname === '/sign-in') ? (<Link className="header__link" to='/sign-up'>Регистрация</Link>) : (<Link className="header__link" to='/sign-in'>Войти</Link>))
      }
    </header>
  )
}

export default Header;
