import React from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import ImagePopup from "./ImagePopup";
import api from "../utils/Api";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeletePopup from "./DeletePopup";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import * as auth from "../utils/auth";
import InfoTooltip from "./InfoTooltip";
import AppContext from "../../contexts/AppContext";

const App = () => {
  const history = useHistory();
  const [currentUser, setCurrentUser] = React.useState([]);
  const [cards, setCards] = React.useState([]);
  const avatarRef = React.useRef();

  React.useEffect(() => {
    Promise.all([api.getUserData(), api.getCards()])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(
          cards.data.map((item) => ({
            likes: item.likes,
            name: item.name,
            link: item.link,
            _id: item._id,
            owner: item.owner,
          }))
        );
      })
      .catch((err) => {
        console.log(err); // выведем ошибку в консоль
      });
  }, []);

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cardForDelete, setCardForDelete] = React.useState(null);
  const [loggining, setLoggining] = React.useState({ loggedIn: false});
  const [email, setEmail] = React.useState(null);

  function tokenCheck() {
    const token = localStorage.getItem("token");
    if (!token) return;
    auth
      .checkToken(token)
      .then((res) => {
        if (!res) return;
        setEmail(res.email);
        setLoggining({
          loggedIn: true
        });
        history.push("/cards");
      })
      .catch((res) => console.log(res));
  }

  React.useEffect(() => {
    tokenCheck();
  }, []);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleDeleteClick() {
    setIsDeletePopupOpen(!isDeletePopupOpen);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeletePopupOpen(false);
    setInfoTooltipPopupOpen(false);
    setSelectedCard(null);
    setCardForDelete(null);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardDeleteClick(card) {
    setCardForDelete(card);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);
    console.log(isLiked);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        console.log(newCard);
        console.log('hello')
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard.card : c))
        );
      })
      .catch((err) => {
        console.log(err); // выведем ошибку в консоль
      });
  }

  function handleCardDelete(card) {
    setIsLoading(true);
    // Отправляем запрос в API и удаляем карточку
    api
      .deleteCard(card._id)
      .then(() => {
        const NewCards = cards.filter((el) => el._id !== card._id);
        setCards(NewCards);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err); // выведем ошибку в консоль
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateUser(data) {
    setIsLoading(true);
    api
      .patchUserData(data)
      .then(() => {
        currentUser.name = data.name;
        currentUser.about = data.about;
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err); // выведем ошибку в консоль
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar(data) {
    setIsLoading(true);
    api
      .patchAvatar({ avatar: data })
      .then(() => {
        currentUser.avatar = data;
        closeAllPopups();
        avatarRef.current.value = "";
      })
      .catch((err) => {
        console.log(err); // выведем ошибку в консоль
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddPlace(data) {
    setIsLoading(true);
    api
      .postCard(data)
      .then((res) => {
        setCards([res.data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err); // выведем ошибку в консоль
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleLogin(token, email) {
    if (!token) return;
    setEmail(email)
    localStorage.setItem("token", token);
    setLoggining((old) => ({ ...old, loggedIn: true }));
    history.push("/cards");
  }

  const [isSuccsess, setIsSuccsess] = React.useState(null);

  const [infoTooltipPopupOpen, setInfoTooltipPopupOpen] = React.useState(null);

  function handleInfoTooltip(boolean, historyPush, register) {
    if(historyPush) {history.push("/sign-in")};
    if(register) {setLoggining(false)}
    setInfoTooltipPopupOpen(boolean);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <AppContext.Provider value={{loggedIn: loggining.loggedIn, email: email}}>
        <div className="page">
          <Header />
          <Switch>
          <ProtectedRoute path="/cards" >
            <Main
              onEditProfile={handleEditProfileClick}
              onEditAvatar={handleEditAvatarClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDeleteClick}
              onDelete={handleDeleteClick}
              cards={cards}
            />
          </ProtectedRoute>
            <Route path="/sign-up">
              <Register
                handleInfoTooltip={handleInfoTooltip}
                setIsSuccsess={setIsSuccsess}
              />
            </Route>
            <Route path="/sign-in">
              <Login handleLogin={handleLogin} handleInfoTooltip={handleInfoTooltip} setIsSuccsess={setIsSuccsess} />
            </Route>
            <Route exact path="/">
              {loggining.loggedIn ? <Redirect to="/cards" /> : <Redirect to="/sign-in" />}
            </Route>
          </Switch>
        </div>
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          avatarRef={avatarRef}
          isLoading={isLoading}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
          isLoading={isLoading}
        />
        <DeletePopup
          isOpen={isDeletePopupOpen}
          onClose={closeAllPopups}
          onDelete={handleCardDelete}
          card={cardForDelete}
          isLoading={isLoading}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip
          onClose={closeAllPopups}
          register={infoTooltipPopupOpen}
          isSuccsess={isSuccsess}
        />
      </AppContext.Provider>
    </CurrentUserContext.Provider>
  );
};

export default App;
