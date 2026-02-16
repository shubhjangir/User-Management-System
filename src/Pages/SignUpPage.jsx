import React from "react";
import { useState, useRef } from "react";
import { isEmail, isMobile, isName, isPincode } from "../utils/validation";

const SignUpPage = () => {
  //setting the seperate state for error message
  const [emailStatus, setEmailStatus] = useState({ message: "", color: "" });

  const [mobileStatus, setMobileStatus] = useState({ message: "", color: "" });

  const [firstNameStatus, setFirstNameStatus] = useState({
    message: "",
    color: "",
  });

  const [middleNameStatus, setMiddleNameStatus] = useState({
    message: "",
    color: "",
  });

  const [lastNameStatus, setLastNameStatus] = useState({
    message: "",
    color: "",
  });

  const [pincodeStatus, setPincodeStatus] = useState({
    message: "",
    color: "",
  });

  // using useRef() to get the particular field
  // useRef returns a mutable ref object whose .current property is initialized to the passed argument (initialValue). The returned object will persist for the full lifetime of the component.

  //Note that useRef() is useful for more than the ref attribute. It’s handy for keeping any mutable value around similar to how you’d use instance fields in classes.
  const enteredEmail = useRef();
  const enteredMobile = useRef();
  const enteredFirstName = useRef();
  const enteredMiddleName = useRef();
  const enteredLastName = useRef();
  const enteredPincode = useRef();

  // Initialize state with keys matching the "name" attributes of input

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    mobile: "",
    address1: "",
    address2: "",
    address3: "",
    pincode: "",
    photo: "",
  });

  //Universal change handler
  function handleChange(e) {
    const { name, value } = e.target; // extracting the target element name and value
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    })); // forwarding the unchanged existing data and new field with value
  }

  // handling the user email entering step by step

  function handleEmailValidation() {
    // getting the value
    //const enteredEmail = useRef(null);
    if (isEmail(enteredEmail.current.value)) {
      console.log("email is valid", enteredEmail.current.value);
      setEmailStatus({
        message: "",
        color: "",
      });
      enteredEmail.current.style.borderColor = "green";
    } else {
      console.log("email is invalid", enteredEmail.current.value);
      setEmailStatus({
        message: "Entered email is invalid. Please Enter Valid Email.",
        color: "red",
      });
      enteredEmail.current.style.borderColor = "red";
    }
  }

  function handleMobileValidation() {
    console.log("handle mobile validation");

    if (isMobile(enteredMobile.current.value)) {
      console.log(mobileStatus.message, enteredMobile.current.value);
      setMobileStatus({ message: "Mobile Number is valid ", color: "green" });
      enteredMobile.current.style.borderColor = mobileStatus.color;
    } else {
      console.log(mobileStatus.message, enteredMobile.current.value);
      setMobileStatus({ message: "Mobile Number is invalid ", color: "red" });
      enteredMobile.current.style.borderColor = mobileStatus.color;
    }
  }

  function handleFirstNameValidation() {
    console.log("handle first Name Validation");
    const value = enteredFirstName.current.value;
    if (isName(value)) {
      setFirstNameStatus({
        message: "",
        color: "green",
      });
      enteredFirstName.current.style.borderColor = "green";
    } else {
      setFirstNameStatus({
        message: "please enter valid name ",
        color: "red",
      });
      enteredFirstName.current.style.borderColor = "red";
    }
    //enteredFirstName.current.style.borderColor = firstNameStatus.color;
  }

  function handleLastNameValidation() {
    console.log("handle Last Name Validation");

    const value = enteredLastName.current.value;
    if (isName(value)) {
      setLastNameStatus({
        message: "",
        color: "green",
      });
      enteredLastName.current.style.borderColor = "green";
    } else {
      setLastNameStatus({
        message: "please enter the valid name",
        color: "red",
      });
      enteredLastName.current.style.borderColor = "red";
    }
  }

  function handleMiddleNameValidation() {
    console.log("Handle Middle Name Validation");
  }

  function handlePincodeValidation() {
    console.log("handle Pincode validation");
    const value = enteredPincode.current.value;
    if (isPincode(value)) {
      setPincodeStatus({
        message: "",
        color: "green",
      });
      enteredPincode.current.style.borderColor = "green";
    } else {
      setPincodeStatus({
        message: "please enter valid pincode",
        color: "red",
      });
      enteredPincode.current.style.borderColor = "red";
    }
  }

  // in the handle submit function - unique id and combining the name - fullname = firstname + middlename + lastname

  function handleSubmit(e) {
    e.preventDefault();

    // creating the new id
    // allUsers -> existingUsers
    const allUsers = localStorage.getItem("users"); //  extracting the users stored in localStorage
    const users = allUsers ? JSON.parse(allUsers) : []; // JavaScript array of Objects
    const newId = users.length + 1; // adding to the last

    // combining the names to form fullName
    const fullName =
      `${formData.firstName} ${formData.middleName} ${formData.lastName}`
        .replace(/\s+/g, " ")
        .trim();

    //before storing the user , let's create the user fiels -

    const newUser = {
      id: newId,
      name: fullName,
      email: formData.email,
      mobile: formData.mobile,
      address1: formData.address1,
      address2: formData.address2,
      address3: formData.address3,
      pincode: formData.pincode,
      photo: formData.photo,
    };

    //adding new user to the localStorage
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("User is added successfully!!");
    console.log("the users data :", newUser);
  }

  return (
    <div className="SignUpPage">
      <h1>SignUp Page</h1>

      <div className="form">
        <h2>Fill the details to singup</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          {firstNameStatus.message && (
            <p style={{ color: firstNameStatus.color }}>
              {firstNameStatus.message}
            </p>
          )}
          <input
            id="firstName"
            type="text"
            name="firstName"
            ref={enteredFirstName}
            onChange={handleChange}
            onBlur={handleFirstNameValidation}
            value={formData.firstName}
            required
          />

          <label htmlFor="middleName">Middle Name </label>
          <input
            id="middleName"
            type="text"
            name="middleName"
            ref={enteredMiddleName}
            onChange={handleChange}
            onBlur={handleMiddleNameValidation}
            value={formData.middleName}
          />

          <label htmlFor="lastName">Last Name</label>
          {lastNameStatus.message && (
            <p style={{ color: lastNameStatus.color }}>
              {lastNameStatus.message}
            </p>
          )}
          <input
            id="lastName"
            type="text"
            name="lastName"
            ref={enteredLastName}
            onChange={handleChange}
            value={formData.lastName}
            onBlur={handleLastNameValidation}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            ref={enteredEmail}
            onChange={handleChange}
            value={formData.email}
            onBlur={handleEmailValidation}
            required
          />
          {emailStatus.message && (
            <p style={{ color: emailStatus.color }}>{emailStatus.message}</p>
          )}
          <label htmlFor="mobile">Mobile Number</label>
          <input
            id="mobile"
            type="tel"
            name="mobile"
            ref={enteredMobile}
            onChange={handleChange}
            value={formData.mobile}
            onBlur={handleMobileValidation}
            maxLength={12}
            required
          />

          <label htmlFor="addressLine1">Address Line 1</label>
          <textarea
            id="address1"
            type="textarea"
            name="address1"
            onChange={handleChange}
            value={formData.address1}
            required
          />

          <label htmlFor="addressLine2">Address Line 2</label>
          <textarea
            id="address2"
            type="textarea"
            name="address2"
            onChange={handleChange}
            value={formData.address2}
            required
          />

          <label htmlFor="addressLine3">Address Line 3</label>
          <textarea
            id="address3"
            type="textarea"
            name="address3"
            onChange={handleChange}
            value={formData.address3}
            required
          />

          <label htmlFor="pincode">Pincode</label>
          {pincodeStatus.message && (
            <p style={{ color: pincodeStatus.color }}>
              {pincodeStatus.message}
            </p>
          )}
          <input
            id="pincode"
            type="text"
            name="pincode"
            onChange={handleChange}
            value={formData.pincode}
            onBlur={handlePincodeValidation}
            ref={enteredPincode}
            maxLength={6}
            required
          />

          <label htmlFor="photo">Photo</label>
          {/* <input
            id="photo"
            type="file"
            name="photo"
            onChange={handleChange}
            required
          /> */}
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              const preview = URL.createObjectURL(file);
              setFormData((prev) => ({
                ...prev,
                photo: preview,
              }));
            }}
            required
            name="photo"
            id="photo"
          />
          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
