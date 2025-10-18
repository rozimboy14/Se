import { useEffect } from "react";
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

import "react-toastify/dist/ReactToastify.css";
import { logout } from "../api/axios";
const CustomToolbarAccount = ({ isLoggedIn, mode, toggleMode, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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


  const handleLogout = async () => {
    try {
      await logout(); // Backend logout chaqiruvi
      // Token cookie orqali tozalanadi (agar Django view shunday qilsa)
      navigate("/login"); // Login sahifasiga yo‘naltirish
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
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
               onClick={handleLogout}
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
