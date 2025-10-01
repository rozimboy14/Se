import { Box, Button, Container, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ButtonGroup, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import DeleteModal from "../componet/DeleteModal";
import AddModal from "../componet/AddModal";
import EditModal from "../componet/EditModal";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { deleteSpecification, getSpecification, postSpecification, patchSpecification } from "../api/axios";
function Specification() {
     const theme = useTheme();
          const isDark = theme.palette.mode === "dark";
    const [specification, setSpecification] = useState([])
    const [loatingFetch, setLoadingFetch] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSpecification, setSelectedSpecification] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editSpecification, setEditSpecification] = useState(null);
  
  
    const handleDelete = (id) => {
      const item = specification.find((b) => b.id === id);
      setSelectedSpecification(item);
      setDeleteModalOpen(true);
    };
  
    useEffect(() => {
      const fetchSpecification = async () => {
        setLoadingFetch(true)
        try {
          const response = await getSpecification();
          setSpecification(response.data)
          console.log(response.data);
  
        } catch (error) {
          console.log(error);
  
        } finally {
          setLoadingFetch(false)
        }
      }
      fetchSpecification()
    }, [])
  
    // Add Specification
    const handleAddSpecification = async (item) => {
      const data = {
        name: item
      }
  
      try {
        const response = await postSpecification(data);
        setSpecification(prev => [...prev, response.data]);
      } catch (err) {
        console.error("Add failed:", err);
      } finally {
        setAddModalOpen(false);
      }
    };
  
    const handleEdit = (id) => {
      const item = specification.find((b) => b.id === id);
      setEditSpecification(item);
      setEditModalOpen(true);
    };
  
  
    const handleEditSave = async (newName) => {
      if (!editSpecification) return;
      try {
        const res = await patchSpecification(editSpecification.id, { name: newName });
        setSpecification(prev =>
          prev.map(b => (b.id === editSpecification.id ? res.data : b))
        );
      } catch (err) {
        console.error("Edit failed:", err);
      } finally {
        setEditModalOpen(false);
        setEditSpecification(null);
      }
    };
  
    // Delete Specification
    const confirmDelete = async () => {
      if (!selectedSpecification) return;
      try {
        await deleteSpecification(selectedSpecification.id);
        setSpecification(prev => prev.filter(b => b.id !== selectedSpecification.id));
      } catch (err) {
        console.error("Delete failed:", err);
      } finally {
        setDeleteModalOpen(false);
        setSelectedSpecification(null);
      }
    };
  
  return (
    <Container maxWidth="full">
      <Box sx={{ width: "100%", height: "100%" }}>
       <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px" }}>
  <Box sx={{ flex: 1, textAlign: "center" }}>
    <h3 style={{margin:"0"}}>Сезон</h3>
  </Box>
  <Button size="small" sx={{ fontSize: "10px" }} variant="contained" onClick={() => setAddModalOpen(true)}>
    Добавит
  </Button>
</Box>

        <TableContainer component={Paper} sx={{ width: "100%", minWidth: "0",backgroundColor: isDark ? "#0e1c26" : "white", }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize:"12px",padding:"4px 10px", width: 60 }}>№</TableCell>
                <TableCell sx={{ fontSize:"12px",padding:"4px 10px", width: 100 }}>ID</TableCell>
                <TableCell sx={{ fontSize:"12px",padding:"4px 10px", width: '70%', textAlign: "center" }}>Названия</TableCell>
                <TableCell sx={{ fontSize:"12px",padding:"4px 10px", width: 120, textAlign: "center" }}>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
              {specification?.map((item, index) => (
                <TableRow key={item.id} sx={{ padding: "0 10px" }}>
                  <TableCell sx={{ fontSize: "13px", padding: "2px 10px" }}>{index + 1}</TableCell>
                  <TableCell sx={{ fontSize: "13px", padding: "2px 10px" }}>{item.id} </TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{item.name}</TableCell>
                  <TableCell sx={{ padding: "2px 10px" }}>
                    <ButtonGroup variant="outlined" size="small" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <IconButton onClick={() => handleEdit(item.id)} sx={{ color: "green", }}>
                        <EditIcon  sx={{ fontSize: "18px"}}/>
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)} sx={{ color: "red" }}>
                        <DeleteForeverIcon sx={{ fontSize: "18px", }} />
                      </IconButton>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
        {selectedSpecification && (
          <DeleteModal
            open={deleteModalOpen}
            onClose={() => { setDeleteModalOpen(false); setSelectedSpecification(null) }}
            title="Удалить бренд?"
            text={`Вы уверены, что хотите удалить бренд "${selectedSpecification.name}"?`}
            onConfirm={confirmDelete}
          />
        )}
        <AddModal
          open={addModalOpen}
          onClose={() => { setAddModalOpen(false); }}
          onAdd={handleAddSpecification}
        />
        <EditModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditSpecification(null);
          }}
          onEdit={handleEditSave}
          initialValue={editSpecification?.name}
        />
      </Box>
    </Container>
  )
}

export default Specification
