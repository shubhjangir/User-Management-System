import React, { useState } from "react";
import "./UserListing.css";
import { useNavigate } from "react-router-dom";
import UserTable from "../Components/UserTable";
import Pagination from "../Components/Pagination";
import { useUsers } from "../hooks/useUsers";

//for navigation and for giving the direction to the user to land on the different pages and url changes accordingly
// edit -> http://localhost:5173/users/${user.id}?isedit=true
//view -> http://localhost:5173/users/${user.id}

const USER_PER_PAGE = 10;

const UserListingPage = () => {
  // Access users via the custom hook
  const { users } = useUsers();

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

  const handleView = (user) => {
    console.log("View", user.name, user.id);
    navigate(`/users/${user.id}`);
  };

  const handleEdit = (user) => {
    console.log("user edit", user.id, user.name);
    navigate(`/users/${user.id}/?isedit=true`);
  };

  return (
    <>
      <h1>Registered Users </h1>
      <section id="Table-Section">
        <h1>Users</h1>
        <UserTable
          users={currentUsers}
          onView={handleView}
          onEdit={handleEdit}
        />
        {/* Pagination Logic :*/}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </>
  );
};

export default UserListingPage;
