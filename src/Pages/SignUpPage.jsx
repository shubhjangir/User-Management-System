import React, { useState, useRef } from "react";
import { isEmail, isMobile, isName, isPincode } from "../utils/validation";
import { User, Mail, MapPin, Upload } from "lucide-react";
import "./SignUpPage.css";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();

  // ... (keeping existing state logic same)
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

  const [address1Status, setAddress1Status] = useState({
    message: "",
    color: "",
  });

  const [address3Status, setAddress3Status] = useState({
    message: "",
    color: "",
  });

  // using useRef() to get the particular field
  const enteredEmail = useRef();
  const enteredMobile = useRef();
  const enteredFirstName = useRef();
  const enteredMiddleName = useRef();
  const enteredLastName = useRef();
  const enteredPincode = useRef();
  const enteredAddress1 = useRef();
  const enteredAddress3 = useRef();

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
    preview: "", // Added preview to state for consistency
  });

  //Universal change handler
  function handleChange(e) {
    const { name, value } = e.target; // extracting the target element name and value

    //extra layer for mobile
    if (name === "mobile") {
      const onlyDigits = value.replace(/\D/g, "");

      // Ensure the number starts with 6, 7, 8, or 9
      if (onlyDigits.length > 0 && !/^[6-9]/.test(onlyDigits)) {
        return;
      }

      setFormData((prev) => ({ ...prev, mobile: onlyDigits }));
      return;
    }

    //extra layer for name

    if (["firstName", "middleName", "lastName"].includes(name)) {
      const onlyLetters = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: onlyLetters,
      }));
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

    if (!enteredEmail.current.value) {
      setEmailStatus({
        message: "Email is mandatory",
        color: "red",
      });
      return;
    }

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
      setMobileStatus({ message: "Mobile Number is mandatory", color: "red" });
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
      setLastNameStatus({ message: "", color: "green" });
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
    enteredMiddleName.current.placeholder = "";
  }

  function handleAddress1Validation() {
    const value = enteredAddress1.current.value.trim();
    //const value = formData.address1.trim();
    let borderCLR = "";
    if (!value) {
      setAddress1Status({
        message: "Address Line 1 is mandatory",
        color: "red",
      });
      borderCLR = "red";
    } else {
      setAddress1Status({ message: "", color: "green" });
      borderCLR = "green";
    }
    enteredAddress1.current.style.borderColor = borderCLR;
  }

  function handleAddress3Validation() {
    const value = enteredAddress3.current.value.trim();
    //const value = formData.address3.trim();
    let borderCLR = "";
    if (!value) {
      setAddress3Status({
        message: "Address Line 3 is mandatory",
        color: "red",
      });
      // enteredAddress3.current.style.borderColor = "red";
      borderCLR = "red";
    } else {
      setAddress3Status({ message: "", color: "green" });
      //enteredAddress3.current.style.borderColor = "green";
      borderCLR = "green";
    }
    enteredAddress3.current.style.borderColor = borderCLR;
  }

  function handlePincodeValidation() {
    console.log("handle Pincode validation");
    const value = enteredPincode.current.value.trim();

    setFormData((prev) => ({
      ...prev,
      pincode: value,
    }));

    if (!value) {
      setPincodeStatus({
        message: "Pincode is mandatory",
        color: "red",
      });
      enteredPincode.current.style.borderColor = "red";
      return;
    }

    if (isPincode(value)) {
      setPincodeStatus({
        message: "",
        color: "green",
      });
      enteredPincode.current.style.borderColor = "green";
    } else {
      setPincodeStatus({
        message: "Please enter valid pincode",
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
    // reseting the form
    setFormData({
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
      preview: "",
    });
    navigate("/users");
  }

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <h1 className="signup-title">Create Account</h1>
        <p className="signup-subtitle">Please fill in your details below</p>

        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Section 1: Personal Details */}
          <div className="form-section">
            <h3 className="section-title">
              <User size={20} /> Personal Details
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  ref={enteredFirstName}
                  onChange={handleChange}
                  onBlur={handleFirstNameValidation}
                  value={formData.firstName}
                  required
                  placeholder="John"
                />
                {firstNameStatus.message && (
                  <span
                    className="error-msg"
                    style={{ color: firstNameStatus.color }}
                  >
                    {firstNameStatus.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="middleName">Middle Name</label>
                <input
                  id="middleName"
                  type="text"
                  name="middleName"
                  ref={enteredMiddleName}
                  onChange={handleChange}
                  onBlur={handleMiddleNameValidation}
                  value={formData.middleName}
                  placeholder="Quincy"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  ref={enteredLastName}
                  onChange={handleChange}
                  onBlur={handleLastNameValidation}
                  value={formData.lastName}
                  required
                  placeholder="Doe"
                />
                {lastNameStatus.message && (
                  <span
                    className="error-msg"
                    style={{ color: lastNameStatus.color }}
                  >
                    {lastNameStatus.message}
                  </span>
                )}
              </div>
            </div>

            {/* Photo Upload in Personal Details */}
            <div
              className="form-group photo-upload-section"
              style={{ marginTop: "20px" }}
            >
              <label
                htmlFor="photo"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Upload size={18} /> Upload Profile Photo *
              </label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/png, image/jpeg, image/jpg"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
                  if (!allowedTypes.includes(file.type)) {
                    alert("Only PNG, JPG and JPEG files can be uploaded");
                    e.target.value = "";
                    return;
                  }

                  const maxSize = 5 * 1024 * 1024; // 5MB
                  if (file.size > maxSize) {
                    alert("File size must be less than 5MB");
                    e.target.value = "";
                    return;
                  }

                  const imageUrl = URL.createObjectURL(file);
                  setFormData((prev) => ({
                    ...prev,
                    photo: imageUrl,
                    preview: imageUrl,
                  }));
                }}
                required
                // style={{ display: 'none' }} // Optional: hide standard input if styling label as button
              />
              {formData.preview && (
                <img
                  src={formData.preview}
                  alt="Preview"
                  className="image-preview"
                />
              )}
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="form-section">
            <h3 className="section-title">
              <Mail size={20} /> Contact Information
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  ref={enteredEmail}
                  onChange={handleChange}
                  onBlur={handleEmailValidation}
                  value={formData.email}
                  required
                  placeholder="john.doe@example.com"
                />
                {emailStatus.message && (
                  <span
                    className="error-msg"
                    style={{ color: emailStatus.color }}
                  >
                    {emailStatus.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="mobile">Mobile Number *</label>
                <input
                  id="mobile"
                  type="tel"
                  name="mobile"
                  ref={enteredMobile}
                  onChange={handleChange}
                  onBlur={handleMobileValidation}
                  value={formData.mobile}
                  maxLength={10}
                  pattern="[6-9]{1}[0-9]*"
                  inputMode="numeric"
                  required
                  placeholder="9876543210"
                />
                {mobileStatus.message && (
                  <span
                    className="error-msg"
                    style={{ color: mobileStatus.color }}
                  >
                    {mobileStatus.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Address Details */}
          <div className="form-section">
            <h3 className="section-title">
              <MapPin size={20} /> Address Details
            </h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="address1">Address Line 1 *</label>
                <textarea
                  id="address1"
                  name="address1"
                  onChange={handleChange}
                  value={formData.address1}
                  required
                  placeholder="Street address, P.O. box, etc."
                  onBlur={handleAddress1Validation}
                  ref={enteredAddress1}
                />
                {address1Status.message && (
                  <span
                    className="error-msg"
                    style={{ color: address1Status.color }}
                  >
                    {address1Status.message}
                  </span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="address2">Address Line 2</label>
                <textarea
                  id="address2"
                  name="address2"
                  onChange={handleChange}
                  value={formData.address2}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="address3">Address Line 3 *</label>
                <textarea
                  id="address3"
                  name="address3"
                  onChange={handleChange}
                  value={formData.address3}
                  required
                  placeholder="Street address, Landmark, etc."
                  onBlur={handleAddress3Validation}
                  ref={enteredAddress3}
                />
                {address3Status.message && (
                  <span
                    className="error-msg"
                    style={{ color: address3Status.color }}
                  >
                    {address3Status.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  id="pincode"
                  type="text"
                  name="pincode"
                  onChange={handleChange}
                  onBlur={handlePincodeValidation}
                  value={formData.pincode}
                  ref={enteredPincode}
                  maxLength={6}
                  required
                  placeholder="123456"
                />
                {pincodeStatus.message && (
                  <span
                    className="error-msg"
                    style={{ color: pincodeStatus.color }}
                  >
                    {pincodeStatus.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
