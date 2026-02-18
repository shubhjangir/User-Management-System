# Key React Concepts Used in This Project

This document outlines the core React concepts and hooks we used to build and refactor your application. Mastering these will give you a deep understanding of how the code works.

## 1. Custom Hooks (`useForm`, `useUsers`)
**What it is:** A way to extract component logic into reusable functions.
**Where we used it:**
*   `src/hooks/useForm.js`: Encapsulates all the messy logic of handling input changes, validation, and errors. Instead of writing `handleChange` in every page, we write it once here.
*   `src/hooks/useUsers.js`: Encapsulates the logic for loading, saving, and updating users in `localStorage`.

## 2. `useState`
**What it is:** The most basic hook to let a component "remember" things.
**Where we used it:**
*   **Everywhere!**
*   In `useForm` to remember what you typed (`values`) and any mistakes (`errors`).
*   In `useUsers` to keep the list of users in memory (`users`).

## 3. `useEffect`
**What it is:** A hook to run code *after* the component renders, usually to sync with something outside of React (like LocalStorage or an API).
**Where we used it:**
*   In `useUsers.js`: To load data from `localStorage` when the app first starts.
*   In `ViewAndEdit.jsx`: To populate the form fields with user data when the `id` changes.

## 4. `useCallback`
**What it is:** A performance optimization tool. It ensures a function doesn't get re-created every single time the component re-renders unless necessary.
**Where we used it:**
*   In `useForm.js`: We wrapped `handleChange` and `handleBlur` in `useCallback`. This is good practice when creating libraries or hooks to prevent unnecessary re-renders in child components.

## 5. `useMemo`
**What it is:** Similar to `useCallback`, but for *values* instead of functions. It calculates a value and "caches" it.
**Where we used it:**
*   In `ViewAndEdit.jsx`: To search for the specific user (`users.find(...)`). calling `useMemo` ensures we don't re-search the huge user list every time you type a letter in the form, only when the `users` list or `id` actually changes.

## 6. `forwardRef`
**What it is:** A way to pass a "ref" (reference) from a parent component down to a child component's DOM element.
**Where we used it:**
*   In `src/Components/FormInput.jsx`: We wrapped the component in `forwardRef`. This allows the parent (like `SignUpPage`) to focus the input field directly if needed (though we rely mostly on state now, this keeps the component flexible for focus management).

## 7. `useNavigate` & `useParams` (React Router)
**What it is:** Hooks provided by `react-router-dom` for navigation.
**Where we used it:**
*   **`useNavigate`**: In `SignUpPage` and `ViewAndEdit` to send the user back to the `/users` list after saving.
*   **`useParams`**: In `ViewAndEdit` to grab the user ID from the URL (e.g., getting `1` from `/users/1`).

## 8. Controlled Components
**What it is:** A pattern where the React state (`values.firstName`) is the "single source of truth" for what is shown in the input box.
**Where we used it:**
*   All our inputs in `SignUpPage` and `ViewAndEdit`. The `<input value={values.firstName} />` ensures that what you see is exactly what is in your variable.

## 9. Async/Await & Promises
**What it is:** Modern JavaScript for handling operations that take time (like file reading).
**Where we used it:**
*   In `SignUpPage.jsx` when handling image uploads. `compressImage` returns a **Promise**, so we use `.then()` to wait for the compression to finish before updating the state.
