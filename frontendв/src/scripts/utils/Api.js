class Api {
  constructor( {url, headers} ) {
    this._url = url;
    this._headers = headers;
  }

  _errorHandler(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }


  //получить данные пользователя (GET)
  getUserData() {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: this._headers
    }).then(this._errorHandler)
  }

  //заменить данные пользователя (PATCH)
  patchUserData(data) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(data)
    }).then(this._errorHandler)
  }

  //получить список всех карточек в виде массива (GET)
  getCards() {
    return fetch(`${this._url}/cards`, {
      method: 'GET',
      headers: this._headers
    }).then(this._errorHandler)
  }

  //добавить карточку (POST)
  postCard(data) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(data)
    }).then(this._errorHandler)
  }

  //удалить карточку (DELETE)
  deleteCard(id) {
    return fetch(`${this._url}/cards/${id}`, {
      method: 'DELETE',
      headers: this._headers
    }).then(this._errorHandler)
  }

  //поставить лайк
  changeLikeCardStatus(id, isNotLiked){
    if (isNotLiked) {
      return fetch(`${this._url}/cards/${id}/likes`, {
        method: 'PUT',
        headers: this._headers
      }).then(this._errorHandler)
    } else {
      return fetch(`${this._url}/cards/${id}/likes`, {
        method: 'DELETE',
        headers: this._headers
      }).then(this._errorHandler)
    }
  }

  //обновить аватар пользователя (PATCH)
  patchAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(data)
    }).then(this._errorHandler)
  }
}

const api = new Api( {
  url: 'http://api.lusyaknowssomething.nomoredomains.xyz',
  credentials: 'include',
  authorization: `Bearer ${localStorage.getItem("jwt")}`,
  headers: {
    "content-type": "application/json"
  }
});

export default api;
