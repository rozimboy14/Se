import {
  Box, Container, Grid, Card, CardMedia, CardContent, Typography, CircularProgress,
  useTheme
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAccessoryStockBrand, getAccessoryType, getTotalAccessory, getWarehouse } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "../utils/formatNumber";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function StockAccessory() {
  // 🚩 Boshlanishida localStorage dan o‘qiymiz
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem("selectedWarehouse");
    console.log("🚀 localStorage initial:", stored); // <-- tekshirish
    return stored ? Number(stored) : null;
  });
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
  const [stockBrand, setStockBrand] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [accessoryType, setAccessoryType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warehouse, setWarehouse] = useState([]);
  const [warehouseName, setWarehouseName] = useState("");
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setWarehouseName(event.target.textContent);

    setValue(newValue);
    localStorage.setItem("selectedWarehouse", newValue);
    localStorage.setItem("selectedWarehouse", newValue);
    console.log("💾 localStorage saved:", localStorage.getItem("selectedWarehouse"));
  };

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

  // Agar localStorage bo‘sh bo‘lsa default qilib birinchi omborni tanlaymiz
  useEffect(() => {
    if (warehouse && !value) {
      console.log("📦 Warehouses loaded:", warehouse);
      console.log("⚠️ value bo‘sh edi, default qilib birinchi ombor:", warehouse.id);
      setValue(warehouse.id);
      localStorage.setItem("selectedWarehouse", warehouse.id);
    }
  }, [warehouse, value]);

  // Brandlar olish
  useEffect(() => {
    if (!value) return;
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response = await getAccessoryStockBrand(value);
        setStockBrand(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, [value]);

  // Jami accessoriyalar

  // Accessory turlari olish
  useEffect(() => {
    if (!value) return;
    const fetchTypes = async () => {
      try {
        const response = await getAccessoryType(value);
        setAccessoryType(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTypes();
  }, [value]);

  console.log(stockBrand);
  return (
    <Container maxWidth="false" sx={{ py: 2, paddingLeft: "0 !important", paddingRight: "0 !important" }}>
      <Box sx={{ display: "flex", width: "100%",height:"800px" }}>
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

        <Tabs value={value} onChange={handleChange}
          aria-label="warehouse tabs" orientation="vertical" sx={{
    backgroundColor: isDark ? "#243748" : "white",  
            borderRight: 1,
            width: "250px",
            height: "144px",
            borderColor: 'divider',
             boxShadow: "0px 2px 8px -1px rgba(34, 60, 80, 0.2)"

          }}>
          {warehouse?.map((item) => (
            <Tab key={item.id} label={item.name} value={item.id} sx={{
              transition: "background-color 0.3s ease",
              fontSize: "15px",
              fontWeight: "600",
              "&.Mui-selected": { backgroundColor: "#74deee", color: "#fff" },
              "&:hover": {
                backgroundColor: "#436c89",
              },
            }} />
          ))}
        </Tabs>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3, width: "70%",padding:2 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: "20px" }}>
            Бренды
          </Typography>
          <Grid container spacing={2} >
            <Card
              sx={{
                height: "200px",
                width: "200px",
                display: "flex",
                flexDirection: "column",
                borderRadius: "16px",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease-in-out",
                "&:hover": { transform: "scale(1.03)" },
                cursor: "pointer",


       
                backdropFilter: "blur(6.1px)",
                WebkitBackdropFilter: "blur(6.1px)",
              }}
              onClick={() => {
                if (!value) {
                  console.warn("⚠️ Ombor tanlanmagan!");
                  return;
                }
                const warehouse = stockBrand.warehouse_name || warehouseName;
                navigate(`/stock/accessory-stock/accessory-all/${value}/?warehouse_name=${warehouse}`);
              }}
            >
              <h1 style={{ flexGrow: 1, fontSize: "40px", margin: "10px", color: "#45caff" }}>Все <p style={{ fontSize: "20px", margin: "5px", color: "#ff1b6b" }}>Аксессуары</p></h1>
              <CardContent sx={{ flexGrow: 1, padding: 0, paddingBottom: "0 !important", }}>
                <Typography variant="h6" fontWeight="bold" textAlign="center">

                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" mb={1}>
                  Общий остаток: <span style={{ fontWeight: "700", fontSize: "16px" }}>{formatNumber(stockBrand?.total_quantity)}</span>
                </Typography>

              </CardContent>

            </Card>
            {stockBrand?.brands?.map((brand) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={brand.brand_id}>
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
                    navigate(`/stock/accessory-stock/${brand.brand_id}/${value}/?warehouse_name=${warehouse}&brand_name=${brand.brand_name}`)
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={brand.brand_image}
                    alt={brand.brand_name}
                    sx={{ objectFit: "contain", p: 1 }}
                  />
                  <CardContent sx={{ flexGrow: 1, padding: 0, paddingBottom: "0 !important", }}>
                    <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ fontSize: "16px" }}>
                      {brand.brand_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center" mb={0} sx={{ fontSize: "14px" }}>
                      Общий остаток: {formatNumber(brand.total_quantity)}
                    </Typography>
                  </CardContent>

                </Card>
              </Grid>
            ))}
          </Grid>

        </Box>
        <Box sx={{ width: "30%", pl: 2 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 2, textAlign: "center" }}
          >
            Типы аксессуаров
          </Typography>

          {accessoryType ? (
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                p: 1,
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
                  alignItems: "center",
                  px: 1.5,
                  py: 1,
                  backgroundColor: isDark ? "#304152" : "white",
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
              {accessoryType?.types?.map((type, idx) => (
                <Box
                  key={idx}
                  onClick={() => {
                 if (!value) {
                  console.warn("⚠️ Ombor tanlanmagan!");
                  return;
                }
                const warehouse = stockBrand.warehouse_name || warehouseName;
                     navigate(`/stock/accessory-stock/accessory-type/${value}/?type_name=${type.type_name}&warehouse_name=${warehouse}`)
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
                      backgroundColor: "#436c89",    // hoverda rang ozgaradi
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
                    {type.type_name}
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
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ width: "100%" }}
            >
              Нет данных по типам аксессуаров
            </Typography>
          )}
        </Box>



      </Box>

    </Container>
  );
}

export default StockAccessory;
