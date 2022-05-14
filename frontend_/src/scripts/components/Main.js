import React from "react";
import editIcon from "../../images/edit__button.svg";
import addIcon from "../../images/add_button.svg";
import Card from "./Card";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import Footer from "./Footer";


function Main({
  onEditProfile,
  onEditAvatar,
  onAddPlace,
  onCardClick,
  onCardLike,
  onCardDelete,
  cards,
  onDelete,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <>
      <main className="content">
        <section className="profile page__profile">
          <div className="profile__avatar-container" onClick={onEditAvatar}>
            <img
              className="profile__avatar"
              src={currentUser.avatar}
              alt={currentUser?.name ?? " "}
            />
          </div>
          <div className="profile__info">
            <h1 className="profile__title">{currentUser?.name ?? " "}</h1>
            <p className="profile__subtitle">{currentUser?.about ?? " "}</p>
            <button
              type="button"
              className="profile__edit-button"
              onClick={onEditProfile}
            >
              <img
                className="profile__edit-icon"
                src={editIcon}
                alt="Иконка редактирования"
              />
            </button>
          </div>
          <button
            type="button"
            className="profile__add-button"
            onClick={onAddPlace}
          >
            <img
              className="profile__add-icon"
              src={addIcon}
              alt="Кнопка добавить"
            />
          </button>
        </section>
        <section
          className="elements page__elements"
          aria-label="Блок с карточками"
        >
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onDelete={onDelete}
              onCardDelete={onCardDelete}
            />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Main;
