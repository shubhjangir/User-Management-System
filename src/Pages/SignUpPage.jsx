import React from "react";
import { useState } from "react";

const SignUpPage = () => {
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
            onChange={handleChange}
            value={formData.firstName}
            required
          />

          <label htmlFor="middleName">Middle Name </label>
          <input
            id="middleName"
            type="text"
            name="middleName"
            onChange={handleChange}
            value={formData.middleName}
          />

          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            onChange={handleChange}
            value={formData.lastName}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            required
          />

          <label htmlFor="mobile">Mobile Number</label>
          <input
            id="mobile"
            type="tel"
            name="mobile"
            onChange={handleChange}
            value={formData.mobile}
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
          <input
            id="pincode"
            type="text"
            name="pincode"
            onChange={handleChange}
            value={formData.pincode}
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
