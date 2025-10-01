import { Box, Button, Container, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ButtonGroup, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import DeleteModal from "../componet/DeleteModal";
import AddArticle from "../componet/AddArticle";
import EditArticle from "../componet/EditArticle"; 

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { getArticle, postArticle, patchArticle, deleteArticle } from "../api/axios";



function Article() {
         const theme = useTheme();
          const isDark = theme.palette.mode === "dark";
  const [article, setArticle] = useState([])
  const [loatingFetch, setLoadingFetch] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editArticel, setEditArtcile] = useState(null);



  const handleDelete = (id) => {
    const item = article.find((b) => b.id === id);
    setSelectedArticle(item);
    setDeleteModalOpen(true);
  };

  useEffect(() => {
    const fetchArticle = async () => {
      setLoadingFetch(true)
      try {
        const response = await getArticle();
        setArticle(response.data)
        console.log(response.data);

      } catch (error) {
        console.log(error);

      } finally {
        setLoadingFetch(false)
      }
    }
    fetchArticle()
  }, [])

  const handleAddArticle = async (item) => {
    console.log(`item`, item);
  try {
    const response = await postArticle(item); // API chaqiramiz
    setArticle((prev) => [...prev, response.data]); // state yangilanadi
  } catch (err) {
    console.error("Add failed:", err);
  } finally {
    setAddModalOpen(false);
  }
};

  const handleEdit = (id) => {
    const item = article.find((b) => b.id === id);
    setEditArtcile(item);
    setEditModalOpen(true);
  };


  const handleEditSave = async (newData) => {
    console.log(`newData`, newData);
    if (!editArticel) return;
    try {
      const res = await patchArticle(editArticel.id, newData);
      setArticle(prev =>
        prev.map(b => (b.id === editArticel.id ? res.data : b))
      );
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setEditModalOpen(false);
      setEditArtcile(null);
    }
  };


  const confirmDelete = async () => {
    if (!selectedArticle) return;
    try {
      await deleteArticle(selectedArticle.id);
      setArticle(prev => prev.filter(b => b.id !== selectedArticle.id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedArticle(null);
    }
  };


  
  return (
    <Container maxWidth="full">
      <Box sx={{ width: "100%", height: "100%" }}>
        <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px" }}>
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <h3 style={{margin:0,marginBottom:"8px"}}>Модель</h3>
          </Box>
          <Button size="small" sx={{ fontSize: "10px" }} variant="contained" onClick={() => setAddModalOpen(true)}>
            Добавит
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ width: "100%", minWidth: "0" ,backgroundColor: isDark ? "#0e1c26" : "white", }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 60,fontSize:"12px",padding:"5px 10px"  }}>№</TableCell>

                <TableCell sx={{ width: '30%', textAlign: "center",fontSize:"12px",padding:"5px 10px" }}>Названия</TableCell>
                <TableCell sx={{ width: '15%', textAlign: "center",fontSize:"12px",padding:"5px 10px" }}>Артикул</TableCell>
                <TableCell sx={{ width: '15%', textAlign: "center",fontSize:"12px",padding:"5px 10px" }}>Заказчик</TableCell>
                <TableCell sx={{ width: '15%', textAlign: "center",fontSize:"12px",padding:"5px 10px" }}>Категория шитья</TableCell>
                <TableCell sx={{ width: '15%', textAlign: "center",fontSize:"12px",padding:"5px 10px" }}>Категория упаковки</TableCell>
                <TableCell sx={{ width: 120, textAlign: "center",fontSize:"12px",padding:"5px 10px" }}>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
              {article?.map((item, index) => (
                <TableRow key={item.id} sx={{ padding: "0 10px" }}>
                  <TableCell sx={{ fontSize: "13px", padding: "2px 10px" }}>{index + 1}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{item.name}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{item.article}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{item.brand_name}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{item.sewing_category_name}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{item.packaging_category_name}</TableCell>
                  <TableCell sx={{ padding: "2px 10px" }}>
                    <ButtonGroup variant="outlined" size="small" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <IconButton onClick={() => handleEdit(item.id)} sx={{ color: "green" }}>
                        <EditIcon sx={{fontSize:"18px"}} />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)} sx={{ color: "red" }}>
                        <DeleteForeverIcon   sx={{fontSize:"18px"}} />
                      </IconButton>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
        {selectedArticle && (
          <DeleteModal
            open={deleteModalOpen}
            onClose={() => { setDeleteModalOpen(false); setSelectedArticle(null) }}
            title="Удалить бренд?"
            text={`Вы уверены, что хотите удалить бренд "${selectedArticle.name}"?`}
            onConfirm={confirmDelete}
          />
        )}
        <AddArticle
          open={addModalOpen}
          onClose={() => { setAddModalOpen(false); }}
          onAdd={handleAddArticle}
        />
        <EditArticle
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditArtcile(null);
          }}
          onUpdate={handleEditSave}
          initialData={editArticel}

        />

      </Box>
    </Container>
  )
}

export default Article
