// components/navbar/Layout.jsx
import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import GradeIcon from '@mui/icons-material/Grade';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CustomToolbarAccount from "./CustomToolbarAccount";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LayersIcon from "@mui/icons-material/Layers";
import BreadcrumbsNav from "./BreadcrumbsNav";
import SettingsInputCompositeIcon from "@mui/icons-material/SettingsInputComposite";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import NotesIcon from "@mui/icons-material/Notes";
import InventoryIcon from "@mui/icons-material/Inventory";
import AnchorIcon from '@mui/icons-material/Anchor';
import CustomSidebar from "./CustomSidebar";
import Container from "@mui/material/Container";
import CategoryIcon from '@mui/icons-material/Category';
import ShieldIcon from '@mui/icons-material/Shield';
import AbcIcon from '@mui/icons-material/Abc';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
function Layout() {
  const [mode, setMode] = React.useState("light");
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };


  const NAVIGATION = React.useMemo(
    () => [
      { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
      // { segment: "orders-model", title: "Модель", icon: <MuseumIcon /> },
      // {
      //   segment: "orders-list",
      //   title: "Заказь",
      //   icon: <InventoryIcon />,
      //   active: location.pathname.startsWith("/orders-list"),
      // },
      {
        segment: "sewing",
        title: "SEWING",
        icon: <WarehouseIcon />,
        children: [
          { segment: "brand", title: "Заказчик", icon: <AnchorIcon /> },
          {
            segment: "specification",
            title: "Спецификация",
            icon: <ShieldIcon />,
          },
          {
            segment: "accessory",
            title: "Аксессуары",
            icon: <WorkspacesIcon />,
          },
          {
            segment: "packaging-category",
            title: "Категория упаковки",
            icon: <CategoryIcon />,
          },
          {
            segment: "sewing-category",
            title: "Категория шитья",
            icon: <AbcIcon />,
          },
          {
            segment: "article",
            title: "Модель",
            icon: <SettingsInputCompositeIcon />,
          },
          {
            segment: "orders",
            title: "Заказь",
            icon: <GradeIcon />,
          },
        ],
      },
      {
        segment: "stock",
        title: "Склад",
        icon: <NotesIcon />,
        children: [
          { segment: "stock", title: "Склад кроя", icon: <InventoryIcon /> },
          { segment: "accessory-stock", title: "Аксессуарь", icon: <WorkspacesIcon /> },



          {
            segment: "stock_total_entry",
            title: "Приходы",
            icon: <AssignmentReturnedIcon />,
          },
        ],
      },
      {
        segment: "production",
        title: "ПЛАН",
        icon: <LayersIcon />,

        children: [
          {
            segment: "line",
            title: "Линия",
            icon: <AirlineSeatReclineNormalIcon />,
          },
          {
            segment: "production-report",
            title: "План пошива",
            icon: <AssessmentIcon />,
          },
          {
            segment: "Month-planing",
            title: "Oylik reja",
            icon: <AssessmentIcon />,
          },
          {
            segment: "barcode",
            title: "Barcod",
            icon: <AssessmentIcon />,
          },

        ],
      },
      {
        segment: "packaging",
        title: "ГП",
        icon: <LayersIcon />,

        children: [
          {
            segment: "stock-packaging",
            title: "Склад",
            icon: <AirlineSeatReclineNormalIcon />,
          },
         
         

        ],
      },
    ],
    [location.pathname]
  );

  React.useEffect(() => {
    document.body.classList = "";
    document.body.classList.add(mode);
    localStorage.setItem("dark-mode", mode);
  }, [mode]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: { mode },
        components: {
         MuiCssBaseline: {
          styleOverrides: {
            body: {
              margin: 0,
              fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
              fontSize: "1rem",
              lineHeight: 1.5,
              backgroundColor: mode === "dark" ? "#0f172a" : "#ffffff", // dark/light body background
              color: mode === "dark" ? "#f8fafc" : "rgba(0, 0, 0, 0.87)",
            },
          },
        },
          MuiContainer: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "dark" ? "#081525" : "#f9fafb",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "dark" ? "#243748" : "#f9fafb",
              },
            },
          },
        },
      }),
    [mode]
  );

  // const theme = React.useMemo(() =>
  //   createTheme({
  //     palette: { mode },
  //     components: {
  //       MuiDrawer: {
  //         styleOverrides: {
  //           paper: {
  //             backgroundColor: mode === 'dark' ? '#1E293B' : '#f9fafb',
  //             color: mode === 'dark' ? '#fff' : '#000',
  //           },
  //         },
  //       },
  //     },
  //   }), [mode]
  // );

  const router = React.useMemo(
    () => ({
      pathname: location.pathname, // boshidagi / ni olib tashlamaslik yaxshiroq
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        if (path.startsWith("/")) {
          navigate(path);
        } else {
          navigate(`/${path}`);
        }
      },
    }),
    [location, navigate]
  );

  const handleLogin = () => console.log("Login clicked");
  const handleLogout = () => console.log("Logout clicked");
  const isLoggedIn = true;

  return (
    <ThemeProvider theme={theme}>
      <AppProvider navigation={[]} router={router} theme={theme}>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
          }}
        >
          {/* Chap panel */}
          <CustomSidebar navigation={NAVIGATION} open={sidebarOpen} />
          <CustomToolbarAccount
            onLogin={handleLogin}
            onLogout={handleLogout}
            isLoggedIn={isLoggedIn}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            mode={mode}
            toggleMode={toggleMode}
          />

          <div
            style={{
              flexGrow: 1,
              display: "flex",
              transition: "margin-left 0.3s ease",
              marginLeft: sidebarOpen ? "295px" : "75px",
              flexDirection: "column",
            }}
          >
            {/* Yuqori panel */}

            {/* Kontent qismi */}
            <div style={{ flexGrow: 1, overflow: "auto" }}>
              <Container
                maxWidth="lg"
                disableGutters
                sx={{
                  maxWidth: "100%",

                  px: 0, // padding-left & padding-right
                  "@media (min-width:1250px)": {
                    maxWidth: "1850px",
                  },
                  ".MuiBreadcrumbs-root:not(.custom-breadcrumbs)": {
                    display: "none",
                  },
                  ".MuiTypography-h4": {
                    display: "none",
                  },
                  ".MuiStack-root": {
                    mt: 0,
                  },

                  marginLeft: "0",

                  padding: "15px", // fallback
                }}
              >
                <BreadcrumbsNav />
                <Outlet />
              </Container>
            </div>
          </div>
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}
export default Layout;
