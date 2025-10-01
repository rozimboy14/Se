import { Box, Button, Container, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ButtonGroup, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { getStock, getStockBrandExportPdf } from "../api/axios";
import { useParams, useSearchParams } from "react-router-dom";

function StockDetail() {
        const theme = useTheme();
        const isDark = theme.palette.mode === "dark";
  const [stock, setStock] = useState([])
  const [loatingFetch, setLoadingFetch] = useState(false)
  const { brand_Id } = useParams()
  const { warehouseId } = useParams()
  const [openRow, setOpenRow] = useState(null);
    const [searchParams] = useSearchParams();
  const warehouse_name = searchParams.get("warehouse_name");
  const brand_name = searchParams.get("brand_name");
  const handleToggle = (id) => {
    setOpenRow(openRow === id ? null : id);
  };


  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingFetch(true)
      try {
        const response = await getStock(brand_Id,"",warehouseId);
        setStock(response.data)
        console.log(response.data);

      } catch (error) {
        console.log(error);

      } finally {
        setLoadingFetch(false)
      }
    }
    fetchOrders()
  }, [])
  console.log(stock);

  const handleExportPDF = async () => {
    try {
      const response = await getStockBrandExportPdf(warehouseId,brand_Id);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${warehouse_name}-${brand_name}`); // fayl nomi
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("PDF export failed", error);
    }
  };

  return (
    <Container maxWidth="full">
      <Box sx={{ width: "100%", height: "100%" }}>
        <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px" }}>
          <Box sx={{ flex: 1, textAlign: "center" }}>
             <h3 style={{ margin: "0px", fontSize: "14px" }}>{warehouse_name} <span style={{color:"#2795F5",fontSize:"15px"}}>{brand_name}</span><span> Остатки</span></h3>
          </Box>
             <Button size="small" sx={{ fontSize: "10px", }} variant="outlined" color="error" onClick={handleExportPDF} endIcon={<PictureAsPdfIcon sx={{ color: "red" }} />}>
            EXPORT

          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ width: "100%", minWidth: "0",backgroundColor: isDark ? "#0e1c26" : "white", }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 40, padding: "2px 7px", fontSize: "12px" }} />
                <TableCell sx={{ width: 30, fontSize: "12px", padding: "5px 10px" }}>№</TableCell>

                <TableCell sx={{ width: '15%', textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>Заказчик</TableCell>
                <TableCell sx={{ width: '45%', textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>Модель</TableCell>
                <TableCell sx={{ width: '15%', textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>Сезон</TableCell>
                <TableCell sx={{ width: '15%', textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>Примичения</TableCell>
                <TableCell sx={{ width: '20%', textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>Кол-во</TableCell>
                {/* <TableCell sx={{ width: 120, textAlign: "center" }}>Действия</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody >
              {stock?.map((item, index) => (
                <React.Fragment key={item.id}>
                  <TableRow sx={{ padding: "0 10px" }}  >

                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "0px 5px" }}>
                      {(item.stock_variants?.length > 0
                      ) && (
                          <IconButton
                            size="small"
                            onClick={() => handleToggle(item.id)}
                          >
                            {openRow === item.id ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            )}
                          </IconButton>
                        )}
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px", padding: "2px 6px" }}>{index + 1}</TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 6px" }}>{item.order.brand_name}</TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 6px" }}>{item.order.article_name}</TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 6px" }}>{item.order.specification_name}</TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 6px" }}>{item.order.comment}</TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 6px" }}> {Number(item.total_quantity).toLocaleString("ru-RU")}</TableCell>
                    {/* <TableCell sx={{ padding: "6px 10px" }}>
                    <ButtonGroup variant="outlined" size="small" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <IconButton onClick={() => handleEdit(item.id)} sx={{ color: "green" }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)} sx={{ color: "red" }}>
                        <DeleteForeverIcon />
                      </IconButton>
                    </ButtonGroup>
                  </TableCell> */}
                  </TableRow>
                  <TableRow sx={{
                    backgroundColor: openRow === item.id ? "#f5f5f5" : "white",
                    "&:hover": { backgroundColor: "#f3f8ff" }
                  }} >
                    <TableCell colSpan={8} sx={{ padding: "0px 0px",backgroundColor: isDark ? "#60696b" : "white",  }}>
                      <Collapse in={openRow === item.id} timeout="auto" unmountOnExit sx={{padding:"0px 6px"}}>
       <Paper sx={{
          padding: "3px",
                          marginY: "2px",
  backgroundColor: isDark ? "#1e2a35" : "#eef2f3",
  boxShadow: 2,
  borderRadius: 2,
}}>
                          {/* Variantlar */}
                          {item.stock_variants?.length > 0 && (
                            <>

                              <Table size="small">
                                <TableHead sx={{backgroundColor: isDark ? "#0e1c26" : "white",}}>
                                  <TableRow>
                                    <TableCell sx={{ fontSize: "10px", padding: "0px 5px" }}>№</TableCell>
                                    <TableCell sx={{ fontSize: "10px", padding: "0px 5px" }}>Вариант</TableCell>
                                    <TableCell sx={{ fontSize: "10px", padding: "0px 5px" }}>Кол-во</TableCell>

                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {item.stock_variants.map((variant, idx) => (
                                    <TableRow key={variant.id}>
                                      <TableCell sx={{ fontSize: "12px" }}>{idx + 1}</TableCell>
                                      <TableCell sx={{ fontSize: "12px" }}>{variant.name}</TableCell>
                                      <TableCell sx={{ fontSize: "12px" }}>{variant.quantity}</TableCell>

                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </>
                          )}


               </Paper>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}

            </TableBody>
          </Table>
        </TableContainer>


      </Box>
    </Container>
  )
}

export default StockDetail
