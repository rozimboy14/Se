import { Box, Button, Container, useTheme,InputAdornment, TextField } from "@mui/material";
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
import SearchIcon from "@mui/icons-material/Search";

import { Pagination } from "@mui/material";
import { Select, MenuItem } from "@mui/material";
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
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [count, setCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");


  const handleDelete = (id) => {
    const item = article.find((b) => b.id === id);
    setSelectedArticle(item);
    setDeleteModalOpen(true);
  };
  const handleSearch = () => {
    setSearchQuery(searchText);
    setPage(1); // qidiruvda sahifani 1 ga qaytarish
  };
  useEffect(() => {
    const fetchArticle = async () => {
      setLoadingFetch(true)
      try {
        const response = await getArticle({
          search: searchQuery, // searchQuery ishlaydi
          page,
          page_size: pageSize
        });
        setArticle(response.data.results)
               setCount(response.data.count);
        console.log(response.data.results);

      } catch (error) {
        console.log(error);

      } finally {
        setLoadingFetch(false)
      }
    }
    fetchArticle()
  }, [searchQuery, page, pageSize])

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
      <Box sx={{ width: "100%", height: "740px" }}>
        <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px" }}>
          
                    <TextField
                      size="small"
                      placeholder="Поиск..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
                   sx={{ 
              "& .MuiInputBase-root": { height: 25, fontSize: 12, paddingRight: 2 } 
            }}
                      InputProps={{
          
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleSearch} edge="end"  sx={{
                      "&:hover": { backgroundColor: "transparent" } // hover effektni olib tashlash
                    }} >
                              <SearchIcon sx={{ fontSize: "17px" }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
 
            <h3 style={{ margin: 0, marginBottom: "8px" }}>Модель</h3>

          <Button size="small" sx={{ fontSize: "10px" }} variant="contained" onClick={() => setAddModalOpen(true)}>
            Добавит
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ width: "100%", minWidth: "0", backgroundColor: isDark ? "#0e1c26" : "white", maxHeight: "100%",  // vertikal scroll uchun maksimal balandlik
          overflowY: "auto", // vertikal scroll
          overflowX: "auto",}}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 60, fontSize: "12px", padding: "5px 10px" }}>№</TableCell>

                <TableCell sx={{ width: '30%', textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>Названия</TableCell>
                <TableCell sx={{ width: '15%', textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>Артикул</TableCell>
                <TableCell sx={{ width: '15%', textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>Заказчик</TableCell>
                <TableCell sx={{ width: '15%', textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>Категория шитья</TableCell>
                <TableCell sx={{ width: '15%', textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>Категория упаковки</TableCell>
                <TableCell sx={{ width: 120, textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>Действия</TableCell>
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
                        <EditIcon sx={{ fontSize: "18px" }} />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)} sx={{ color: "red" }}>
                        <DeleteForeverIcon sx={{ fontSize: "18px" }} />
                      </IconButton>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                  <Select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(e.target.value);
                      setPage(1);
                    }}
                    size="small"
                    sx={{ fontSize: "12px", padding: "1px" }}
                  >
                    {[25, 50, 75].map((s) => (
                      <MenuItem key={s} value={s}>{s} на страницу</MenuItem>
                    ))}
                  </Select>
        
                  <Pagination
                    count={Math.ceil(count / pageSize)}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                    size="small"
                  />
                </Box>
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
