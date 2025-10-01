import { Box, Button, Container, Modal, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ButtonGroup, IconButton } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { getAccessoryStock, getAccessoryStockExportPdf, getStock } from "../api/axios";
import { useParams, useSearchParams } from "react-router-dom";

function AccessoryStockDetail() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [stock, setStock] = useState([])
  const [loatingFetch, setLoadingFetch] = useState(false)
  const { brand_Id } = useParams()
  const { warehouseId } = useParams()
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchParams] = useSearchParams();
  const warehouse_name = searchParams.get("warehouse_name");
  const brand_name = searchParams.get("brand_name");
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  console.log(brand_name);

  const handleWheel = (e) => {
    e.preventDefault();
    setScale((prev) => Math.min(Math.max(prev + e.deltaY * -0.001, 1), 5));
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - start.x,
      y: e.clientY - start.y,
    });
  };

  const handleMouseUp = () => setDragging(false);


  const handleExportPDF = async () => {
    try {
      const response = await getAccessoryStockExportPdf(brand_Id, "", warehouseId);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${warehouse_name}-${brand_name}-аксессуарь`); // fayl nomi
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("PDF export failed", error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingFetch(true)
      try {
        const response = await getAccessoryStock(brand_Id, "", warehouseId);
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

  return (
    <Container maxWidth="full">
      <Box sx={{ width: "100%", height: "100%" }}>
        <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px", marginBottom: "4px", marginTop: "10px" }}>
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <h3 style={{ margin: "0px", fontSize: "14px" }}>{warehouse_name} <span style={{ color: "#2795F5", fontSize: "15px" }}>{brand_name}</span> <span>Остатки</span></h3>

          </Box>
          <Button size="small" sx={{ fontSize: "10px", }} variant="outlined" color="error" onClick={handleExportPDF} endIcon={<PictureAsPdfIcon sx={{ color: "red" }} />}>
            EXPORT

          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ width: "100%", minWidth: "0", backgroundColor: isDark ? "#0e1c26" : "white", }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 60, padding: "4px", fontSize: "12px" }}>№</TableCell>

                <TableCell sx={{ width: '15%', textAlign: "center", fontSize: "12px", padding: "4px" }}>Заказчик</TableCell>
                <TableCell sx={{ width: '30%', textAlign: "center", fontSize: "12px", padding: "4px" }}>Названия</TableCell>
                <TableCell sx={{ width: '30%', textAlign: "center", fontSize: "12px", padding: "4px" }}>Примичения</TableCell>

                <TableCell sx={{ width: '15%', textAlign: "center", fontSize: "12px", padding: "4px" }}>Кол-во</TableCell>
                <TableCell sx={{ width: '15%', textAlign: "center", fontSize: "12px", padding: "4px" }}>ед. изм.</TableCell>
                <TableCell sx={{ width: '15%', textAlign: "center", fontSize: "12px", padding: "4px" }}>@</TableCell>
                {/* <TableCell sx={{ width: 120, textAlign: "center" }}>Действия</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody >
              {stock?.map((item, index) => (
                <TableRow key={item.id} sx={{ padding: "0 10px" }}>
                  <TableCell sx={{ fontSize: "12px", padding: "2px 10px" }}>{index + 1}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>{item.accessory.brand_name}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>{item.accessory.name}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>{item.accessory.comment}</TableCell>

                  <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}> {Number(item.total_quantity).toLocaleString("ru-RU")}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}> {item.accessory.type_display}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>
                    <IconButton onClick={() => setSelectedImage(item.accessory.image)}>
                      <ImageIcon sx={{ fontSize: "18px" }} />
                    </IconButton>
                  </TableCell>


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
              ))}

            </TableBody>
          </Table>
        </TableContainer>
        <Modal
          open={Boolean(selectedImage)}
          onClose={() => {
            setSelectedImage(null);
            setScale(1);
            setPosition({ x: 0, y: 0 });
          }}
        >
          {/* tashqi qism - modal fon */}
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              bgcolor: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => {
              setSelectedImage(null);
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }}
          >
            {/* faqat rasm qismi */}
            <Box
              onClick={(e) => e.stopPropagation()} // rasmga bosganda modal yopilmaydi
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              sx={{
                cursor: dragging ? "grabbing" : "grab",
              }}
            >
              <img
                src={selectedImage}
                alt="zoom"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transition: dragging ? "none" : "transform 0.2s",
                  maxWidth: "60vw",
                  maxHeight: "60vh",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            </Box>
          </Box>
        </Modal>


      </Box>
    </Container>
  )
}

export default AccessoryStockDetail
