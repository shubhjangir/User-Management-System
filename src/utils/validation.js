//validation for password and all the entries

export function isEmail(enteredEmail) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

  return regex.test(enteredEmail);
}

export function isMobile(enteredMobile) {
  //const regex = /^\+[\d\s-]{7,15}$/;
  const regex = /^[6-9][0-9]{9}$/;
  return regex.test(enteredMobile);
}

export function isName(enteredName) {
  const regex = /^[A-Za-z]+(?:[\S'-][A-Za-z]*)*$/;
  return regex.test(enteredName);
}

export function isPincode(enteredPincode) {
  const regex = /^[\d]{6}$/;
  return regex.test(enteredPincode);
}

export const validateUserForm = (values) => {
  const errors = {};

  if (!values.firstName?.trim()) errors.firstName = "First Name is Mandatory";
  else if (!isName(values.firstName))
    errors.firstName = "Please enter valid name";

  if (!values.lastName?.trim()) errors.lastName = "Last Name is mandatory";
  else if (!isName(values.lastName))
    errors.lastName = "Please enter valid name";

  if (!values.email) errors.email = "Email is mandatory";
  else if (!isEmail(values.email))
    errors.email = "Entered email is invalid. Please Enter Valid Email.";

  if (!values.mobile) errors.mobile = "Mobile Number is mandatory";
  else if (!isMobile(values.mobile)) errors.mobile = "Mobile Number is invalid";

  if (!values.address1?.trim()) errors.address1 = "Address Line 1 is mandatory";

  if (!values.address3?.trim()) errors.address3 = "Address Line 3 is mandatory";

  if (!values.pincode) errors.pincode = "Pincode is mandatory";
  else if (!isPincode(values.pincode))
    errors.pincode = "Please enter valid pincode";

  return errors;
};
