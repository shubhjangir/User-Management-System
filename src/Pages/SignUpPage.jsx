import React from "react";

const SignUpPage = () => {
  function handleSubmit(e) {
    e.preventDefault();
    console.log("form is submitted!");
  }

  return (
    <div className="SignUpPage">
      <h1>SignUp Page</h1>

      <div className="form">
        <h2>Fill the details to singup</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" type="text" name="firstName" required />

          <label htmlFor="middleName">Middle Name </label>
          <input id="middleName" type="text" name="middleName" />

          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" type="text" name="lastName" required />

          <label htmlFor="email">Emal</label>
          <input id="email" type="email" name="email" required />

          <label htmlFor="contact">Mobile Number</label>
          <input id="contact" type="tel" name="mobileNumber" required />

          <label htmlFor="addressLine1">Address Line 1</label>
          <textarea
            id="addressLine1"
            type="textarea"
            name="addressLine1"
            required
          />

          <label htmlFor="addressLine2">Address Line 2</label>
          <textarea
            id="addressLine2"
            type="textarea"
            name="addressLine2"
            required
          />

          <label htmlFor="addressLine3">Address Line 3</label>
          <textarea
            id="addressLine3"
            type="textarea"
            name="addressLine3"
            required
          />

          <label htmlFor="pincode">Pincode</label>
          <input id="pincode" type="number" name="pincode" required />

          <label htmlFor="profilePhoto">Photo</label>
          <input id="profilePhoto" type="file" name="profilePhoto" required />
        </form>
        <button type="submit">Create Account</button>
      </div>
    </div>
  );
};

export default SignUpPage;
