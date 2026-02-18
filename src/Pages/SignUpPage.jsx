import { validateUserForm } from "../utils/validation";
import { User, Mail, MapPin, Upload } from "lucide-react";
import "./SignUpPage.css";
import { useNavigate } from "react-router-dom";
import FormInput from "../Components/FormInput";
import SectionTitle from "../Components/SectionTitle";
import { useForm } from "../hooks/useForm";
import { useUsers } from "../hooks/useUsers";
import { compressImage } from "../utils/imageCompression";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { addUser } = useUsers();

  const {
    values,
    errors,
    handleChange: handleFormChange,
    handleBlur,
    handleSubmit,
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
      preview: "",
    },
    false,
    validateUserForm,
  );

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
      return; // Stop submission if errors exist
    }

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
      photo: values.photo,
    };

    addUser(newUser);
    alert("User is added successfully!!");
    navigate("/users");
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <h1 className="signup-title">Create Account</h1>
        <p className="signup-subtitle">Please fill in your details below</p>

        <form onSubmit={onSubmit} autoComplete="off">
          {/* Section 1: Personal Details */}
          <div className="form-section">
            <SectionTitle icon={User} title="Personal Details" />
            <div className="form-grid">
              <FormInput
                label="First Name"
                id="firstName"
                name="firstName"
                value={values.firstName}
                onChange={handleCustomChange}
                onBlur={handleBlur}
                placeholder="John"
                required
                error={errors.firstName}
              />

              <FormInput
                label="Middle Name"
                id="middleName"
                name="middleName"
                value={values.middleName}
                onChange={handleCustomChange}
                onBlur={handleBlur}
                placeholder="Quincy"
              />

              <FormInput
                label="Last Name"
                id="lastName"
                name="lastName"
                value={values.lastName}
                onChange={handleCustomChange}
                onBlur={handleBlur}
                placeholder="Doe"
                required
                error={errors.lastName}
              />
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
                  
                  // Validation logic for file type and size can also be moved to utility or kept here
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

                  compressImage(file)
                    .then((compressedBase64) => {
                      setValues((prev) => ({
                        ...prev,
                        photo: compressedBase64,
                        preview: compressedBase64,
                      }));
                    })
                    .catch((err) =>
                      console.error("Error compressing image:", err),
                    );
                }}
                required
                // style={{ display: 'none' }} // Optional: hide standard input if styling label as button
              />
              {values.preview && (
                <img
                  src={values.preview}
                  alt="Preview"
                  className="image-preview"
                />
              )}
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="form-section">
            <SectionTitle icon={Mail} title="Contact Information" />
            <div className="form-grid">
              <FormInput
                label="Email Address"
                id="email"
                type="email"
                name="email"
                value={values.email}
                onChange={handleCustomChange}
                onBlur={handleBlur}
                placeholder="john.doe@example.com"
                required
                error={errors.email}
              />

              <FormInput
                label="Mobile Number"
                id="mobile"
                type="tel"
                name="mobile"
                value={values.mobile}
                onChange={handleCustomChange}
                onBlur={handleBlur}
                maxLength={10}
                pattern="[6-9]{1}[0-9]*"
                inputMode="numeric"
                placeholder="9876543210"
                required
                error={errors.mobile}
              />
            </div>
          </div>

          {/* Section 3: Address Details */}
          <div className="form-section">
            <SectionTitle icon={MapPin} title="Address Details" />
            <div className="form-grid">
              <FormInput
                as="textarea"
                label="Address Line 1"
                id="address1"
                name="address1"
                value={values.address1}
                onChange={handleCustomChange}
                onBlur={handleBlur}
                placeholder="Street address, P.O. box, etc."
                required
                className="full-width"
                error={errors.address1}
              />

              <FormInput
                as="textarea"
                label="Address Line 2"
                id="address2"
                name="address2"
                value={values.address2}
                onChange={handleCustomChange}
                placeholder="Apartment, suite, unit, building, floor, etc."
                className="full-width"
              />

              <FormInput
                as="textarea"
                label="Address Line 3"
                id="address3"
                name="address3"
                value={values.address3}
                onChange={handleCustomChange}
                onBlur={handleBlur}
                placeholder="Street address, Landmark, etc."
                required
                error={errors.address3}
              />

              <FormInput
                label="Pincode"
                id="pincode"
                name="pincode"
                value={values.pincode}
                onChange={handleCustomChange}
                onBlur={handleBlur}
                maxLength={6}
                placeholder="123456"
                required
                error={errors.pincode}
              />
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
