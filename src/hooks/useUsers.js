import { useState, useEffect, useCallback } from "react";
import UsersData from "../../users.json";
import { compressImage, fileToBase64, base64ToFile } from "../utils/imageCompression";

const STORAGE_KEY = "users";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load users on mount
  useEffect(() => {
    const loadUsers = async () => {
      const storedUsersStr = localStorage.getItem(STORAGE_KEY);
      if (storedUsersStr) {
        try {
          const parsedUsers = JSON.parse(storedUsersStr);
          // Convert base64 strings back to Files/Blobs for state
          
          const processPhoto = (photoVal, defaultName) => {
            if (typeof photoVal === "string") {
              if (photoVal.startsWith("data:image")) {
                return base64ToFile(photoVal, defaultName);
              }
              return photoVal; // Retain standard URL strings (like those in users.json)
            }
            return photoVal;
          };

          const decodedUsers = parsedUsers.map(user => {
            let photoOrig = processPhoto(user.photoOriginal || user.photo, "photo.jpg");
            let photoThumb = processPhoto(user.photoThumbnail || user.thumbnail, "thumb.jpg");
            let normalPhoto = processPhoto(user.photo, "photo.jpg");
            let normalThumb = processPhoto(user.thumbnail, "thumb.jpg");

            // Recover from users.json if images are entirely wiped out by previous bugs
            if (!photoOrig && !photoThumb && !normalPhoto && !normalThumb && user.id <= 17) {
              const originalUser = UsersData.find(u => u.id === user.id);
              if (originalUser && originalUser.photo) {
                photoOrig = originalUser.photo;
                normalPhoto = originalUser.photo;
              }
            }

            return {
              ...user,
              photoOriginal: photoOrig,
              photoThumbnail: photoThumb,
              photo: normalPhoto,
              thumbnail: normalThumb,
            };
          });
          setUsers(decodedUsers);
        } catch(e) {
          console.error("Failed parsing stored users", e);
          setUsers([]);
        }
      } else {
        setUsers(UsersData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(UsersData));
      }
      setLoading(false);
    };
    loadUsers();
  }, []);

  // Helper to serialize user images before saving to localStorage
  const serializeUsersAsync = async (usersList) => {
    return Promise.all(usersList.map(async (user) => {
      let serialized = { ...user };
      
      // We ONLY save thumbnails to localStorage to prevent QuotaExceededError (5MB limit)
      if (user.photoThumbnail instanceof Blob || user.photoThumbnail instanceof File) {
        serialized.photoThumbnail = await fileToBase64(user.photoThumbnail);
      }
      if (user.thumbnail instanceof Blob || user.thumbnail instanceof File) {
        serialized.thumbnail = await fileToBase64(user.thumbnail);
      }

      // DO NOT serialize the massive original photos into base 64. 
      // If they are blobs, we drop them from localStorage to save space.
      // (They remain in active memory for the current session)
      if (serialized.photoOriginal instanceof Blob || serialized.photoOriginal instanceof File) {
        if (!serialized.photoThumbnail && !serialized.thumbnail) {
            // Generate emergency thumbnail to prevent permanent photo loss for old users
            const miniBlob = await compressImage(serialized.photoOriginal, 150, 0.7);
            serialized.photoThumbnail = await fileToBase64(miniBlob);
        }
        serialized.photoOriginal = null; 
      }
      if (serialized.photo instanceof Blob || serialized.photo instanceof File) {
        if (!serialized.photoThumbnail && !serialized.thumbnail) {
            // Generate emergency thumbnail
            const miniBlob = await compressImage(serialized.photo, 150, 0.7);
            serialized.thumbnail = await fileToBase64(miniBlob);
        }
        serialized.photo = null;
      }
      
      return serialized;
    }));
  };

  const addUser = useCallback(async (newUser) => {
    const id = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const userWithId = { ...newUser, id };
    const updatedUsers = [...users, userWithId];
    
    setUsers(updatedUsers);
    
    // Wait for local storage serialization to finish!
    const serialized = await serializeUsersAsync(updatedUsers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    
    return userWithId;
  }, [users]);

  const updateUser = useCallback(async (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    
    setUsers(updatedUsers);
    
    // Wait for local storage serialization to finish!
    const serialized = await serializeUsersAsync(updatedUsers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    
    return updatedUser;
  }, [users]);

  const getUserById = useCallback(
    (id) => {
      return users.find((user) => user.id === Number(id));
    },
    [users]
  );

  const deleteUser = useCallback(async (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    
    setUsers(updatedUsers);
    
    // Wait for local storage serialization to finish!
    const serialized = await serializeUsersAsync(updatedUsers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  }, [users]);

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
  };
};
