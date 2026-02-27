import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { User, Mail, MapPin, Upload } from "lucide-react";
import FormInput from "../FormInput";
import SectionTitle from "../SectionTitle";
import ImageCropperDialog from "./ImageCropperDialog";
import "./UserForm.css";
import { Button } from "../ui/button";

const UserForm = ({ mode = "create", initialData = null, onSubmit, onCancel }) => {
  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [selectedFileObj, setSelectedFileObj] = useState(null);

  const isViewMode = mode === "view";

  const splitName = (fullName) => {
    if (!fullName) return { firstName: "", middleName: "", lastName: "" };
    const parts = fullName.split(" ");
    if (parts.length === 1) return { firstName: parts[0], middleName: "", lastName: "" };
    if (parts.length === 2) return { firstName: parts[0], middleName: "", lastName: parts[1] };
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    const middleName = parts.slice(1, -1).join(" ");
    return { firstName, middleName, lastName };
  };

  const getOriginalUrl = (u) => {
    if (!u) return "";
    if (u.photoOriginal instanceof Blob || u.photoOriginal instanceof File) return URL.createObjectURL(u.photoOriginal);
    if (u.photo instanceof Blob || u.photo instanceof File) return URL.createObjectURL(u.photo);
    if (u.photoThumbnail instanceof Blob || u.photoThumbnail instanceof File) return URL.createObjectURL(u.photoThumbnail);
    if (u.thumbnail instanceof Blob || u.thumbnail instanceof File) return URL.createObjectURL(u.thumbnail);
    return u.photoOriginal || u.photo || u.photoThumbnail || u.thumbnail || "";
  };

  const initialNameParts = initialData ? splitName(initialData.name) : { firstName: "", middleName: "", lastName: "" };

  //show address fields only when address1 is valid
  const [showAddressFields, setShowAddressFields] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: initialNameParts.firstName,
      middleName: initialNameParts.middleName,
      lastName: initialNameParts.lastName,
      email: initialData?.email || "",
      mobile: initialData?.mobile || "",
      address1: initialData?.address1 || "",
      address2: initialData?.address2 || "",
      address3: initialData?.address3 || "",
      pincode: initialData?.pincode || "",
      photoOriginal: initialData?.photoOriginal || initialData?.photo || null,
      photoThumbnail: initialData?.photoThumbnail || initialData?.thumbnail || null,
      previewUrl: initialData ? getOriginalUrl(initialData) : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("First name is mandatory")
        .min(2, "Minimum 2 characters")
        .max(50, "Maximum 50 characters")
        .matches(/^[A-Za-z\s'-]+$/, "Please enter a valid name"),
      middleName: Yup.string().matches(/^[A-Za-z\s'-]*$/, "Please enter a valid name"),
      lastName: Yup.string()
        .required("Last name is mandatory")
        .min(2, "Minimum 2 characters")
        .max(50, "Maximum 50 characters")
        .matches(/^[A-Za-z\s'-]+$/, "Please enter a valid name"),
      email: Yup.string()
        .required("Email is mandatory")
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/, "Entered email is invalid. Please Enter Valid Email."),
      mobile: Yup.string()
        .required("Mobile Number is mandatory")
        .matches(/^[6-9][0-9]{9}$/, "Mobile Number is invalid"),
      address1: Yup.string().trim().required("Address Line 1 is mandatory"),
      address2: Yup.string(),
      address3: Yup.string().trim().required("Address Line 3 is mandatory"),
      pincode: Yup.string()
        .required("Pincode is mandatory")
        .matches(/^[\d]{6}$/, "Please enter valid pincode"),
      // For create mode, we can strict check photo requirements on submit instead of breaking Yup
      photoOriginal: mode === "create" ? Yup.mixed().required("Profile photo is required") : Yup.mixed().nullable(),
    }),
    onSubmit: (values) => {
       if (mode === "create" && !values.photoOriginal && !values.photoThumbnail) {
           formik.setFieldError("photoOriginal", "Profile photo is required");
           return;
       }
       if (onSubmit) {
         onSubmit(values);
       }
    },
  });

  const { values, errors, touched, handleBlur, setFieldValue, handleSubmit, setFieldTouched, submitCount } = formik;

  useEffect(() => {
    if (isViewMode) return;
    const isAddress1Valid = values.address1.trim() !== "" && !errors.address1;
    // Only clear if the field has been touched or a submit was attempted.
    if (!isAddress1Valid && (touched.address1 || submitCount > 0)) {
      if (values.address2 !== "" || values.address3 !== "") {
        setFieldValue("address2", "");
        setFieldValue("address3", "");
        setFieldTouched("address2", false);
        setFieldTouched("address3", false);
      }
    }
  }, [values.address1, errors.address1, isViewMode, touched.address1, submitCount, setFieldValue, setFieldTouched, values.address2, values.address3]);

  //If user opens Edit dialog and address1 already has value,
  //we should automatically show address2/3.
  useEffect(() => {
  if (mode === "edit" && values.address1.trim() !== "") {
    setShowAddressFields(true);
  }
}, [mode, values.address1]);

  const handleCustomChange = (e) => {
    if (isViewMode) return;
    const { name, value } = e.target;
    let newValue = value;

    if (name === "mobile") {
      newValue = value.replace(/\D/g, "");
    } else if (["firstName", "middleName", "lastName"].includes(name)) {
      newValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    setFieldValue(name, newValue);
  };

  const handleFileChange = (e) => {
    if (isViewMode) return;
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG , PNG , JPG files can be uploaded.");
      e.target.value = null;
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size should be less than 5MB.");
      e.target.value = null;
      return;
    }

    try {
      setSelectedFileObj(file);
      const objectUrl = URL.createObjectURL(file);
      setSelectedImageSrc(objectUrl);
      setCropperOpen(true);
    } catch (error) {
      console.error("Error launching cropper :", error);
    }

    e.target.value = null;
  };

  //customhandleblur for address1
  const handleAddress1Blur = async (e) => {
  handleBlur(e); // keep Formik default behavior

  // validate this specific field
  await formik.validateField("address1");

  const isValid =
    formik.values.address1.trim() !== "" &&
    !formik.errors.address1;

  if (isValid) {
    setShowAddressFields(true);
  } else {
    setShowAddressFields(false);
  }
};

  return (
    <div className="userform-wrapper w-full">
      <form onSubmit={handleSubmit} autoComplete="off" noValidate className="w-full">
        {/* Section 1: Personal Details */}
        <div className="form-section">
          <SectionTitle icon={User} title="Personal Details" />
          <div className="form-grid">
            <FormInput
              label={`First Name ${isViewMode ? "" : "*"}`}
              id="firstName"
              name="firstName"
              value={values.firstName}
              onChange={handleCustomChange}
              onBlur={handleBlur}
              placeholder="John"
              disabled={isViewMode}
              error={(touched.firstName || submitCount > 0) && errors.firstName ? errors.firstName : ""}
            />

            <FormInput
              label="Middle Name"
              id="middleName"
              name="middleName"
              value={values.middleName}
              onChange={handleCustomChange}
              onBlur={handleBlur}
              placeholder="Quincy"
              disabled={isViewMode}
              error={touched.middleName && errors.middleName ? errors.middleName : ""}
            />

            <FormInput
              label={`Last Name ${isViewMode ? "" : "*"}`}
              id="lastName"
              name="lastName"
              value={values.lastName}
              onChange={handleCustomChange}
              onBlur={handleBlur}
              placeholder="Doe"
              disabled={isViewMode}
              error={(touched.lastName || submitCount > 0) && errors.lastName ? errors.lastName : ""}
            />
          </div>

          {/* Photo Upload in Personal Details */}
          <div className="form-group photo-upload-section" style={{ marginTop: "20px" }}>
            {!isViewMode && (
              <>
                <label htmlFor="photo" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Upload size={18} /> Upload Profile Photo {mode === "create" && "*"}
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                />
              </>
            )}
            
            {isViewMode && <label style={{ fontWeight: 'bold' }}>Profile Photo</label>}

            {values.previewUrl ? (
               <a href={values.previewUrl} target="_blank" rel="noreferrer" title="Click to open full photo">
                  <img src={values.previewUrl} alt="Preview" className="image-preview" onError={(e) => { e.target.style.display = 'none'; }} />
               </a>
            ) : isViewMode ? (
               <div className="h-32 w-full flex items-center justify-center bg-slate-100 rounded-md border text-slate-400 p-8 my-4">
                 No image available
               </div>
            ) : null}
            
            {(touched.photoOriginal || submitCount > 0) && errors.photoOriginal && !isViewMode && (
              <div className="error-text" style={{ color: "red", fontSize: "0.85rem" }}>
                {errors.photoOriginal}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="form-section">
          <SectionTitle icon={Mail} title="Contact Information" />
          <div className="form-grid">
            <FormInput
              label={`Email Address ${isViewMode ? "" : "*"}`}
              id="email"
              type="email"
              name="email"
              value={values.email}
              onChange={handleCustomChange}
              onBlur={handleBlur}
              placeholder="john.doe@example.com"
              disabled={isViewMode}
              error={(touched.email || submitCount > 0) && errors.email ? errors.email : ""}
            />

            <FormInput
              label={`Mobile Number ${isViewMode ? "" : "*"}`}
              id="mobile"
              type="tel"
              name="mobile"
              value={values.mobile}
              onChange={handleCustomChange}
              onBlur={handleBlur}
              maxLength={10}
              placeholder="9876543210"
              disabled={isViewMode}
              error={(touched.mobile || submitCount > 0) && errors.mobile ? errors.mobile : ""}
            />
          </div>
        </div>

        {/* Section 3: Address Details */}
        <div className="form-section">
          <SectionTitle icon={MapPin} title="Address Details" />
          <div className="form-grid">
            <FormInput
              as="textarea"
              label={`Address Line 1 ${isViewMode ? "" : "*"}`}
              id="address1"
              name="address1"
              value={values.address1}
              onChange={handleCustomChange}
              onBlur={handleAddress1Blur}
              placeholder="Street address, P.O. box, etc."
              className="full-width"
              disabled={isViewMode}
              error={(touched.address1 || submitCount > 0) && errors.address1 ? errors.address1 : ""}
            />
            
            {(isViewMode && values.address2) || 
            (!isViewMode && showAddressFields) || 
            values.address2 !== "" ? (
              <FormInput
                as="textarea"
                label="Address Line 2"
                id="address2"
                name="address2"
                value={values.address2}
                onChange={handleCustomChange}
                placeholder="Apartment, suite, unit, building, floor, etc."
                className="full-width"
                disabled={isViewMode}
              />
            ) : null}
            {(isViewMode && values.address3) || 
            (!isViewMode && showAddressFields) || 
            values.address3 !== "" ? (
              <FormInput
                as="textarea"
                label={`Address Line 3 ${isViewMode ? "" : "*"}`}
                id="address3"
                name="address3"
                value={values.address3}
                onChange={handleCustomChange}
                onBlur={handleBlur}
                placeholder="Street address, Landmark, etc."
                disabled={isViewMode}
                error={(touched.address3 || submitCount > 0) && errors.address3 ? errors.address3 : ""}
              />
            ) : null}

            <FormInput
              label={`Pincode ${isViewMode ? "" : "*"}`}
              id="pincode"
              name="pincode"
              value={values.pincode}
              onChange={handleCustomChange}
              onBlur={handleBlur}
              maxLength={6}
              placeholder="123456"
              disabled={isViewMode}
              error={(touched.pincode || submitCount > 0) && errors.pincode ? errors.pincode : ""}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
           {onCancel && (
             <Button type="button" variant="outline" onClick={onCancel}>
               {isViewMode ? "Close" : "Cancel"}
             </Button>
           )}
           {!isViewMode && (
             <button type="submit" className="submit-btn" style={{ margin: 0, width: "auto" }}>
               {mode === "create" ? "Create Account" : "Save Changes"}
             </button>
           )}
        </div>
      </form>

      {!isViewMode && (
        <ImageCropperDialog
          open={cropperOpen}
          onOpenChange={setCropperOpen}
          imageSrc={selectedImageSrc}
          onCropComplete={(croppedBlob) => {
            setFieldValue("photoOriginal", selectedFileObj);
            setFieldValue("photoThumbnail", croppedBlob);
            setFieldValue("previewUrl", URL.createObjectURL(croppedBlob));
          }}
        />
      )}
    </div>
  );
};

export default UserForm;
