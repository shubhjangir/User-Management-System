import { useState, useCallback } from "react";

/**
 * Custom hook for form management.
 * @param {Object} initialValues - Initial state for the form.
 * @param {boolean} validateOnChange - whether to run validation on change
 * @param {Function} validate - Validation function that returns errors object
 * @returns {Object} { values, errors, handleChange, handleBlur, handleSubmit, setValues, setErrors, resetForm }
 */
export const useForm = (
  initialValues,
  validateOnChange = false,
  validate = () => ({}),
) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      if (validateOnChange) {
        const validationErrors = validate({ ...values, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
      }
    },
    [validateOnChange, validate, values],
  );

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      const validationErrors = validate(values);
      setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
    },
    [validate, values],
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    handleChange,
    handleBlur,
    setValues,
    setErrors,
    resetForm,
  };
};
