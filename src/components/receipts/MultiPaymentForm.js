import React from "react";
import PropTypes from "prop-types";
import Constants from "../../utils/constants/Constants";

const MultiPaymentForm = ({
  addPayment,
  amountChangeHandler,
  control,
  Controller,
  errors,
  fields,
  register,
  methods,
  removePayment,
}) => {
  const PAYMENT_METHODS = Object.values(Constants.PAYMENT_METHODS).sort();
  PAYMENT_METHODS.splice(
    PAYMENT_METHODS.indexOf(Constants.PAYMENT_METHODS.other),
    1
  );
  const PaymentError = ({ errors, index, field }) => {
    if (
      errors.payments &&
      errors.payments[index] &&
      errors.payments[index][field]
    ) {
      return (
        <span className="text-red-500 text-sm">
          {errors.payments[index][field].message}
        </span>
      );
    }
    return null;
  };
  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id} className="border p-4 rounded space-y-3 space-x-2">
          <Controller
            name={`payments[${index}].method`}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <>
                <select
                  {...register(`payments[${index}].method`)}
                  className={`mt-1 block w-full py-1 px-1 border border-gray-300 rounded-md ${
                    errors.payments &&
                    errors.payments[index] &&
                    errors.payments[index][field]
                      ? " border-red-500"
                      : ""
                  }`}
                >
                  <option value="">Select payment method</option>
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                  <option value={Constants.PAYMENT_METHODS.other}>Other</option>
                </select>
                <PaymentError errors={errors} index={index} field="method" />

                {methods[index].method === Constants.PAYMENT_METHODS.card && (
                  <>
                    <input
                      {...register(`payments[${index}].cardLastFour`)}
                      placeholder="Last 4 Digits of Card"
                      maxLength={4}
                      className={`mt-1 block w-full py-1 px-1 border border-gray-300 rounded-md ${
                        errors.payments &&
                        errors.payments[index] &&
                        errors.payments[index][field]
                          ? " border-red-500"
                          : ""
                      }`}
                    />
                    <PaymentError
                      errors={errors}
                      index={index}
                      field="cardLastFour"
                    />
                  </>
                )}

                {methods[index].method === Constants.PAYMENT_METHODS.other && (
                  <>
                    <input
                      {...register(`payments[${index}].otherDetails`)}
                      placeholder="Specify Payment Method"
                      className={`mt-1 block w-full py-1 px-1 border border-gray-300 rounded-md ${
                        errors.payments &&
                        errors.payments[index] &&
                        errors.payments[index][field]
                          ? " border-red-500"
                          : ""
                      }`}
                    />
                    <PaymentError
                      errors={errors}
                      index={index}
                      field="otherDetails"
                    />
                  </>
                )}
              </>
            )}
          />

          <Controller
            name="amount"
            control={control}
            render={({ field: { onChange, value } }) => (
              <input
                className={`mt-1 block w-full py-1 px-1 border border-gray-300 rounded-md ${
                  errors.payments &&
                  errors.payments[index] &&
                  errors.payments[index][field]
                    ? " border-red-500"
                    : ""
                }`}
                onChange={(e) => amountChangeHandler(onChange)(e, index)}
                placeholder="Amount"
                type="number"
                step={0.01}
              />
            )}
          />
          <PaymentError errors={errors} index={index} field="amount" />

          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => removePayment(index)}
              className="text-red-500"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addPayment}
        className="text-blue-500 py-2 px-4 rounded border-blue-500 border"
      >
        Add Another Payment Method
      </button>
    </>
  );
};

MultiPaymentForm.propTypes = {
  addPayment: PropTypes.func.isRequired,
  amountChangeHandler: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  Controller: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  methods: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  removePayment: PropTypes.func.isRequired,
};

export default MultiPaymentForm;
