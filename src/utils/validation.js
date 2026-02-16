//validation for password and all the entries

export function isEmail(enteredEmail) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

  return regex.test(enteredEmail);
}

export function isMobile(enteredMobile) {
  //const regex = /^\+[\d\s-]{7,15}$/;
  const regex = /^[\d]{12}$/;
  return regex.test(enteredMobile);
}

export function isName(enteredName) {
  const regex = /^[A-Za-z]+(?:[ '-][A-Za-z]*)*$/;
  return regex.test(enteredName);
}

export function isPincode(enteredPincode) {
  const regex = /^[\d]{6}$/;
  return regex.test(enteredPincode);
}
