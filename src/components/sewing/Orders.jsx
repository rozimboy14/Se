import { Box, Button, Container, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ButtonGroup, IconButton } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import DeleteModal from "../componet/DeleteModal";

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
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { getOrders, postOrder, patchOrder, deleteOrder } from "../api/axios";
import AddOrders from "../componet/AddOrders";
import EditOrders from "../componet/EditOrders";

function Orders() {
         const theme = useTheme();
          const isDark = theme.palette.mode === "dark";
  const [orders, setOrders] = useState([]);
  const [loatingFetch, setLoadingFetch] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editOrders, setEditOrders] = useState(null);
  const [openRow, setOpenRow] = useState(null);

  const handleToggle = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  const handleDelete = (id) => {
    const item = orders.find((b) => b.id === id);
    setSelectedOrders(item);
    setDeleteModalOpen(true);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingFetch(true);
      try {
        const response = await getOrders();
        setOrders(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchOrders();
  }, []);

  const handleAddOrders = async (item) => {
    console.log(item);

    try {
      const response = await postOrder(item);
      setOrders((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Add failed:", err);
    } finally {
      setAddModalOpen(false);
    }
  };

  const handleEdit = (id) => {
    const item = orders.find((b) => b.id === id);
    setEditOrders(item);
    setEditModalOpen(true);
    console.log(editOrders);
  };

  const handleEditSave = async (newData) => {
    if (!editOrders) return;
    try {
      const res = await patchOrder(editOrders.id, newData);
      setOrders((prev) =>
        prev.map((b) => (b.id === editOrders.id ? res.data : b))
      );
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setEditModalOpen(false);
      setEditOrders(null);
    }
  };
  console.log(editOrders);

  const confirmDelete = async () => {
    if (!selectedOrders) return;
    try {
      await deleteOrder(selectedOrders.id);
      setOrders((prev) => prev.filter((b) => b.id !== selectedOrders.id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedOrders(null);
    }
  };
  console.log(selectedOrders);

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
            <h3 style={{margin:0,marginBottom:"8px"}}>Модель</h3>
          </Box>
          <Button
            size="small"
            sx={{ fontSize: "10px" }}
            variant="contained"
            onClick={() => setAddModalOpen(true)}
          >
            Добавит
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ width: "100%", minWidth: "0" ,padding:"2px 7px",fontSize:"12px",backgroundColor: isDark ? "#0e1c26" : "white", }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 40,padding:"2px 7px",fontSize:"12px" }} />
                <TableCell sx={{ width: "5%" ,padding:"2px 7px",fontSize:"12px" }}>№</TableCell>
                <TableCell sx={{ width: "15%", textAlign: "center",padding:"2px 7px",fontSize:"12px"}}>
                  Заказ
                </TableCell>
                <TableCell sx={{ width: "40%", textAlign: "center",padding:"2px 7px",fontSize:"12px" }}>
                  Модель
                </TableCell>
                <TableCell sx={{ width: "15%", textAlign: "center",padding:"2px 7px",fontSize:"12px" }}>
                  Заказчик
                </TableCell>
                <TableCell sx={{ width: "15%", textAlign: "center",padding:"2px 7px",fontSize:"12px" }}>
                  Примичения
                </TableCell>
                <TableCell sx={{ width: "15%", textAlign: "center",padding:"2px 7px",fontSize:"12px" }}>
                  Кол-во
                </TableCell>
                <TableCell sx={{ width: 120, textAlign: "center",padding:"2px 7px",fontSize:"12px" }}>
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.map((item, index) => (
                <React.Fragment key={item.id}>
                  <TableRow sx={{ padding: "0 10px" }}>
                    <TableCell  sx={{ textAlign: "center", fontSize: "14px", padding: "2px 5px" }}>
                      {(item.variant_link?.length > 0 ||
                        item.accessory_link?.length > 0) && (
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
                    <TableCell
                      sx={{ fontSize: "12px", padding: "2px 5px" }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", fontSize: "12px", padding: "2px 5px" }}
                    >
                      {item.specification_name}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", fontSize: "12px", padding: "2px 5px" }}
                    >
                      {item.article_name}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", fontSize: "12px", padding: "2px 5px" }}
                    >
                      {item.brand_name}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", fontSize: "12px", padding: "2px 5px" }}
                    >
                      {item.comment}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", fontSize: "12px", padding: "2px 5px" }}
                    >
                      {item.quantity}
                    </TableCell>
                    <TableCell sx={{ padding: "2px 5px" }}>
                      <ButtonGroup
                        variant="outlined"
                        size="small"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >
                        <IconButton
                          onClick={() => handleEdit(item.id)}
                          sx={{ color: "green" }}
                        >
                          <EditIcon  sx={{fontSize:"17px"}}/>
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(item.id)}
                          sx={{ color: "red" }}
                        >
                          <DeleteForeverIcon  sx={{fontSize:"17px"}}/>
                        </IconButton>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>

                  {/* Collapse qismi */}
                  <TableRow>
                    <TableCell colSpan={8} sx={{ padding: 0 }}>
                      <Collapse in={openRow === item.id} timeout="auto" unmountOnExit  sx={{padding:"3px 10px"}}>
                               <Paper sx={{
                                  padding: "3px",
                                                  marginY: "2px",
                          backgroundColor: isDark ? "#1e2a35" : "#eef2f3",
                          boxShadow: 2,
                          borderRadius: 2,
                        }}>
                          {/* Variantlar */}
                          {item.variant_link?.length > 0 && (
                            <>
                    
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{fontSize:"12px"}}>№</TableCell>
                                    <TableCell sx={{fontSize:"12px"}}>Вариант</TableCell>
                          
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {item.variant_link.map((variant,idx) => (
                                    <TableRow key={variant.id}>
                                      <TableCell sx={{fontSize:"12px"}}>{idx+1}</TableCell>
                                      <TableCell sx={{fontSize:"12px"}}>{variant.name}</TableCell>
                             
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </>
                          )}

                          {/* Accessorylar */}
                          {/* {item.accessory_link?.length > 0 && (
                            <>
                              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                                Accessories
                              </Typography>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Order</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {item.accessory_link.map((acc) => (
                                    <TableRow key={acc.id}>
                                      <TableCell>{acc.id}</TableCell>
                                      <TableCell>{acc.accessory_name}</TableCell>
                                      <TableCell>{acc.quantity}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </>
                          )} */}
                        </Paper>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedOrders && (
          <DeleteModal
            open={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setSelectedOrders(null);
            }}
            title="Удалить заказ?"
            text={`Вы уверены, что хотите удалить заказ "${selectedOrders.article_name}"?`}
            onConfirm={confirmDelete}
          />
        )}
        <AddOrders
          open={addModalOpen}
          onClose={() => {
            setAddModalOpen(false);
          }}
          onAdd={handleAddOrders}
        />
        <EditOrders
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditOrders(null);
          }}
          onUpdate={handleEditSave}
          initialData={editOrders}
        />
      </Box>
    </Container>
  );
}

export default Orders;
