import { Box, Button, Container, InputAdornment, TextField, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ButtonGroup, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import DeleteModal from "../componet/DeleteModal";
import AddModal from "../componet/AddModal";
import EditModal from "../componet/EditModal";
import { Pagination } from "@mui/material";
import { Select, MenuItem } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { deleteBrand, getBrand, postBrand, patchBrand } from "../api/axios";
import EditBrand from "../componet/EditBrand";
import AddBrand from "../componet/AddBrand";
import SearchIcon from "@mui/icons-material/Search";
function Brand() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [brand, setBrand] = useState([])
  const [loatingFetch, setLoadingFetch] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const handleDelete = (id) => {
    const item = brand.find((b) => b.id === id);
    setSelectedBrand(item);
    setDeleteModalOpen(true);
  };



  const handleSearch = () => {
    setSearchQuery(searchText);
    setPage(1); // qidiruvda sahifani 1 ga qaytarish
  };

  useEffect(() => {
    const fetchBrand = async () => {
      setLoadingFetch(true);
      try {
        const response = await getBrand({
          search: searchQuery, // searchQuery ishlaydi
          page,
          page_size: pageSize
        });
        setBrand(response.data.results);
        setCount(response.data.count);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchBrand();
  }, [searchQuery, page, pageSize]);


  // Add Brand
  const handleAddBrand = async (formData) => {

    console.log(formData);

    try {
      const response = await postBrand(formData);
      setBrand(prev => [...prev, response.data]);
    } catch (err) {
      console.error("Add failed:", err);
    } finally {
      setAddModalOpen(false);
    }
  };

  const handleEdit = (id) => {
    const item = brand.find((b) => b.id === id);
    setEditBrand(item);
    setEditModalOpen(true);
  };


  const handleEditSave = async (formData) => {
    if (!editBrand) return;
    try {
      const res = await patchBrand(editBrand.id, formData);
      setBrand(prev =>
        prev.map(b => (b.id === editBrand.id ? res.data : b))
      );
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setEditModalOpen(false);
      setEditBrand(null);
    }
  };

  // Delete Brand
  const confirmDelete = async () => {
    if (!selectedBrand) return;
    try {
      await deleteBrand(selectedBrand.id);
      setBrand(prev => prev.filter(b => b.id !== selectedBrand.id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedBrand(null);
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
      
            <h3 style={{ margin: 0, marginBottom: "6px" }}>Заказчик</h3>
        
          <Button size="small" sx={{ fontSize: "10px" }} variant="contained" onClick={() => setAddModalOpen(true)}>
            Добавит
          </Button>




        </Box>
        <TableContainer component={Paper} sx={{
          width: "100%", minWidth: "0", backgroundColor: isDark ? "#0e1c26" : "white", maxHeight: "100%",  // vertikal scroll uchun maksimal balandlik
          overflowY: "auto", // vertikal scroll
          overflowX: "auto",
        }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 60, fontSize: "12px", padding: "5px 10px" }}>№</TableCell>
                <TableCell sx={{ width: 100, fontSize: "12px", padding: "5px 10px" }}>ID</TableCell>
                <TableCell sx={{ width: '70%', textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>Названия</TableCell>
                <TableCell sx={{ width: '70%', textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>Названия</TableCell>
                <TableCell sx={{ width: 120, textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody  >
              {brand?.map((item, index) => (
                <TableRow key={item.id} sx={{ padding: "0 10px", height: "70px" }}>
                  <TableCell sx={{ fontSize: "13px", padding: "2px 10px", height: "100%" }}>{index + 1}</TableCell>
                  <TableCell sx={{ fontSize: "13px", padding: "2px 10px", height: "100%" }}>{item.id} </TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px", height: "100%" }}>{item.name}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px", height: "100%" }}> <img style={{ width: "80px", height: "50px" }} src={item.image} alt="" /> </TableCell>
                  <TableCell sx={{ padding: "6px 10px", }}>
                    <ButtonGroup variant="outlined" size="small" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <IconButton onClick={() => handleEdit(item.id)} sx={{ color: "green" }}>
                        <EditIcon sx={{ fontSize: "18px", color: isDark ? "white" : "" }} />
                      </IconButton >
                      <IconButton onClick={() => handleDelete(item.id)} sx={{ color: "red" }}>
                        <DeleteForeverIcon sx={{ fontSize: "18px", color: "#f71e06" }} />
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
            {[10, 20, 30].map((s) => (
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
        {selectedBrand && (
          <DeleteModal
            open={deleteModalOpen}
            onClose={() => { setDeleteModalOpen(false); setSelectedBrand(null) }}
            title="Удалить бренд?"
            text={`Вы уверены, что хотите удалить бренд "${selectedBrand.name}"?`}
            onConfirm={confirmDelete}
          />
        )}
        <AddBrand
          open={addModalOpen}
          onClose={() => { setAddModalOpen(false); }}
          onAdd={handleAddBrand}
        />
        <EditBrand
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditBrand(null);
          }}
          onEdit={handleEditSave}
          initialValue={editBrand}
        />

      </Box>
    </Container>
  );
}

export default Brand;
