# User Management System - Application Flow & Code Breakdown

This document explains how the application works, how data flows between pages, and what each piece of code is responsible for.

## 1. High-Level Application Flow

The application is a **User Management System** with three main operations (CRUD):
1.  **Create**: Sign Up Page (`/`)
2.  **Read**: User Listing Page (`/users`) & View User (`/users/:id`)
3.  **Update**: Edit User (`/users/:id?isedit=true`)

### Data Storage
*   **Location**: The browser's `localStorage` (inside a key named `"users"`).
*   **Format**: A JSON array of user objects.
*   **Persistence**: Data stays in the browser even after you close it.

---

## 2. Key Systems (The "Brains" of the App)

We refactored the code to move complex logic out of the pages and into **Custom Hooks**. This makes the pages clean and easy to read.

### A. `src/hooks/useForm.js` (The Form Manager)
**What it does:** Handles everything related to typing in forms.
*   **`values`**: Keeps track of what the user typed (e.g., `firstName: "John"`).
*   **`errors`**: Keeps track of mistakes (e.g., `email: "Invalid email"`).
*   **`handleChange`**: Updates `values` when you type.
*   **`handleBlur`**: Runs validation when you leave a field (click away).
*   **`handleSubmit`**: Checks for errors one last time before letting you submit.

### B. `src/hooks/useUsers.js` (The Data Manager)
**What it does:** Handles talking to `localStorage`.
*   **`users`**: The list of all users loaded from storage.
*   **`addUser(newUser)`**:
    1.  Calculates a new unique ID.
    2.  Adds the user to the list.
    3.  Saves the new list to `localStorage`.
*   **`updateUser(updatedUser)`**:
    1.  Finds the old user by ID.
    2.  Swaps it with the new data.
    3.  Saves the result to `localStorage`.
*   **`getUserById(id)`**: helper to find a specific person.

### C. `src/utils/imageCompression.js` (The Image Shrinker)
**What it does:** Prevents the "Quota Exceeded" error.
*   When a user uploads a photo, this utility uses a `canvas` to resize it to max 800px width.
*   It converts the image to a **Base64 string** (text representation of an image).
*   This ensures the image is small enough to fit in `localStorage`.

### D. `src/utils/validation.js` (The Rule Book)
**What it does:** strictly defines what is allowed.
*   Contains functions like `isEmail`, `isMobile`.
*   **`validateUserForm(values)`**: The master function that checks an entire form and returns a list of errors.

---

## 3. Page-by-Page Code Breakdown

### Page 1: Sign Up (`src/Pages/SignUpPage.jsx`)
**Goal**: Create a new user.
1.  **Setup**: Calls `useForm` (to handle typing) and `useUsers` (to handle saving).
2.  **Input Masking (`handleCustomChange`)**:
    *   *Oh, you typed a letter in the phone field?* -> Ignored (replaces with empty string).
    *   *Oh, you typed a number in the name field?* -> Ignored.
3.  **Image Upload**:
    *   When you pick a file, it calls `compressImage`.
    *   The result (a long text string) is saved into the form state.
4.  **Submission**:
    *   Calls `addUser(newUser)`.
    *   Navigates to `/users`.

### Page 2: User Listing (`src/Pages/UserListingPage.jsx`)
**Goal**: Show all users in a table.
1.  **Setup**: Calls `useUsers` to get the list of `users`.
2.  **Pagination (`src/Components/Pagination.jsx`)**:
    *   Calculates which 10 users to show based on `currentPage`.
3.  **Table Rendering (`src/Components/UserTable.jsx`)**:
    *   Loops through the users and displays them.
    *   **Image Fallback**: If an image is broken (dead link), the `onError` event fires and replaces the source with a default avatar from `ui-avatars.com`.

### Page 3: View & Edit (`src/Pages/ViewAndEdit.jsx`)
**Goal**: See details or change them.
*   **Dual Mode**: Checks the URL for `?isedit=true`.
    *   If `true`: Inputs are editable, "Update" button is shown.
    *   If `false`: Inputs are `disabled`, no save button.
*   **Loading Data**:
    *   Uses `getUserById(id)` to find the right user.
    *   Populates the form `values` with that user's data.
*   **Updates**:
    *   On submit, calls `updateUser(updatedData)`.
    *   Saves to storage and goes back to the list.

### UI Components (`src/Components/`)
*   **`FormInput.jsx`**: A smart wrapper around the HTML `<input>`.
    *   It knows how to show that red error text below itself.
    *   It knows how to turn its border red if there's an error.
*   **`SectionTitle.jsx`**: Just a simple component to make the "Personal Details" headers look consistent.

---

## Summary of Flow
1.  User goes to **Sign Up** -> Types data -> `useForm` updates state -> User uploads image -> `imageCompression` shrinks it -> User clicks Submit -> `useUsers` saves to LocalStorage -> Redirect to **Listing**.
2.  User sees **Listing** -> `useUsers` loads data -> `UserTable` displays it -> Image fails? `onError` fixes it.
3.  User clicks **Edit** -> **ViewAndEdit** loads data -> User changes name -> `useForm` updates state -> User clicks Update -> `useUsers` saves to LocalStorage.
