import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Sidebar.css";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import RippleLink from "./RippleLink";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
function CustomSidebar({ navigation, open }) {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const hoverTimeout = useRef(null);

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const handleMouseEnter = (segment) => {
    clearTimeout(hoverTimeout.current);
    setHoveredMenu(segment);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 50);
  };
  useEffect(() => {
    // Har safar `location.pathname` o‘zgarganda: avtomatik faollik ochiladi
    const newOpenMenus = {};
    navigation.forEach((item) => {
      if (
        location.pathname === `/${item.segment}` ||
        item.children?.some((child) => location.pathname === `/${item.segment}/${child.segment}`)
      ) {
        newOpenMenus[item.segment] = true;
      }
    });
    setOpenMenus((prev) => ({ ...prev, ...newOpenMenus }));
  }, [location.pathname, navigation]);

  return (
    <div className={`sidebar-menu ${open ? "open" : "collapsed"} custom-sidebar`} style={{     backgroundColor: isDark ? "#0e1c26" : "white",}}>
      <ul>
        {navigation.map((item) => {
          const isActive =
            location.pathname.startsWith(`/${item.segment}`) ||
            item.children?.some(
              (child) => location.pathname === `/${item.segment}/${child.segment}`
            );

          const hasChildren = item.children?.length > 0;
          const isOpen = openMenus[item.segment] ?? isActive;

          return (
            <li
              key={item.segment}
              onMouseEnter={() => handleMouseEnter(item.segment)}
              onMouseLeave={handleMouseLeave}
              className={isActive ? "active" : ""}
            >
              {hasChildren ? (
                <div
                  className="sidebar-item-with-children"
                  onClick={() => {
                    if (!open) return; // collapsed bo‘lsa hech narsa qilma
                    toggleMenu(item.segment);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") toggleMenu(item.segment);
                  }}
                >
                  <div className="submenu-title">
                    <div className="sidebar-item-icon-title">{item.icon}</div>
                    <p className="sidebar-item-title">{item.title}</p>
                  </div>
                  {open && (
                    <ArrowForwardIosIcon
                      sx={{ fontSize: "20px" }}
                      className={`submenu-arrow ${isOpen ? "rotate" : ""}`}
                    />
                  )}
                </div>
              ) : (
                <RippleLink
                  to={`/${item.segment}`}
                  className={`sidebar-link ${isActive ? "active" : ""} ${
                    isDark ? "dark-mode" : "light-mode"
                  }`}
                  whileTap={{
                    scale: 0.98,
                    backgroundColor: "rgba(40,90,160,0.2)",
                    transition: { duration: 0.3 },
                  }}
                  whileFocus={{ scale: 1.6 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <div className="sidebar-item-icon-title">
                    {item.icon}
                    <span className="sidebar-item-title">{item.title}</span>
                  </div>
                </RippleLink>
              )}

              {hasChildren && Array.isArray(item.children) && item.children.length > 0 && !open && (
                <div
                  className="submenu-hover-wrapper"
                  style={{
                    opacity: hoveredMenu === item.segment ? 1 : 0,
                    visibility: hoveredMenu === item.segment ? "visible" : "hidden",
                    pointerEvents: hoveredMenu === item.segment ? "auto" : "none",
                    transition: "opacity 0.3s ease, visibility 0.3s ease",
                    backgroundColor: isDark ? "#000" : "#fff",
                  }}
                >
                  <ul
                    className="submenu-hover"
                    style={{
                      backgroundColor: isDark ? "#000" : "#fff",
                    }}
                  >
                    {item.children.map((child) => {
                      const isChildActive =
                        location.pathname === `/${item.segment}/${child.segment}`;

                      return (
                        <li
                          style={{ marginLeft: "0px" }}
                          key={`${item.segment}-${child.segment}`}
                          className={isChildActive ? "active" : ""}
                        >
                          <RippleLink
                            to={`/${item.segment}/${child.segment}`}
                            className={`sidebar-link ${isChildActive ? "active" : ""} ${
                              isDark ? "dark-mode" : "light-mode"
                            }`}
                            whileTap={{
                              scale: 0.98,
                              backgroundColor: "rgba(40,90,160,0.2)",
                              transition: { duration: 0.3 },
                            }}
                            whileFocus={{ scale: 1.6 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            {child.icon}
                            <span style={{fontSize:"12px"}}>{child.title}</span>
                          </RippleLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {hasChildren && open && (
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      className="submenu motion-submenu"
                      style={{ marginTop: "6px" }}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.children.map((child) => {
                        const isChildActive =
                          location.pathname === `/${item.segment}/${child.segment}`;

                        return (
                          <li
                            key={`${item.segment}-${child.segment}`}
                            style={{
                              paddingLeft: "10px",
                              marginBottom: "10px",
                            }}
                            className={isChildActive ? "active" : ""}
                          >
                            <RippleLink
                              to={`/${item.segment}/${child.segment}`}
                              className={`sidebar-link ${isChildActive ? "active" : ""} ${
                                isDark ? "dark-mode" : "light-mode"
                              }`}
                              whileTap={{
                                scale: 0.98,
                                backgroundColor: "rgba(40,90,160,0.2)",
                                transition: { duration: 0.3 },
                              }}
                              whileFocus={{ scale: 1.6 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              {child.icon}
                              <span className="sidebar-item-title">{child.title}</span>
                            </RippleLink>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
CustomSidebar.propTypes = {
  navigation: PropTypes.arrayOf(
    PropTypes.shape({
      segment: PropTypes.string.isRequired,
      title: PropTypes.string,
      icon: PropTypes.node,
      children: PropTypes.arrayOf(
        PropTypes.shape({
          segment: PropTypes.string.isRequired,
          title: PropTypes.string,
          icon: PropTypes.node,
        })
      ),
    })
  ).isRequired,
  open: PropTypes.bool.isRequired,
};
export default CustomSidebar;
