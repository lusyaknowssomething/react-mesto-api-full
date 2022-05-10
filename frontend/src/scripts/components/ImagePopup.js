import React from "react";

function ImagePopup({card, onClose}) {
  return (
    <div className={`popup popup_type_image ${card && 'popup_opened'}`}>
      <div className="popup__container popup__container_type_image">
        <button type="button" className="popup__close" onClick={onClose}></button>
        <div className="popup__content">
          <img className="popup__picture" src={card ? card.link : ''} alt={card ? card.name : ''} />
          <p className="popup__name">{card ? card.name : ''}</p>
        </div>
      </div>
    </div>
  );
}

export default ImagePopup;
