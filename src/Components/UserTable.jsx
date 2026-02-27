import React from "react";

const UserTable = ({ users, onView, onEdit }) => {
  return (
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
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.mobile}</td>
            <td>
              <img
                src={user.photoThumbnail || user.thumbnail || user.photo}
                alt={user.name}
                width="40"
                height="40"
                style={{ borderRadius: "50%", objectFit: "cover" }}
                onError={(e) => {
                  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || "User",
                  )}&background=random`;
                  if (e.target.src !== fallbackUrl) {
                    e.target.src = fallbackUrl;
                  }
                }}
              />
            </td>
            <td>
              <button
                className="btn-view"
                onClick={() => onView(user)}
              >
                View
              </button>
            </td>
            <td>
              <button
                className="btn-edit"
                onClick={() => onEdit(user)}
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
