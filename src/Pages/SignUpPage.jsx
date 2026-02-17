import React from "react";
import { useState, useRef } from "react";
import { isEmail, isMobile, isName, isPincode } from "../utils/validation";
import { NotebookPen } from "lucide-react";

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

    //extra layer for mobile
    if (name === "mobile") {
      const onlyDigits = value.replace(/\D/g, "");
      setFormData({ ...formData, mobile: onlyDigits });
      return;
    }

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

    const value = enteredMobile.current.value.trim();
    // mandatory check
    if (!value) {
      setMobileStatus({
        message: "Mobile Number is mandatory",
        color: "red",
      });
      enteredMobile.current.style.borderColor = "red";
      return;
    }

    //format check

    if (!isMobile(value)) {
      console.log(mobileStatus.message, enteredMobile.current.value);
      setMobileStatus({ message: "Mobile Number is invalid ", color: "red" });
      enteredMobile.current.style.borderColor = "red";
      return;
    }

    //valid case

    console.log(mobileStatus.message, enteredMobile.current.value);
    setMobileStatus({ message: "", color: "green" });
    enteredMobile.current.style.borderColor = "green";
  }

  //handling first name validation - step by step

  function handleFirstNameValidation() {
    console.log("handle first Name Validation");

    //step 1 = getting the trimmed value
    const value = enteredFirstName.current.value.trim().replace(/\s+/g, " ");
    //enteredFirstName.current.value = value;

    //updating the form data for putting the new value to the input field

    //step2 :update cleaned value back to input
    setFormData((prev) => ({
      ...prev,
      firstName: value,
    }));

    //checking empty first
    if (!value) {
      setFirstNameStatus({
        message: "First Name is Mandatory",
        color: "red",
      });
      return;
    }

    //then checking validity
    if (!isName(value)) {
      setFirstNameStatus({
        message: "please enter valid name ",
        color: "red",
      });
      enteredFirstName.current.style.borderColor = "red";
      return;
    }

    /*
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
    */

    //if every thing is fine
    setFirstNameStatus({
      message: "",
      color: "green",
    });
    enteredFirstName.current.style.borderColor = "green";
    console.log(value);
  }

  function handleLastNameValidation() {
    console.log("handle Last Name Validation");

    const value = enteredLastName.current.value.trim().replace(/\s+/g, " ");

    // setting up the lastName to put it into input field
    setFormData((prev) => ({
      ...prev,
      lastName: value,
    }));

    // checking empty first

    if (!value) {
      setLastNameStatus({
        message: "Last Name is mandatory",
        color: "red",
      });
      return;
    }

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
    console.log(value);
  }

  function handleMiddleNameValidation() {
    console.log("Handle Middle Name Validation");
  }

  function handlePincodeValidation() {
    console.log("handle Pincode validation");
    const value = enteredPincode.current.value.trim();

    setFormData((prev) => ({
      ...prev,
      pincode: value,
    }));

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
    console.log(value);
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
          {firstNameStatus.message && (
            <p style={{ color: firstNameStatus.color, marginTop: 0 }}>
              {firstNameStatus.message}
            </p>
          )}

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
          {lastNameStatus.message && (
            <p style={{ color: lastNameStatus.color, marginTop: 0 }}>
              {lastNameStatus.message}
            </p>
          )}

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
            <p style={{ color: emailStatus.color, marginTop: 0 }}>
              {emailStatus.message}
            </p>
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
            maxLength={10}
            pattern="[6-9]{1}[0-9]*"
            inputMode="numeric"
            required
          />
          {mobileStatus.message && (
            <p style={{ color: mobileStatus.color, marginTop: 0 }}>
              {mobileStatus.message}
            </p>
          )}

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
          {pincodeStatus.message && (
            <p style={{ color: pincodeStatus.color, marginTop: 0 }}>
              {pincodeStatus.message}
            </p>
          )}

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
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              // Correct allowed types
              const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
              if (!allowedTypes.includes(file.type)) {
                alert("Only PNG , JPG and JPEG files can be uploaded");
                e.target.value = "";
                return;
              }

              /* // //validate file type
                if (!file.type.startsWith("image/")) {
                  alert("Only image files are allowed!");
                  e.target.value = ""; //clear the input
                  return;
                }*/

              //validation of file extensions

              const allowedExtensions = ["png", "jpeg", "jpg"];
              const fileExtension = file.name.split(".").pop().toLowerCase();
              if (!allowedExtensions.includes(fileExtension)) {
                alert("Invalid file extension. Only PNG, JPEG, JPG allowed.");
                e.target.value = "";
                return;
              }

              // 5MB size limit
              const maxSize = 5 * 1024 * 1024;
              if (file.size > maxSize) {
                alert("File size must be less than 5MB");
                e.target.value = "";
                return;
              }

              // const reader = new FileReader();
              // reader.onloadend = () => {
              //   setFormData((prev) => ({
              //     ...prev,
              //     photo: reader.result,
              //   }));
              // };
              // reader.readAsDataURL(file);

              const imageUrl = URL.createObjectURL(file);
              setFormData((prev) => ({
                ...prev,
                photo: imageUrl,
                preview: imageUrl,
              }));
            }}
            required
            name="photo"
            id="photo"
          />
          {formData.photo && (
            <div style={{ marginTop: "1rem" }}>
              <img
                src={formData.photo}
                alt="Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "5%",
                }}
              />
            </div>
          )}
          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
