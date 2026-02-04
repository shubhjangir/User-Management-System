//validation for password and all the entries

export function isEmail(value) {
  const regex = /[a-zA-Z0-9@[a-z].[a-z]]/;

  return regex.test(value);
}
