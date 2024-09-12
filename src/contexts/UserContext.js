import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; // Import the AuthContext to access the token
import { useMessage } from "./MessageContext";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const { token } = useAuth();
  const { fetchMessagesByChannelId } = useMessage();

  const fetchUsers = async () => {
    if (!token) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  }


  useEffect(() => {
    fetchUsers();
  }, [token]);

  return (
    <UserContext.Provider value={{ users, fetchUsers }}>
      {children}
    </UserContext.Provider>
  );
};
