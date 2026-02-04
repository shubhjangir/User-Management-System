// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useParams, useSearchParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Users from "../../users.json";

// const ViewAndEdit = () => {
//   const navigate = useNavigate();
//   // reading data from url
//   const { id } = useParams(); //user id
//   const [searchParams] = useSearchParams(); //view and edit mode
//   const isEdit = searchParams.get("isedit") === "true"; //form control

//   //const users = JSON.parse(localStorage.getItem("users")) || Users;

//   //Load User from JSON
//   const user = users.find((u) => u.id === Number(id));
//   //safety check
//   if (!user) {
//     return <h1>User Not Found</h1>;
//   }

//   //1) STATE FIRST
//   // creating form state (main thing)

//   const [formData, setFormData] = useState(null);

//   //2) DATA INITIALIZATION EFFECT
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         firstName: user.name.split(" ")[0],
//         middleName: user.name.split(" ")[1] || "",
//         lastName: user.name.split(" ")[2] || "",
//         email: user.email,
//         mobile: user.mobile,
//         address1: user.address1,
//         address2: user.address2,
//         address3: user.address3,
//         pincode: user.pincode,
//         photo: user.photo,
//       });
//     }
//   }, [user]);

//   //3) CLEANUP STATE
//   // handling the image handler
//   useEffect(() => {
//     return () => {
//       if (formData?.photo?.startsWith("blob:")) {
//         URL.revokeObjectURL(formData.photo);
//       }
//     };
//   }, [formData?.photo]);

//   //4) LOADING GAURD
//   // just to be in safe side

//   if (!formData) {
//     return <h1>Loading user Data...</h1>;
//   }

//   // handling change
//   function handleChange(e) {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }

//   // updating the changement in local strogae
//   function handleSubmit(e) {
//     e.preventDefault();

//     const updatedUsers = users.map((u) =>
//       u.id === Number(id)
//         ? {
//             ...u,
//             name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`
//               .replace(/\s+/g, " ")
//               .trim(),
//             email: formData.email,
//             mobile: formData.mobile,
//             address1: formData.address1,
//             address2: formData.address2,
//             address3: formData.address3,
//             pincode: formData.pincode,
//             photo: formData.photo,
//           }
//         : u,
//     );

//     localStorage.setItem("users", JSON.stringify(updatedUsers));

//     alert("User updated successfully!");
//     navigate("/users");
//   }

//   return (
//     <div className="SignUpPage">
//       <h1>{isEdit ? "Edit User " : "View User"}</h1>
//       <div className="form">
//         <h2>You can View and Edit the Details.</h2>
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="firstName">First Name</label>
//           <input
//             id="firstName"
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             required={isEdit}
//             disabled={!isEdit}
//           />

//           <label htmlFor="middleName">Middle Name </label>
//           <input
//             id="middleName"
//             type="text"
//             name="middleName"
//             value={formData.middleName}
//             onChange={handleChange}
//             disabled={!isEdit}
//           />

//           <label htmlFor="lastName">Last Name</label>
//           <input
//             id="lastName"
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             required={isEdit}
//             disabled={!isEdit}
//           />

//           <label htmlFor="email">Email</label>
//           <input
//             id="email"
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             disabled={!isEdit}
//             required={isEdit}
//           />

//           <label htmlFor="contact">Mobile Number</label>
//           <input
//             id="contact"
//             type="tel"
//             name="mobile"
//             value={formData.mobile}
//             onChange={handleChange}
//             disabled={!isEdit}
//             required={isEdit}
//           />

//           <label htmlFor="addressLine1">Address Line 1</label>
//           <textarea
//             id="addressLine1"
//             name="address1"
//             value={formData.address1}
//             onChange={handleChange}
//             disabled={!isEdit}
//             required={isEdit}
//           />

//           <label htmlFor="addressLine2">Address Line 2</label>
//           <textarea
//             id="addressLine2"
//             name="address2"
//             required
//             value={formData.address2}
//             onChange={handleChange}
//             disabled={!isEdit}
//           />

//           <label htmlFor="addressLine3">Address Line 3</label>
//           <textarea
//             id="addressLine3"
//             name="address3"
//             required={isEdit}
//             onChange={handleChange}
//             value={formData.address3}
//             disabled={!isEdit}
//           />

//           <label htmlFor="pincode">Pincode</label>
//           <input
//             id="pincode"
//             type="number"
//             name="pincode"
//             required
//             value={formData.pincode}
//             onChange={handleChange}
//             disabled={!isEdit}
//           />

//           <label htmlFor="profilePhoto">Photo</label>
//           <input
//             id="profilePhoto"
//             type="file"
//             name="photo"
//             disabled={!isEdit}
//             onChange={(e) => {
//               const file = e.target.files[0];
//               if (!file) return;

//               const previewUrl = URL.createObjectURL(file);

//               setFormData((prev) => ({
//                 ...prev,
//                 photo: previewUrl,
//               }));
//             }}
//           />

//           {isEdit && <button type="submit">Update</button>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ViewAndEdit;

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Users from "../../users.json";

const ViewAndEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const isEdit = searchParams.get("isedit") === "true";

  // STABLE users source (no recreation on every render) - suggested by chatGPT
  const users = useMemo(() => {
    return JSON.parse(localStorage.getItem("users")) || Users;
  }, []);

  // review later ( effective user ) - for checking the user very first
  const user = useMemo(() => {
    return users.find((u) => u.id === Number(id));
  }, [users, id]);

  // Safety check
  if (!user) {
    return <h1>User Not Found</h1>;
  }

  // data state
  const [formData, setFormData] = useState(null);

  // initializing the state , data init
  useEffect(() => {
    setFormData({
      firstName: user.name.split(" ")[0] || "",
      middleName: user.name.split(" ")[1] || "",
      lastName: user.name.split(" ")[2] || "",
      email: user.email,
      mobile: user.mobile,
      address1: user.address1,
      address2: user.address2,
      address3: user.address3,
      pincode: user.pincode,
      photo: user.photo,
    });
  }, [user]);

  // url for the photo ( review later )
  useEffect(() => {
    return () => {
      if (formData?.photo?.startsWith("blob:")) {
        URL.revokeObjectURL(formData.photo);
      }
    };
  }, [formData?.photo]);

  // ⏳ Loading guard
  if (!formData) {
    return <h1>Loading user data...</h1>;
  }

  // handling the input for editable user
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // updating the user data
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUsers = users.map((u) =>
      u.id === Number(id)
        ? {
            ...u,
            name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`
              .replace(/\s+/g, " ")
              .trim(),
            email: formData.email,
            mobile: formData.mobile,
            address1: formData.address1,
            address2: formData.address2,
            address3: formData.address3,
            pincode: formData.pincode,
            photo: formData.photo,
          }
        : u,
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert("User updated successfully!");
    navigate("/users");
  };

  return (
    <div className="SignUpPage">
      <h1>{isEdit ? "Edit User" : "View User"}</h1>

      <div className="form">
        <form onSubmit={handleSubmit}>
          <label>First Name</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={!isEdit}
            required
          />

          <label>Middle Name</label>
          <input
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            disabled={!isEdit}
          />

          <label>Last Name</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEdit}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEdit}
            required
          />

          <label>Mobile</label>
          <input
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            disabled={!isEdit}
            required
          />

          <label>Address Line 1</label>
          <textarea
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            disabled={!isEdit}
          />

          <label>Address Line 2</label>
          <textarea
            name="address2"
            value={formData.address2}
            onChange={handleChange}
            disabled={!isEdit}
          />

          <label>Address Line 3</label>
          <textarea
            name="address3"
            value={formData.address3}
            onChange={handleChange}
            disabled={!isEdit}
          />

          <label>Pincode</label>
          <input
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            disabled={!isEdit}
          />

          <label>Photo</label>
          <input
            type="file"
            disabled={!isEdit}
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              const preview = URL.createObjectURL(file);
              setFormData((prev) => ({
                ...prev,
                photo: preview,
              }));
            }}
          />

          {formData.photo && (
            <img
              src={formData.photo}
              alt="preview"
              width="120"
              style={{ marginTop: "10px" }}
            />
          )}

          {isEdit && <button type="submit">Update</button>}
        </form>
      </div>
    </div>
  );
};

export default ViewAndEdit;
