import React from "react";
import PopupWithForm from "./PopupWithForm";

function DeletePopup({ isOpen, onClose, onDelete, card, isLoading }) {

  function handleSubmit(e) {
    e.preventDefault();

    onDelete(card)
  }


  return (
    <PopupWithForm
    onClose={onClose}
    isOpen={isOpen}
    name="submit"
    title="Вы уверены?"
    submit="Да"
    onSubmit={handleSubmit}
    isLoading={isLoading}
    loading="Удаление..." />
  );
}

export default DeletePopup;
