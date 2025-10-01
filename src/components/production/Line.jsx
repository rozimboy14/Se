import { Box, Button, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ButtonGroup, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import DeleteModal from "../componet/DeleteModal";
import AddModal from "../componet/AddModal";
import EditModal from "../componet/EditModal";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { deleteLine, getLine, postLine, patchLine, getWarehouse } from "../api/axios";


function Line() {
  const [line, setLine] = useState([])
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [warehouse, setWarehouse] = useState([])
  const [loatingFetch, setLoadingFetch] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLine, setEditLine] = useState(null);


  const handleDelete = (id) => {
    const item = line.find((b) => b.id === id);
    setSelectedLine(item);
    setDeleteModalOpen(true);
  };


  useEffect(() => {
    if (warehouse.length > 0 && !selectedWarehouse) {
      setSelectedWarehouse(warehouse[0].id); // birinchi id ni default qilamiz
    }
  }, [warehouse]);

  useEffect(() => {
    const fetchWarehouse = async () => {
      setLoadingFetch(true)
      try {
        const response = await getWarehouse();
        setWarehouse(response.data)
        console.log(response.data);

      } catch (error) {
        console.log(error);

      } finally {
        setLoadingFetch(false)
      }
    }
    fetchWarehouse()
  }, [])




  useEffect(() => {
    const fetchLine = async () => {
      if (!selectedWarehouse) return; // tanlanmasa so‘rov yuborilmaydi
      setLoadingFetch(true);
      try {
        const response = await getLine(selectedWarehouse);
        setLine(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchLine();
  }, [selectedWarehouse]);

  // Add Brand
  const handleAddLine = async (item) => {
    const data = {
      warehouse:selectedWarehouse,  
      name: item
    }

    try {
      const response = await postLine(data);
      setLine(prev => [...prev, response.data]);
    } catch (err) {
      console.error("Add failed:", err);
    } finally {
      setAddModalOpen(false);
    }
  };

  const handleEdit = (id) => {
    const item = line.find((b) => b.id === id);
    setEditLine(item);
    setEditModalOpen(true);
  };


  const handleEditSave = async (newName) => {
    if (!editLine) return;
    try {
      const res = await patchLine(editLine.id, { name: newName });
      setLine(prev =>
        prev.map(b => (b.id === editLine.id ? res.data : b))
      );
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setEditModalOpen(false);
      setEditLine(null);
    }
  };

  // Delete Brand
  const confirmDelete = async () => {
    if (!selectedLine) return;
    try {
      await deleteLine(selectedLine.id);
      setLine(prev => prev.filter(b => b.id !== selectedLine.id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedLine(null);
    }
  };
  return (
    <Container maxWidth="full">
      <Box sx={{ width: "100%", height: "100%" }}>
        <Box sx={{ position: "relative" }}>

          <h3 style={{ textAlign: "center", margin: "0", marginBottom: "10px" }}>Линия</h3>
          <Button size="small" sx={{ fontSize: "10px", position: "absolute", right: "0", bottom: "0" }} variant="contained" onClick={() => setAddModalOpen(true)}>
            Добавит
          </Button>



          <Box sx={{ width: 100, position: "absolute", left: "0", bottom: "0" }}>
            <FormControl fullWidth>

              <NativeSelect
                value={selectedWarehouse || ""}   // controlled value
                onChange={(e) => setSelectedWarehouse(e.target.value)} // id saqlanadi
                defaultValue={warehouse.length > 0 ? warehouse[0].id : ""}
                sx={{ fontSize: "12px", cursor: "pointer" }}
                inputProps={{
                  name: 'Filial',
                  id: 'uncontrolled-native',
                }}
              >      {warehouse?.map((item) => (
                <option key={item.id} value={item.id} style={{ fontSize: "13px", cursor: "pointer" }}>
                  {item.name}
                </option>
              ))}

              </NativeSelect>
            </FormControl>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ width: "100%", minWidth: "0" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 60, padding: "5px 10px" }}>№</TableCell>
                <TableCell sx={{ width: '70%', textAlign: "center", padding: "5px 10px" }}>Названия</TableCell>
                <TableCell sx={{ width: 120, textAlign: "center", padding: "5px 10px" }}>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
              {line?.map((item, index) => (
                <TableRow key={item.id} sx={{ padding: "0 10px" }}>
                  <TableCell sx={{ fontSize: "12px", padding: "2px 10px" }}>{index + 1}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>{item.full_name}</TableCell>
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
        {selectedLine && (
          <DeleteModal
            open={deleteModalOpen}
            onClose={() => { setDeleteModalOpen(false); setSelectedLine(null) }}
            title="Удалить бренд?"
            text={`Вы уверены, что хотите удалить бренд "${selectedLine.name}"?`}
            onConfirm={confirmDelete}
          />
        )}
        <AddModal
          open={addModalOpen}
          onClose={() => { setAddModalOpen(false); }}
          onAdd={handleAddLine}
        />
        <EditModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditLine(null);
          }}
          onEdit={handleEditSave}
          initialValue={editLine?.name}
        />
      </Box>
    </Container>
  )
}

export default Line
