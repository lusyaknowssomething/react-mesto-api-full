function InputsEditAvatar({avatarRef}) {
  return(
    <>
      <input
        className="popup__input popup__input_avatar"
        placeholder ="Ссылка на фото"
        type="url"
        name="link"
        required
        id="link-avatar"
        ref={avatarRef}
      />
      <span id="link-avatar-error" className="popup__error"></span>
    </>
  )
}

export default InputsEditAvatar;
