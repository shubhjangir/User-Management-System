import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import FormInput from "../Components/FormInput";
import { compressImage } from "../utils/imageCompression";
import { useForm } from "../hooks/useForm";
import { useUsers } from "../hooks/useUsers";
import { validateUserForm } from "../utils/validation";

const ViewAndEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("isedit") === "true";

  const { getUserById, updateUser } = useUsers();
  const user = getUserById(id);

  const {
    values,
    errors,
    handleBlur,
    setValues,
  } = useForm(
    {
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
    },
    false,
    validateUserForm,
  );

  useEffect(() => {
    if (user) {
      setValues({
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
    }
  }, [user, setValues]);

  const photoPreviewUrl = useMemo(() => {
    if (!values.photo) return "";
    if (values.photo instanceof Blob || values.photo instanceof File) {
      return URL.createObjectURL(values.photo);
    }
    return values.photo;
  }, [values.photo]);

  useEffect(() => {
    if (photoPreviewUrl?.startsWith("blob:")) {
      return () => URL.revokeObjectURL(photoPreviewUrl);
    }
  }, [photoPreviewUrl]);

  // Safety check
  if (!user && !values.firstName) {
    return <h1>Loading or User Not Found...</h1>;
  }

  const handleCustomChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "mobile") {
      newValue = value.replace(/\D/g, "");
      if (newValue.length > 0 && !/^[6-9]/.test(newValue)) return;
    } else if (["firstName", "middleName", "lastName"].includes(name)) {
      newValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateUserForm(values);
    if (Object.keys(validationErrors).length > 0) {
      alert("Please fix the errors before submitting");
      return;
    }

    const updatedUser = {
      ...user,
      name: `${values.firstName} ${values.middleName} ${values.lastName}`
        .replace(/\s+/g, " ")
        .trim(),
      email: values.email,
      mobile: values.mobile,
      address1: values.address1,
      address2: values.address2,
      address3: values.address3,
      pincode: values.pincode,
      photo: values.photo,
    };

    updateUser(updatedUser);
    alert("User updated successfully!");
    navigate("/users");
  };

  return (
    <div className="SignUpPage">
      <h1>{isEdit ? "Edit User" : "View User"}</h1>

      <div className="form">
        <form onSubmit={onSubmit}>
          <FormInput
            label="First Name"
            name="firstName"
            value={values.firstName}
            onChange={handleCustomChange}
            onBlur={handleBlur}
            disabled={!isEdit}
            required
            error={isEdit ? errors.firstName : ""}
          />

          <FormInput
            label="Middle Name"
            name="middleName"
            value={values.middleName}
            onChange={handleCustomChange}
            onBlur={handleBlur}
            disabled={!isEdit}
          />

          <FormInput
            label="Last Name"
            name="lastName"
            value={values.lastName}
            onChange={handleCustomChange}
            onBlur={handleBlur}
            disabled={!isEdit}
            required
            error={isEdit ? errors.lastName : ""}
          />

          <FormInput
            label="Email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleCustomChange}
            onBlur={handleBlur}
            disabled={!isEdit}
            required
            error={isEdit ? errors.email : ""}
          />

          <FormInput
            label="Mobile"
            name="mobile"
            value={values.mobile}
            onChange={handleCustomChange}
            onBlur={handleBlur}
            disabled={!isEdit}
            required
            error={isEdit ? errors.mobile : ""}
          />

          <FormInput
            as="textarea"
            label="Address Line 1"
            name="address1"
            value={values.address1}
            onChange={handleCustomChange}
            onBlur={handleBlur}
            disabled={!isEdit}
            error={isEdit ? errors.address1 : ""}
          />

          <FormInput
            as="textarea"
            label="Address Line 2"
            name="address2"
            value={values.address2}
            onChange={handleCustomChange}
            disabled={!isEdit}
          />

          <FormInput
            as="textarea"
            label="Address Line 3"
            name="address3"
            value={values.address3}
            onChange={handleCustomChange}
            onBlur={handleBlur}
            disabled={!isEdit}
            error={isEdit ? errors.address3 : ""}
          />

          <FormInput
            label="Pincode"
            name="pincode"
            value={values.pincode}
            onChange={handleCustomChange}
            onBlur={handleBlur}
            disabled={!isEdit}
            error={isEdit ? errors.pincode : ""}
          />

          <div className="form-group">
            <label>Photo</label>
            <input
              type="file"
              disabled={!isEdit}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                compressImage(file)
                  .then((compressedBlob) => {
                    setValues((prev) => ({
                      ...prev,
                      photo: compressedBlob,
                    }));
                  })
                  .catch((err) =>
                    console.error("Error compressing image:", err),
                  );
              }}
            />
          </div>

          {photoPreviewUrl && (
            <img
              src={photoPreviewUrl}
              alt="preview"
              width="120"
              style={{
                marginTop: "10px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              onError={(e) => {
                const name =
                  (values.firstName || "") + " " + (values.lastName || "");
                const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  name.trim() || "User",
                )}&background=random`;

                if (e.target.src !== fallbackUrl) {
                  e.target.src = fallbackUrl;
                }
              }}
            />
          )}

          {isEdit && <button type="submit">Update</button>}
        </form>
      </div>
    </div>
  );
};

export default ViewAndEdit;
