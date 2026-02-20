import { useState, useEffect, useCallback } from "react";
import UsersData from "../../users.json";

const STORAGE_KEY = "users";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load users on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem(STORAGE_KEY);
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(UsersData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(UsersData));
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever users change (optional, but convenient for some flows)
  // However, for explicit CRUD, we might want to manual save to avoid unintentional overwrites during init.
  // Let's stick to explicit updates for now to be safe.

  const addUser = useCallback((newUser) => {
    setUsers((prevUsers) => {
      const id =
        prevUsers.length > 0
          ? Math.max(...prevUsers.map((u) => u.id)) + 1
          : 1;
      const userWithId = { ...newUser, id };
      const updatedUsers = [...prevUsers, userWithId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  }, []);

  const getUserById = useCallback(
    (id) => {
      return users.find((user) => user.id === Number(id));
    },
    [users],
  );

  const deleteUser = useCallback((userId) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.filter((user) => user.id !== userId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  }, []);

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
  };
};
