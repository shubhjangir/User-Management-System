import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import FormInput from "../FormInput";
import { useForm } from "../../hooks/useForm";
import { validateUserForm } from "../../utils/validation";
import { compressImage } from "../../utils/imageCompression";

const EditUserDialog = ({ open, user, setOpen, onSave }) => {
  // Helper to split full name into first, middle, last
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

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    setValues,
    setErrors
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
      thumbnail: "",
    },
    false,
    validateUserForm
  );

  useEffect(() => {
    if (user && open) {
      const { firstName, middleName, lastName } = splitName(user.name);
      setValues({
        firstName,
        middleName,
        lastName,
        email: user.email || "",
        mobile: user.mobile || "",
        address1: user.address1 || "",
        address2: user.address2 || "", // Assuming address2 might exist in user object even if not displayed before
        address3: user.address3 || "",
        pincode: user.pincode || "",
        photo: user.photo || "",
        thumbnail: user.thumbnail || "",
        // Store original ID if needed for update, though usually passed separately
        id: user.id
      });
      setErrors({}); // Clear errors when opening
    }
  }, [user, open, setValues, setErrors]);

  const handleCustomChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "mobile") {
      newValue = value.replace(/\D/g, "");
      // Removed strict "starts with 6-9" check to allow editing existing invalid numbers
    } else if (["firstName", "middleName", "lastName"].includes(name)) {
      newValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    // Call the hook's handleChange with the modified event/value
    // Since useForm's handleChange expects an event, we need to mimic it or just setValues directly
    // The useForm hook exports setValues, let's use that for custom logic
    setValues(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSave = () => {
    const validationErrors = validateUserForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; 
    }

    const fullName =
      `${values.firstName} ${values.middleName} ${values.lastName}`
        .replace(/\s+/g, " ")
        .trim();

    const updatedUser = {
      ...user, // Keep original fields like id
      name: fullName,
      email: values.email,
      mobile: values.mobile,
      address1: values.address1,
      address2: values.address2,
      address3: values.address3,
      pincode: values.pincode,
      photo: values.photo,
    };

    console.log("Saving user:", updatedUser);
    onSave(updatedUser);
    setOpen(false);
  };

   const handleFileChange = (e) => {
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

    compressImage(file)
      .then((compressedBase64) => {
        setValues((prev) => ({
          ...prev,
          photo: compressedBase64,
          thumbnail: compressedBase64, // Update thumbnail for preview
        }));
      })
      .catch((err) =>
        console.error("Error compressing image:", err),
      );
  };


  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* First Name */}
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

              {/* Middle Name */}
              <FormInput
                label="Middle Name"
                id="middleName"
                name="middleName"
                value={values.middleName}
                onChange={handleCustomChange}
                onBlur={handleBlur}
                placeholder="Quincy"
              />

              {/* Last Name */}
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

           {/* Mobile */}
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

          {/* Email */}
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


          {/* Address 1 */}
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
          
           {/* Address 2 */}
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

          {/* Address 3 */}
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

           {/* Pincode */}
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

          {/* Thumbnail */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Thumbnail</label>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={values.photo || values.thumbnail}
                  alt={values.firstName}
                />
                <AvatarFallback>{values.firstName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                className="text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
