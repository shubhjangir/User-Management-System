import React from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../hooks/useUsers";
import UserForm from "../Components/Users/UserForm";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { addUser } = useUsers();

  const handleCreateSubmit = async (values) => {
    const fullName =
      `${values.firstName} ${values.middleName} ${values.lastName}`
        .replace(/\s+/g, " ")
        .trim();

    const newUser = {
      name: fullName,
      email: values.email,
      mobile: values.mobile,
      address1: values.address1,
      address2: values.address2,
      address3: values.address3,
      pincode: values.pincode,
      photoOriginal: values.photoOriginal,
      photoThumbnail: values.photoThumbnail,
    };

    await addUser(newUser);

    navigate("/newhomepage");
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <h1 className="signup-title">Create Account</h1>
        <p className="signup-subtitle">Please fill in your details below</p>

        <UserForm mode="create" onSubmit={handleCreateSubmit} />
      </div>
    </div>
  );
};

export default SignUpPage;
