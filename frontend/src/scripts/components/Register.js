import React from "react";
import { Link } from "react-router-dom";
import * as auth from "../utils/auth";

function Register(props) {
  const [state, setState] = React.useState({
    password: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
     setState(old => ({
       ...old,
      [name]: value,
    }));
  }



  const handleSubmit = (e) => {
    e.preventDefault();
    const { password, email } = state;
    if(!password || !email) return;
    auth.register(password, email)
      .then(()=> {
        props.handleInfoTooltip(true, true);
        props.setIsSuccsess(true)
      })
      .catch((err) => {
        console.log(err)
        props.handleInfoTooltip(true, false, true);
        props.setIsSuccsess(false)
      });
  };

  return (
    <div className='login'>
      <p className='login__welcome'>
        Регистрация
      </p>
      <form onSubmit={handleSubmit} className="login__form">
          <input className='login__input' placeholder="Email" name="email" type="email" value={state.email} onChange={handleChange} />
          <input className='login__input' placeholder="Пароль" name="password" type="password" value={state.password} onChange={handleChange} />
          <button className='login__button' type="submit" onSubmit={handleSubmit}>Зарегистрироваться</button>
      </form>
      <div className="login__signin">
        <p className="login__text">Уже зарегистрированы?</p>
        <Link to="sign-in" className="login__login-link">Войти</Link>
      </div>
    </div>
  );
}

export default Register;
