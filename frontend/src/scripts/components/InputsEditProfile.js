function InputsEditProfile( {onChangeName, onChangeDescription, name, description} ) {
  return(
    <>
      <input
        className="popup__input popup__input_profile_name"
        placeholder ="Имя"
        type="text"
        name="name"
        required
        minLength="2"
        maxLength="40"
        id="name-card"
        onChange={onChangeName}
        value={name || ''}
      />
      <span id="name-card-error" className="popup__error"></span>
      <input
        className="popup__input popup__input_profile_job"
        placeholder ="Вид деятельности"
        type="text"
        name="about"
        required
        minLength="2"
        maxLength="200"
        id="job-card"
        onChange={onChangeDescription}
        value={description || ''}
      />
      <span id="job-card-error" className="popup__error"></span>
    </>
  )
}

export default InputsEditProfile;
