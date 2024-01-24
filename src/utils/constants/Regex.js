module.exports = Object.freeze({
  EMAIL_REGEX: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  PHONE_REGEX: /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/,
  ONLY_ALPHABETIC_CHARACTERS: /^[a-z]+$/i,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  BIRTH_DATE: /^\d{2}-\d{2}-\d{4}$/,
  DATE_INPUT: /^\d{2}\/\d{2}\/\d{4}$/,
});
