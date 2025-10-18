import { useState } from "react";
import PropTypes from "prop-types";
import AuthContext from "./AuthContext";
import { login as apiLogin, logout as apiLogout } from "../components/api/axios";

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      setUserInfo(response.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      localStorage.clear();
      setIsAuthenticated(false);
      setUserInfo(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
