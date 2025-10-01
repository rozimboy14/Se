import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Avatar, Button } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Link, useNavigate } from "react-router-dom";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { deepOrange } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import { Stack, LinearProgress, Typography, TextField } from "@mui/material";
import KeyIcon from "@mui/icons-material/VpnKey";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import "react-toastify/dist/ReactToastify.css";
const CustomToolbarAccount = ({ isLoggedIn, mode, toggleMode, sidebarOpen, setSidebarOpen }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const lastName = localStorage.getItem("last_name");
  const username = localStorage.getItem("username");
  const firstName = localStorage.getItem("first_name");
  const photo = localStorage.getItem("photo");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const minLength = 12;











  useEffect(() => {
    const handleClickOutside = (event) => {
      // Sidebar ochiq va tashqi klik bo‘lsa yopamiz
      if (
        sidebarOpen &&
        !event.target.closest(".custom-sidebar") &&
        !event.target.closest(".menu-icon")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [sidebarOpen, setSidebarOpen]);


  return (
    <>
      <div
        style={{
          width: "100%",
          padding: "1rem 1.5rem",
          display: "flex",
          gap: "15px",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: isDark ? "#0e1c26" : "white",
          borderBottom: "1px solid " + (isDark ? "#242a30" : "#fff"),
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
          position: "sticky",
          height: "60px",
          top: 0,
          zIndex: 1100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          {sidebarOpen ? (
            <MenuOpenIcon
              onClick={() => setSidebarOpen(false)}
              sx={{ fontSize: "26px", cursor: "pointer" }}
            />
          ) : (
            <MenuIcon
              onClick={() => setSidebarOpen(true)}
              className="menu-icon"
              sx={{ fontSize: "26px", cursor: "pointer" }}
            />
          )}

          <div className="flex gap-2">
            <img src="/./public/images/LOGO UZTEX.f9d6d9d7.png" alt="Logo" style={{ height: "40px" }} />
            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}></span>
          </div>
        </div>

        <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
          {isLoggedIn ? (
            <>
              <Avatar
                sx={{
                  bgcolor: deepOrange[500],
                  width: 32,
                  height: 32,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
             
              >
              
              </Avatar>
              <span></span>
              <Button
               
                color="error"
                variant="contained"
                sx={{ padding: "4px 10px", fontSize: "10px" }}
              >
                Выход
                <LogoutIcon sx={{ width: "15px", height: "15px", marginLeft: "6px" }} />
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Вход
            </Button>
          )}
          <Button
            color="inherit"
            startIcon={mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            onClick={toggleMode}
          ></Button>
        </div>
      </div>

      {/* Modal */}
      {/* Modal */}
  
    </>
  );
};
CustomToolbarAccount.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  mode: PropTypes.oneOf(["light", "dark"]).isRequired,
  toggleMode: PropTypes.func.isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};
export default CustomToolbarAccount;
