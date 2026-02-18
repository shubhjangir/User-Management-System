import React, { forwardRef } from "react";

const FormInput = forwardRef(
  (
    {
      label,
      id,
      type = "text",
      name,
      value,
      onChange,
      onBlur,
      placeholder,
      required = false,
      disabled = false,
      error,
      as = "input", // 'input' or 'textarea'
      className = "",
      ...props
    },
    ref,
  ) => {
    const Component = as;

    return (
      <div className={`form-group ${className}`}>
        {label && (
          <label htmlFor={id}>
            {label} {required && "*"}
          </label>
        )}
        <Component
          ref={ref}
          id={id}
          type={as === "input" ? type : undefined}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`${error ? "error-border" : ""} ${
            !error && value && required ? "success-border" : ""
          }`}
          {...props}
        />
        {error && (
          <span className="error-msg" style={{ color: "red" }}>
            {error}
          </span>
        )}
      </div>
    );
  },
);

export default FormInput;
