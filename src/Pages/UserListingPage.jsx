import React from "react";
import "./UserListing.css";
import { useState, useEffect } from "react";

import Users from "../../users.json";

import { Outlet, useNavigate } from "react-router-dom";

//for navigation and for giving the direction to the user to land on the different pages and url changes accordingly
// edit -> http://localhost:5173/users/${user.id}?isedit=true
//view -> http://localhost:5173/users/${user.id}

const USER_PER_PAGE = 10;

const UserListingPage = () => {
  // setting up the data in localStorage
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : Users;
  });

  // saving it once
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // setting up the state
  const [currentPage, setCurrentPage] = useState(1);

  //start page index
  const startIndex = (currentPage - 1) * USER_PER_PAGE;

  //end page index
  const endIndex = startIndex + USER_PER_PAGE;

  //current usesrs
  const currentUsers = users.slice(startIndex, endIndex);

  //totl pages
  //const totalPages = Math.ceil(users.length / USER_PER_PAGE);

  const totalPages = Math.max(1, Math.ceil(users.length / USER_PER_PAGE));

  //to navigate
  const navigate = useNavigate();

  return (
    <>
      <h1>Registered Users </h1>
      <section id="Table-Section">
        <h1>Users</h1>
        <table id="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Profile</th>
              <th>View</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>
                    <img
                      src={user.photo}
                      alt={user.name}
                      width="40"
                      height="40"
                      style={{ borderRadius: "50%" }}
                    />
                  </td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => {
                        console.log("View", user.name, user.id);
                        navigate(`/users/${user.id}`);
                      }}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => {
                        console.log("user edit", user.id, user.name);
                        navigate(`/users/${user.id}/?isedit=true`);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Pagination Logic :*/}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((prev) => prev - 1);
            }}
          >
            Previous
          </button>

          <span>
            {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((prev) => prev + 1);
            }}
          >
            Next
          </button>
        </div>
      </section>
    </>
  );
};

export default UserListingPage;
