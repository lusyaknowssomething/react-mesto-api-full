import React from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete, onDelete }) {
  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = card.owner._id === currentUser._id;

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = `element__delete ${
    isOwn ? "element__delete_visible" : "element__delete_hidden"
  }`;

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
const isLiked = card.likes.some(i => i._id === currentUser._id);

// Создаём переменную, которую после зададим в `className` для кнопки лайка
const cardLikeButtonClassName = `element__like ${
  isLiked ? "element__like_active" : ""
}`;

  function handleCardClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onDelete();
    onCardDelete(card);

  }

  return (
    <article className="element">
      <div className="element__pic-container">
        <img
          src={card.link}
          onClick={handleCardClick}
          alt={card.name}
          className="element__picture"
        />
      </div>
      <h2 className="element__title">{card.name}</h2>
      <div className="element__like-container">
        <button
          type="button"
          className={cardLikeButtonClassName}
          onClick={handleLikeClick}
        >
        </button>
        <p className="element__like-number">{card.likes.length}</p>
      </div>
      <button
        type="button"
        className={cardDeleteButtonClassName}
        onClick={handleDeleteClick}
      ></button>
    </article>
  );
}

export default Card;
