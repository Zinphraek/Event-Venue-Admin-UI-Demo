import { useState } from "react";

/**
 * Custom hook to manage data input and errors.
 * @param {Function} fieldValidatorFunction
 * @param {any} initialState The initial value.
 * @returns
 */
const UseInput = (fieldValidatorFunction, initialState = "") => {
	const [enteredValue, setEnteredValue] = useState(initialState);
	const [isFieldTouched, setIsFieldTouched] = useState(false);

	const isValueValid = fieldValidatorFunction(enteredValue);
	const hasError = !isValueValid && isFieldTouched;

	const valueChangeHandler = (event) => setEnteredValue(event.target.value);

	const handleFileUpload = (event) => setEnteredValue(event.target.files[0]);

	const handleFilesUpload = (event) => setEnteredValue(event.target.files);

	const listValueChangeHandler = (newList) => setEnteredValue(newList);

	const handleBooleanValue = () => setEnteredValue((prev) => !prev);

	const inputBlurHandler = (event) => setIsFieldTouched(true);

	const setValue = (value) => setEnteredValue(value);

	const resetField = () => {
		setEnteredValue(initialState);
		setIsFieldTouched(false);
	};

	return {
		value: enteredValue,
		isValueValid,
		hasError,
		listValueChangeHandler,
		handleBooleanValue,
		valueChangeHandler,
		handleFilesUpload,
		handleFileUpload,
		inputBlurHandler,
		resetField,
		setValue,
	};
};

export default UseInput;
