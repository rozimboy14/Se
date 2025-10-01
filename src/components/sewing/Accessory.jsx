import { Box, Button, Container, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ButtonGroup, IconButton } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from '@mui/icons-material/Image';
import DeleteModal from "../componet/DeleteModal";
import AddAccessory from "../componet/AddAccessory";
import EditAccessory from "../componet/EditAccessory";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
} from "@mui/material";

import {
  getAccessory,
  postAccessory,
  patchAccessory,
  deleteAccessory,
} from "../api/axios";

function Accessory() {
         const theme = useTheme();
          const isDark = theme.palette.mode === "dark";
  const [accessories, setAccessories] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAccessory, setEditAccessory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });



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


  const handleDelete = (id) => {
    const item = accessories.find((a) => a.id === id);
    setSelectedAccessory(item);
    setDeleteModalOpen(true);
  };

  useEffect(() => {
    const fetchAccessories = async () => {
      setLoadingFetch(true);
      try {
        const response = await getAccessory();
        setAccessories(response.data);
        console.log(`response.data`, response.data);
      } catch (error) {
        console.error("Ошибка при загрузке аксессуаров:", error);
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchAccessories();
  }, []);

  const handleAddAccessory = async (item) => {
    console.log(`Item`, item);



    try {
      const response = await postAccessory(item);
      setAccessories((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Add failed:", err);
    } finally {
      setAddModalOpen(false);
    }
  };

  const handleEdit = (id) => {
    const item = accessories.find((a) => a.id === id);
    setEditAccessory(item);
    setEditModalOpen(true);
  };

  const handleEditSave = async (newData) => {
    if (!editAccessory) return;
    console.log(`newData`, newData);
    try {
      const res = await patchAccessory(editAccessory.id, newData);
      setAccessories((prev) =>
        prev.map((a) => (a.id === editAccessory.id ? res.data : a))
      );
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setEditModalOpen(false);
      setEditAccessory(null);
    }
  };

  const confirmDelete = async () => {
    if (!selectedAccessory) return;
    try {
      await deleteAccessory(selectedAccessory.id);
      setAccessories((prev) =>
        prev.filter((a) => a.id !== selectedAccessory.id)
      );
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedAccessory(null);
    }
  };

  return (
    <Container maxWidth="full">
      <Box sx={{ width: "100%", height: "100%" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <h3 style={{margin: 0,marginBottom:"8px"}}>Аксессуары</h3>
          </Box>
          <Button
            size="small"
            sx={{ fontSize: "10px" }}
            variant="contained"
            onClick={() => setAddModalOpen(true)}
          >
            Добавить
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ width: "100%" ,backgroundColor: isDark ? "#0e1c26" : "white",}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 60 ,fontSize:"12px",padding:"5px 10px"}}>№</TableCell>
                <TableCell sx={{ textAlign: "center",fontSize:"12px",padding:"5px 10px" }}>Название</TableCell>
                <TableCell sx={{ textAlign: "center",fontSize:"12px",padding:"5px 10px" }}>Бренд</TableCell>
                <TableCell sx={{ textAlign: "center",fontSize:"12px",padding:"5px 10px" }}>Примичения</TableCell>
                <TableCell sx={{ textAlign: "center",fontSize:"12px",padding:"5px 10px" }}>тип</TableCell>
  

                <TableCell sx={{ width: 120, textAlign: "center",fontSize:"12px",padding:"5px 10px" }}>
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accessories?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell sx={{ textAlign: "center",fontSize:"13px",padding:"2px 6px" }}>{index + 1}</TableCell>
                  <TableCell sx={{ textAlign: "center",fontSize:"13px",padding:"2px 6px" }}>{item.name}</TableCell>
                  <TableCell sx={{ textAlign: "center",fontSize:"13px",padding:"2px 6px" }}>{item.brand_name}</TableCell>
                  <TableCell sx={{ textAlign: "center",fontSize:"13px",padding:"2px 6px" }}>{item.comment}</TableCell>
                  <TableCell sx={{ textAlign: "center",fontSize:"12px",padding:"2px 6px" }}>{item.type_display}</TableCell>


                  <TableCell sx={{ textAlign: "center",padding:"2px 6px"  }}>
                    <ButtonGroup size="small">
                        <IconButton onClick={() => setSelectedImage(item.image)}>
                      <ImageIcon sx={{ fontSize: "18px"  }} />
                    </IconButton>
                      <IconButton
                        onClick={() => handleEdit(item.id)}
                        sx={{ color: "green" }}
                      >
                        <EditIcon sx={{fontSize:"18px" }} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(item.id)}
                        sx={{ color: "red" }}
                      >
                        <DeleteForeverIcon  sx={{fontSize:"18px" }} />
                      </IconButton>
                    </ButtonGroup>
                  </TableCell>
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
        {selectedAccessory && (
          <DeleteModal
            open={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setSelectedAccessory(null);
            }}
            title="Удалить аксессуар?"
            text={`Вы уверены, что хотите удалить "${selectedAccessory.name}"?`}
            onConfirm={confirmDelete}
          />
        )}

        <AddAccessory
          open={addModalOpen}
          onClose={() => { setAddModalOpen(false); }}
          onAdd={handleAddAccessory}
        />

        <EditAccessory
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditAccessory(null);
          }}
          onUpdate={handleEditSave}
          initialData={editAccessory}
        />
      </Box>
    </Container>
  );
}

export default Accessory;
