import {
  Box, Button, Container, Grid, Card, CardMedia, CardContent, Typography, CardActions, Divider,
  CircularProgress,
  useTheme
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getStockBrand, getTotalStock, getStockcategory, getWarehouse } from "../api/axios";
import StockEntry from "./StockEntry";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "../utils/formatNumber";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CalendarIcon from "../componet/CalendarIcon";
function Stock() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [stockBrand, setStockBrand] = useState([]);
  const [stockCategory, setStockCategory] = useState(null);
  const [totalStock, setTotalStock] = useState({})
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem("selectedWarehouse");
    console.log("🚀 localStorage initial:", stored); // <-- tekshirish
    return stored ? Number(stored) : null;
  });
  const [warehouseName, setWarehouseName] = useState(() => {
    const name = localStorage.getItem("selectedWarehouseName");
    return name ? (name) : null;
  });
  console.log(warehouseName);
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (warehouse && !value) {
      console.log("📦 Warehouses loaded:", warehouse);
      console.log("⚠️ value bo‘sh edi, default qilib birinchi ombor:", warehouse[0].id);
      setValue(warehouse.id);
      localStorage.setItem("selectedWarehouse", warehouse[0].id);
    }
  }, [warehouse, value]);


  useEffect(() => {
    if (!value) return;
    const fetchData = async () => {
      setLoadingFetch(true);
      try {
        const [brandRes, categoryRes, totalRes] = await Promise.all([
          getStockBrand(value),
          getStockcategory(value),
          getTotalStock(value),
        ]);
        setStockBrand(brandRes.data);
        setStockCategory(categoryRes.data);
        setTotalStock(totalRes.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchData();
  }, [value]);



  useEffect(() => {
    const fetchWarehouse = async () => {
      setLoading(true);
      try {
        const response = await getWarehouse();
        setWarehouse(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWarehouse();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem("selectedWarehouse", newValue);

    const selected = warehouse.find(w => w.id === newValue);
    if (selected) {
      setWarehouseName(selected.name);
      localStorage.setItem("selectedWarehouseName", selected.name);
    }
  };



  console.log(stockBrand);

  return (
    <Container maxWidth="false" sx={{ py: 2, paddingLeft: "0 !important", paddingRight: "0 !important" }}>
      <Box sx={{ display: "flex", width: "100%", height: "800px" }}>

        {loadingFetch && (
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}>
            <CircularProgress size={30} />
          </Box>
        )}
        <Box sx={{ width: "220px", height: "350px", boxShadow: "0px 2px 8px -1px rgba(34, 60, 80, 0.2)", backgroundColor: isDark ? "#2a454b" : "white", }}>
          <Tabs value={value} onChange={handleChange}
            aria-label="warehouse tabs" orientation="vertical" sx={{
              // xohlagan rangingiz
              borderRight: 1,
              borderBottom: "1px solid",
              width: "100%",
              height: "36%",
              borderColor: 'divider',
            }}>
            {warehouse?.map((item) => (
              <Tab key={item.id} label={item.name} value={item.id} data-name={item.name} sx={{
                transition: "background-color 0.3s ease",
                fontSize: "15px",
                fontWeight: "600",
                minHeight: "40px",
                padding: "10px 6px",
                "&.Mui-selected": { backgroundColor: "#4b749f", color: "#fff" }, // tanlangan tab fon rangi
                "&:hover": {
                  backgroundColor: "#4b749f49", // hover rangi
                },
              }} />
            ))}
          </Tabs>
          <div style={{ width: "100%", height: "60%", padding: "5px", display: "flex", flexDirection: "column", alignItems: "center", }}>
            <p style={{ fontSize: "15px", color: isDark ? "white" : "#2a454b", margin: 0, marginBottom: "20px", marginTop: "0px", }}>Umumiy kroy tugash kuni</p>
            <CalendarIcon day={stockCategory?.critical_total_day} />
          </div>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 1, width: "70%", padding: 1 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: "20px" }}>
            Склад {warehouseName}
          </Typography>
          <Grid container spacing={2}>
            <Card
              sx={{
                height: "200px",
                width: "200px",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease-in-out",
                "&:hover": { transform: "scale(1.03)" },
                cursor: "pointer",
              }}
              onClick={() => {
                if (!value) {
                  console.warn("⚠️ Ombor tanlanmagan!");
                  return;
                }
                const warehouse = stockBrand.warehouse_name || warehouseName;
                navigate(`/stock/stock/stock-all/${value}/?warehouse_name=${warehouse}`);
              }}
            >
              <h1 style={{ fontSize: "50px", margin: "10px", color: "#45caff" }}>Все<p style={{ fontSize: "30px", margin: "5px", color: "#ff1b6b" }}>крои</p></h1>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" textAlign="center">

                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" mb={1}>
                  Общий остаток: <span style={{ fontWeight: "700", fontSize: "16px" }}>{formatNumber(stockCategory?.total_quantity)}</span>
                </Typography>



                {/* Specification ro‘yxati */}

              </CardContent>

            </Card>
            {stockBrand?.brands?.map((brand) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={brand.brand_id}>
                <Card
                  sx={{
                    height: "100%",
                    width: "200px",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": { transform: "scale(1.03)" },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (!value) {
                      console.warn("⚠️ Ombor tanlanmagan!");
                      return;
                    }
                    const warehouse = stockBrand.warehouse_name || warehouseName;
                    navigate(`/stock/stock/brand/${brand.brand_id}/${value}/?warehouse_name=${warehouse}&brand_name=${brand.brand_name}`);
                  }}
                >
                  <CardMedia
                    component="img"
                    height="100"
                    image={brand.brand_image}
                    alt={brand.brand_name}
                    sx={{ objectFit: "contain", p: 0, paddingTop: "3px" }}
                  />
                  <CardContent sx={{ flexGrow: 1, padding: 1, paddingBottom: "5px !important", }}>
                    <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ fontSize: "16px" }}>
                      {brand.brand_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center" mb={1} sx={{ fontSize: "13px" }}>
                      Общий остаток: {brand.total_quantity}
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    {brand.specifications?.map(spec => (
                      <Box key={spec.spec_id} sx={{ display: "flex", justifyContent: "space-between", fontSize: "12px", mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontSize: "12px", }}>{spec.spec_name}</Typography>
                        <Typography variant="body2" fontWeight="bold" sx={{ fontSize: "12px", }}>{spec.total_quantity}</Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}

          </Grid>

        </Box>

        <Box sx={{ width: "30%", height: "200px", pl: 2, }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 2, textAlign: "center" }}
          >
            По категориям
          </Typography>


          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              p: 1,
              bgcolor: "background.paper",
              backgroundColor: isDark ? "#0e1c26" : "white",
              maxHeight: 700,            // scroll balandligi
              overflowY: "auto",         // scroll yoqilishi
              "&::-webkit-scrollbar": {  // scrollbarni chiroyli qilish
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "3px",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: isDark ? "#304152" : "white",
                alignItems: "center",
                px: 1.5,
                py: 1,

                borderBottom: "2px solid #e0e0e0",
                fontWeight: "bold",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Название
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Кол-во
              </Typography>
            </Box>
            {stockCategory?.category_list?.map((type, idx) => (
              <Box
                key={idx}
                onClick={() => {
                  if (!value) {
                    console.warn("⚠️ Ombor tanlanmagan!");
                    return;
                  }
                  const warehouse = stockBrand.warehouse_name || warehouseName;
                  navigate(`/stock/stock/category-detail/${value}/${type.category_id}/?warehouse_name=${warehouse}&category_name=${type.category_name}`);
                }}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                  px: 1.5,
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, background-color 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.02)",      // zoom effekti
                    backgroundColor: "#4b749f49",    // hoverda rang ozgaradi
                  },
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight="500"
                  noWrap
                  sx={{
                    maxWidth: "70%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "14px",
                  }}
                >
                  {type.category_name}
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="primary"
                  sx={{ fontSize: "14px" }}
                >
                  {formatNumber(type.total_quantity)}
                </Typography>
              </Box>
            ))}
          </Box>



        </Box>
      </Box>


    </Container>
  );
}

export default Stock;
