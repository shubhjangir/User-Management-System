import React from "react";

function LoginPage() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log("Login Form Details");
  }

  return (
    <div className="LoginPage">
      <h1>LoginPage</h1>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Enter Email</label>
          <input id="email" type="email" name="email" required />

          <label htmlFor="password">Enter Password</label>
          <input id="password" type="password" name="password" required />
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
