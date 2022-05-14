import React from "react";
import InputsEditProfile from "./InputsEditProfile";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from '../../contexts/CurrentUserContext';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  // Подписка на контекст
  const currentUser = React.useContext(CurrentUserContext);

  // После загрузки текущего пользователя из API
  // его данные будут использованы в управляемых компонентах.
  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      onClose={onClose}
      isOpen={isOpen}
      name="edit"
      title="Редактировать профиль"
      submit="Сохранить"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      loading="Сохранение..."
    >
      <InputsEditProfile
        onChangeName={handleChangeName}
        onChangeDescription={handleChangeDescription}
        name={name}
        description={description}
      />
    </PopupWithForm>
  );
}

export default EditProfilePopup;
