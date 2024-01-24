import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { number, object, string } from "yup";
import { createFAQ } from "./FAQService";
import { useLoadingSpinner } from "../../utils/components/LoadingSpinnerProvider";

const schema = object().shape({
  id: number().notRequired(),
  category: string().required("Category is required"),
  question: string().required("Question is required"),
  answer: string().required("Answer is required"),
  moreDetail: string(),
});

/**
 * Renders a form for creating or updating a FAQ.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.faqToEdit - The FAQ object to edit (optional).
 * @param {boolean} [props.isUpdating=false] - Indicates whether the form is for updating an existing FAQ.
 * @param {function} props.setState - The function to update the state of the parent component.
 * @param {function} props.toggleModal - The function to toggle the visibility of the modal.
 * @param {function} props.updateFAQ - The function to update a FAQ (optional).
 * @returns {JSX.Element} The FAQForm component.
 */
const FAQForm = (props) => {
  const {
    faqToEdit,
    isUpdating = false,
    setState,
    toggleModal,
    updateFAQ,
  } = props;
  const [apiError, setApiError] = useState(false);
  const setIsLoading = useLoadingSpinner();
  const {
    clearErrors,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: faqToEdit?.id ?? null,
      category: faqToEdit?.category ?? "",
      question: faqToEdit?.question ?? "",
      answer: faqToEdit?.answer ?? "",
      moreDetail: faqToEdit?.moreDetail ?? "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    if (isUpdating) {
      await updateFAQ(data, setApiError, setState, setIsLoading);
    } else {
      await createFAQ(data, setApiError, setIsLoading);
    }

    !apiError && reset();
    toggleModal !== undefined && !apiError && toggleModal(false);
  };

  const handleCancel = () => {
    clearErrors();
    reset();
    toggleModal !== undefined && toggleModal(false);
  };

  return (
    <div className="bg-gray-200 mx-auto">
      <div className="flex flex-col justify-between items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded shadow-md w-full"
        >
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <input
              name="category"
              type="text"
              {...register("category")}
              className="p-2 border rounded w-full"
              placeholder="Enter category"
            />
            <p className="text-red-500 text-xs mt-1 italic">
              {errors.category?.message}
            </p>
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="question"
            >
              Question
            </label>
            <input
              name="question"
              type="text"
              {...register("question")}
              className="p-2 border rounded w-full"
              placeholder="Enter question"
            />
            <span className="text-red-500 text-xs mt-1 italic">
              {errors.question?.message}
            </span>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="answer">
              Answer
            </label>
            <textarea
              name="answer"
              {...register("answer")}
              className="p-2 border rounded w-full"
              placeholder="Enter answer"
            ></textarea>
            <span className="text-red-500 text-xs mt-1 italic">
              {errors.answer?.message}
            </span>
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="moreDetail"
            >
              More Details (optional)
            </label>
            <textarea
              name="moreDetail"
              rows={4}
              {...register("moreDetail")}
              className="p-2 border rounded w-full"
              placeholder="Additional details"
            ></textarea>
            <span className="text-red-500 text-xs mt-1 italic">
              {errors.moreDetail?.message}
            </span>
          </div>
          <div className="flex flex-row justify-between my-8">
            <button
              className="w-1/3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FAQForm;
