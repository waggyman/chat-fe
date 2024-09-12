import axios from "axios";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem('access_token') || '');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userinfo')) || '');

    const loginAndSaveToken = async (newToken) => {
        setToken(newToken);
        localStorage.setItem('access_token', newToken);
        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {headers: {Authorization: `Bearer ${newToken}`}});
        localStorage.setItem('userinfo', JSON.stringify(userResponse.data.data));
        setUser(userResponse.data.data);
    }

    return (
        <AuthContext.Provider value={{ token, loginAndSaveToken, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);