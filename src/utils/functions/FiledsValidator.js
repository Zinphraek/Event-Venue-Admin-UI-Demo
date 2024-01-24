import Regex from "../constants/Regex";
import Constants from "../constants/Constants";

const FiledsValidator = () => {
	const isNotRequired = (fieldValue) => true;
	const isNotEmpty = (fieldValue) => fieldValue.trim() !== "";
	const requestedAddOnsIsNotEmpty = (requestedAddOns) =>
		requestedAddOns.length > 0;
	const isNumberGreaterThanZero = (value) => +value >= 0;
	const isPriceNotGreaterThanZero = (fieldValue) => +fieldValue > 0;
	const isNotAValidEmail = (email) => Regex.EMAIL_REGEX.test(email);
	const isNotAValidPhoneNumber = (phone) => Regex.PHONE_REGEX.test(phone);
	const isNotAValidStatus = (fieldValue) =>
		[...Object.values(Constants.STATUS)].includes(fieldValue);
	const isNotAValidGender = (fieldValue) =>
		Constants.GENDERS.includes(fieldValue);
	const isNotAValidDate = (date) =>
		isNotEmpty(date) ? Regex.DATE.test(date) : true;
	const isNotAValidState = (state) =>
		isNotEmpty(state) ? Constants.STATES.includes(state) : true;
	const isNotAValidZipCode = (zipCode) =>
		isNotEmpty(zipCode) ? Regex.ZIP_CODE.test(zipCode) : true;
	const doesNotContaintOnlyAlphabeticCharacters = (fieldValue) =>
		Regex.ONLY_ALPHABETIC_CHARACTERS.test(fieldValue);
	const isNotAnImageOrVideo = (file) => {
		if (typeof file === "object") {
			return !file.type.includes("image/") || !file.type.includes("video/");
		}
		return false;
	};

	const areNoteImagesOrVideos = (files) => {
		const result = [];
		const filesList = [...files];
		typeof files === "object"
			? filesList.forEach((file) => result.push(isNotAnImageOrVideo(file)))
			: result.push(false);
		return result.includes(true);
	};

	return {
		isNotEmpty,
		isNotRequired,
		isNotAValidDate,
		isNotAValidEmail,
		isNotAValidState,
		isNotAValidStatus,
		isNotAValidGender,
		isNotAValidZipCode,
		isNotAnImageOrVideo,
		areNoteImagesOrVideos,
		isNotAValidPhoneNumber,
		isNumberGreaterThanZero,
		requestedAddOnsIsNotEmpty,
		isPriceNotGreaterThanZero,
		doesNotContaintOnlyAlphabeticCharacters,
	};
};

export default FiledsValidator;
