import React, { useState } from "react";
import * as auth from "../utils/auth";

function Login({ handleLogin, handleInfoTooltip, setIsSuccsess }) {
  const [state, setState] = useState({
    password: '',
    email: '',
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
     setState(old => ({
       ...old,
      [name]: value
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const { password, email } = state;
    if (!email || !password) {
      return;
    }
    auth.authorize(password, email)
    .then((data) => {
      if (!data.token){
        handleInfoTooltip(true, false);
        setIsSuccsess(false)
        return;
      }

      handleLogin(data.token, email);
      setState({password: '', email: ''});
    })
    .catch((err) => {
      handleInfoTooltip(true, false);
      setIsSuccsess(false);
      console.log(err)});

  }

  return (
    <div className='login'>
      <p className='login__welcome'>
        Вход
      </p>
      <form onSubmit={handleSubmit} className="login__form">
          <input className='login__input' placeholder="Email" name="email" type="email" value={state.email} onChange={handleChange} />
          <input className='login__input' placeholder="Пароль" name="password" type="password" value={state.password} onChange={handleChange} />
          <button className='login__button' type="submit" onSubmit={handleSubmit}>Войти</button>
        </form>
    </div>
  );
}

export default Login;
