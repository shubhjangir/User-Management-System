import React from "react";

function ForgotPasswordPage() {
  function handleClick() {
    console.log("button clicked - generate Link");
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Forgot Password form is submitted!");
  }

  return (
    <div className="ForgotPasswordPage">
      <h1>ForgotPasswordPage</h1>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="registeredEmail">Enter the Email</label>
          <input
            id="registeredEmail"
            type="email"
            name="registeredEmail"
            placeholder="Enter the registered email address"
            required
          />

          <button type="button" onCLick={handleClick}>
            Generate Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
