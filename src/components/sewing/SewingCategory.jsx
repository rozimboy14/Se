import { Box, Button, Container, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ButtonGroup, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import DeleteModal from "../componet/DeleteModal";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { deleteSewinggCategory, getSewinggCategory, postSewinggCategory, patchSewinggCategory } from "../api/axios";
import EditCategory from "../componet/EditCategory";
import AddCategory from "../componet/AddCategory";


function SewingCategory() {
         const theme = useTheme();
          const isDark = theme.palette.mode === "dark";
    const [sCategoty, setSCategory] = useState([])
      const [loatingFetch, setLoadingFetch] = useState(false)
      const [deleteModalOpen, setDeleteModalOpen] = useState(false);
      const [selectedCategory, setSelectedCategory] = useState(null);
      const [addModalOpen, setAddModalOpen] = useState(false);
      const [editModalOpen, setEditModalOpen] = useState(false);
      const [editCategory, setEditCategory] = useState(null);
    

    const handleDelete = (id) => {
        const item = sCategoty.find((b) => b.id === id);
        setSelectedCategory(item);
        setDeleteModalOpen(true);
      };
    
      useEffect(() => {
        const fetchBrand = async () => {
          setLoadingFetch(true)
          try {
            const response = await getSewinggCategory();
            setSCategory(response.data)
            console.log(response.data);
    
          } catch (error) {
            console.log(error);
    
          } finally {
            setLoadingFetch(false)
          }
        }
        fetchBrand()
      }, [])
    
      // Add Brand
      const handleAddCategory = async (item) => {
        const data = {
          name: item.name,
          norm: item.norm

        }
    
        try {
          const response = await postSewinggCategory(data);
          setSCategory(prev => [...prev, response.data]);
        } catch (err) {
          console.error("Add failed:", err);
        } finally {
          setAddModalOpen(false);
        }
      };
    
      const handleEdit = (id) => {
        const item = sCategoty.find((b) => b.id === id);
        setEditCategory(item);
        setEditModalOpen(true);
      };
    
    
      const handleEditSave = async (newData) => {
        if (!editCategory) return;
        try {
          const res = await patchSewinggCategory(editCategory.id, newData);
          setSCategory(prev =>
            prev.map(b => (b.id === editCategory.id ? res.data : b))
          );
        } catch (err) {
          console.error("Edit failed:", err);
        } finally {
          setEditModalOpen(false);
          editCategory(null);
        }
      };
    
      // Delete Brand
      const confirmDelete = async () => {
        if (!selectedCategory) return;
        try {
          await deleteSewinggCategory(selectedCategory.id);
          setSCategory(prev => prev.filter(b => b.id !== selectedCategory.id));
        } catch (err) {
          console.error("Delete failed:", err);
        } finally {
          setDeleteModalOpen(false);
          setSelectedCategory(null);
        }
      };

  return (
<Container maxWidth="full">
      <Box sx={{ width: "100%", height: "100%" }}>
       <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px" }}>
  <Box sx={{ flex: 1, textAlign: "center" }}>
    <h3 style={{margin:0,marginBottom:"6px"}}>Категория шитья</h3>
  </Box>
  <Button size="small" sx={{ fontSize: "10px" }} variant="contained" onClick={() => setAddModalOpen(true)}>
    Добавит
  </Button>
</Box>

        <TableContainer component={Paper} sx={{ width: "100%", minWidth: "0" ,backgroundColor: isDark ? "#0e1c26" : "white", }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 60 }}>№</TableCell>
            
                <TableCell sx={{ width: '70%', textAlign: "center" }}>Названия</TableCell>
                <TableCell sx={{ width: '70%', textAlign: "center" }}>Норма</TableCell>
                <TableCell sx={{ width: 120, textAlign: "center" }}>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
              {sCategoty?.map((item, index) => (
                <TableRow key={item.id} sx={{ padding: "0 10px" }}>
                  <TableCell sx={{ fontSize: "13px", padding: "4px 10px" }}>{index + 1}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "4px 10px" }}>{item.name}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "4px 10px" }}>{item.norm}</TableCell>
                  <TableCell sx={{ padding: "4px 10px" }}>
                    <ButtonGroup variant="outlined" size="small" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <IconButton onClick={() => handleEdit(item.id)} sx={{ color: "green" }}>
                        <EditIcon  sx={{fontSize:"20px"}}  />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)} sx={{ color: "red" }}>
                        <DeleteForeverIcon  sx={{fontSize:"20px"}}  />
                      </IconButton>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
        {selectedCategory && (
          <DeleteModal
            open={deleteModalOpen}
            onClose={() => { setDeleteModalOpen(false); setSelectedCategory(null) }}
            title="Удалить бренд?"
            text={`Вы уверены, что хотите удалить бренд "${selectedCategory.name}"?`}
            onConfirm={confirmDelete}
          />
        )}
        <AddCategory
          open={addModalOpen}
          onClose={() => { setAddModalOpen(false); }}
          onAdd={handleAddCategory}
        />
<EditCategory
  open={editModalOpen}
  onClose={() => {
    setEditModalOpen(false);
    setEditCategory(null);
  }}
  onEdit={handleEditSave}
  initialValue={editCategory?.name}
  initialNorm={editCategory?.norm}
/>
      </Box>
    </Container>
  )
}

export default SewingCategory
