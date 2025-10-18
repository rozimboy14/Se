import { Box, Button, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ButtonGroup, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
    Collapse,
  Paper,
    Typography,
} from "@mui/material";
import { deleteAccessoryStockEntry, deleteStockEntry, getAccessoryStockEntry, getStock, getStockEntry, getStockTotalEntry, getStockTotalEntryDetail, patchAccessoryStockEntry, patchStockEntry, patchStockTotalEntry, postAccessoryStockEntry, postStockEntry, postStockEntryBulk } from "../api/axios";
import EditTotalEntry from "../componet/EditTotalEntry";
import { useParams, useSearchParams } from "react-router-dom";
import AddStockEntry from "../componet/AddStockEntry";
import DeleteModal from "../componet/DeleteModal";
import EditStockEntry from "../componet/EditStockEntry";
import AddAccessoryStockEntry from "../componet/AddAccessoryStockEntry";
import EditStockAccessoryEntry from "./modal/EditStockAccessoryEntry";


function StockEntry() {
  const [stockEntry, setStockEntry] = useState([])
  const [accessoryStockEntry, setAccessoryStockEntry] = useState([])
  const [loatingFetch, setLoadingFetch] = useState(false)
  const [selectedItem , setSelectedItem] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalAccessoryOpen, setAddModalAccessoryOpen] = useState(false);
  const [editAccessoryModalOpen, setEditAccessoryModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStockEntry, setEditStockEntry] = useState(null);
  const [editAccessoryStockEntry, setEditAccessoryStockEntry] = useState(null);
  const { totalEntryId } = useParams();
  const [searchParams] = useSearchParams();
  const created_date = searchParams.get("created_date");
  const comment = searchParams.get("comment");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [openRow, setOpenRow] = useState(null);

  const handleToggle = (id) => {
    setOpenRow(openRow === id ? null : id);
  };
const handleDelete = (id, type) => {
  let item;
  if(type === "stock") {
    item = stockEntry.stock_entries?.find(b => b.id === id);
  } else if(type === "accessory") {
    item = stockEntry.accessory_stock_entries?.find(b => b.id === id);
  }

console.log(item);

  setSelectedItem({ ...item, type });
  console.log({ ...item, type });
  setDeleteModalOpen(true);
};
  const formatDateUzbek = (dateString) => {
    if (!dateString) return "";

    // "22.08.2025 12:39" → ["22.08.2025", "12:39"]
    const [datePart] = dateString.split(" ");
    const [day, month, year] = datePart.split(".").map(Number);

    const date = new Date(year, month - 1, day); // Oy 0-indeksli!
    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("uz-UZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      console.log("id",totalEntryId);
      
      setLoadingFetch(true)
      try {
        const response = await getStockTotalEntryDetail(totalEntryId);
        setStockEntry(response.data)
        console.log(response.data);

      } catch (error) {
        console.log(error);

      } finally {
        setLoadingFetch(false)
      }
    }
    fetchOrders()
  }, [])
  useEffect(() => {
    const fetchAccessory = async () => {
      setLoadingFetch(true)
      try {
        const response = await getAccessoryStockEntry(totalEntryId);
        setAccessoryStockEntry(response.data)
        console.log(response.data);

      } catch (error) {
        console.log(error);

      } finally {
        setLoadingFetch(false)
      }
    }
    fetchAccessory()
  }, [])


  const handleAddStockEntry = async (items) => {
    console.log(items);
    console.log(totalEntryId);
  
  const payload = {
    total_entry: totalEntryId,
    orders: items.orders.map(item => ({
      order: item.order,
      variants: item.variants.map(v => ({
        variant: v.variant,
        quantity: Number(v.quantity)
      }))
    }))
  };


            console.log(items);
            console.log(payload);

    try {
      const response = await postStockEntry(payload);
     setStockEntry(prev => ({
  ...prev,
  stock_entries: [
    ...(prev.stock_entries || []),
    ...(Array.isArray(response.data) ? response.data : [response.data]),
  ],
}));
    } catch (err) {
      console.error("Add failed:", err);
    } finally {
      setAddModalOpen(false);
    }
  };

  const handleAddAccessoryStockEntry = async (item) => {
    const data = item.map(entry => ({
      total_entry: totalEntryId,
      accessory_id: entry.accessory,
      quantity: Number(entry.quantity)
    }));


    console.log(item);
    console.log(data);

    try {
      const response = await postAccessoryStockEntry(data);
     setStockEntry(prev => ({
  ...prev,
  accessory_stock_entries: [
    ...(prev.accessory_stock_entries || []),
    ...(Array.isArray(response.data) ? response.data : [response.data])
  ]
}));

    } catch (err) {
      console.error("Add failed:", err);
    } finally {
      setAddModalOpen(false);
    }
  };

  const handleEdit = (id) => {
    const item = stockEntry.stock_entries.find((b) => b.id === id);
    setEditStockEntry(item);
    console.log(item);

    setEditModalOpen(true);
    console.log(editStockEntry);

  };
  const handleEditAccessory = (id) => {
    const item = stockEntry.accessory_stock_entries.find((b) => b.id === id);
    setEditAccessoryStockEntry(item);
    console.log(item);

    setEditAccessoryModalOpen(true);


  };

  const handleEditSave = async (newName) => {
    console.log(newName);
      const payload = {

      order: newName.order,
      variants: newName.variants?.map(v => ({
        variant: v.variant,
        quantity: Number(v.quantity)
      }))
  };
  console.log(`payload`, payload);
    if (!editStockEntry) return;
    try {
      const res = await patchStockEntry(editStockEntry.id,payload);
      setStockEntry(prev =>
        prev.map(b => (b.id === editStockEntry.id ? res.data : b))
      );
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setEditModalOpen(false);
      setEditStockEntry(null);
    }
  };
  const handleEditAccessorySave = async (newName) => {

    if (!editAccessoryStockEntry) return;
    try {
      const res = await patchAccessoryStockEntry(editAccessoryStockEntry.id, { accssory: newName.accessory, quantity: newName.quantity });
      setStockEntry(prev =>
        prev.map(b => (b.id === editAccessoryStockEntry.id ? res.data : b))
      );
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setEditModalOpen(false);
      setEditAccessoryStockEntry(null);
    }
  };

const confirmDelete = async () => {
  if (!selectedItem) return;

  try {
    if (selectedItem.type === "stock") {
      await deleteStockEntry(selectedItem.id);
      setStockEntry.stock_entries(prev => prev.filter(b => b.id !== selectedItem.id));
    } else if (selectedItem.type === "accessory") {
      await deleteAccessoryStockEntry(selectedItem.id);
      setStockEntry.accessory_stock_entries(prev => prev.filter(b => b.id !== selectedItem.id));
    }
  } catch (err) {
    console.error("Delete failed:", err);
  } finally {
    setDeleteModalOpen(false);
    setSelectedItem(null);
  }
};


  return (
    <Container maxWidth="full">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

        <h3 style={{ textAlign: "center", margin: "0" }}>{formatDateUzbek(created_date)}</h3>
        <p style={{ margin: "0" }}>{comment}</p>
      </div>
      <Box sx={{ width: "100%", height: "100%", display: "flex", gap: "5px", marginTop: "10px" ,position:"relative"}}>

        <Box sx={{ width: "50%" }}>
          <h3 style={{ textAlign: "center", marginBottom: "20px",marginTop:"0" }}>Модель</h3>
          <Button size="small" sx={{ fontSize: "10px", marginBottom: "6px", position:"absolute",left:"0", top:"14px",padding:"3px"}} variant="contained" onClick={() => setAddModalOpen(true)}>
            Крой
          </Button>
          <TableContainer component={Paper} sx={{ width: "100%", minWidth: "0" }}>
            <Table>
              <TableHead>
                <TableRow>
                                  <TableCell sx={{ width: 20,padding:"2px 7px",fontSize:"12px" }} />
                  <TableCell sx={{ width: "5%", fontSize: "11px", padding: "6px" }}>№</TableCell>
                  <TableCell sx={{ width: '20%', textAlign: "center", fontSize: "11px", padding: "6px" }}>Заказчик</TableCell>
                  <TableCell sx={{ width: '55%', textAlign: "center", fontSize: "11px", padding: "6px" }}>Сезон</TableCell>
                  <TableCell sx={{ width: '10%', textAlign: "center", fontSize: "11px", padding: "6px" }}>Кол-во</TableCell>
                  <TableCell sx={{ width: "10%", textAlign: "center", fontSize: "11px", padding: "6px" }}>Действия</TableCell>
                  {/* <TableCell sx={{ width: 120, textAlign: "center" }}>Действия</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody >
                {stockEntry?.stock_entries?.map((item, index) => (
                                  <React.Fragment key={`${item.id ?? 'new'}-${index}`}>

                             
                  <TableRow  sx={{ padding: "0 10px" }}>
                      <TableCell  sx={{ textAlign: "center", fontSize: "14px", padding: "2px 5px" }}>
                                          {(item.variants?.length > 0 ||
                                            item.accessorys?.length > 0) && (
                                              <IconButton
                                                size="small"
                                                onClick={() => handleToggle(item.id)}
                                              >
                                                {openRow === item.id ? (
                                                  <KeyboardArrowUp  sx={{fontSize:"20px"}}/>
                                                ) : (
                                                  <KeyboardArrowDown sx={{fontSize:"20px"}} />
                                                )}
                                              </IconButton>
                                            )}
                                        </TableCell>
                    <TableCell sx={{ fontSize: "12px", padding: "2px 10px" }}>{index + 1}</TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>{item.brand_name}</TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>{item.order_name}</TableCell>

                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>{item.total_quantity}</TableCell>
                    <TableCell sx={{ padding: "2px 10px" }}>
                      <ButtonGroup variant="outlined" size="small" sx={{ display: "flex", alignItems: "center", justifyContent: "center", }}>
                        <IconButton onClick={() => handleEdit(item.id)} sx={{ color: "green" }}>
                          <EditIcon sx={{fontSize:"17px"}}/>
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item.id,"stock")} sx={{ color: "red" }}>
                          <DeleteForeverIcon sx={{fontSize:"17px"}}/>
                        </IconButton>
                      </ButtonGroup>
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
                      <TableRow>
                                      <TableCell colSpan={8} sx={{ padding: 0 }}>
                                        <Collapse in={openRow === item.id} timeout="auto" unmountOnExit>
                                          <Box margin={1}>
                                            {/* Variantlar */}
                                            {item.variants.length > 0 && (
                                              <>
                                                <Typography variant="subtitle1" gutterBottom>
                                                  Variants
                                                </Typography>
                                                <Table size="small">
                                                  <TableHead>
                                                    <TableRow>
                                                      <TableCell sx={{fontSize:"12px"}}>№</TableCell>
                                                      <TableCell sx={{fontSize:"12px"}}>Вариант</TableCell>
                                                      <TableCell sx={{fontSize:"12px"}}>Кол-во</TableCell>
                                            
                                                    </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                    {item.variants.map((variant,idx) => (
                                                      <TableRow key={variant.id}>
                                                        <TableCell sx={{fontSize:"12px"}}>{idx+1}</TableCell>
                                                        <TableCell sx={{fontSize:"12px"}}>{variant.variant_name}</TableCell>
                                                        <TableCell sx={{fontSize:"12px"}}>{variant.quantity}</TableCell>
                                               
                                                      </TableRow>
                                                    ))}
                                                  </TableBody>
                                                </Table>
                                              </>
                                            )}
                  
                                  
                                          </Box>
                                        </Collapse>
                                      </TableCell>
                                    </TableRow>
     </React.Fragment>
                  
                ))}


              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <div style={{ width: "4px", height: "700px", backgroundColor: "#eee" }}></div>
        <Box sx={{ width: "50%" }} >
          
          <h3 style={{ textAlign: "center", marginBottom: "20px",marginTop:"0" }}>Accessory</h3>

          <Button size="small" sx={{ fontSize: "10px", marginBottom: "6px" ,position:"absolute",right:"0" ,top:"14px"}} variant="contained" onClick={() => setAddModalAccessoryOpen(true)}>
            Аксессуарь
          </Button>
          <TableContainer component={Paper} sx={{ width: "100%", minWidth: "0" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "5%", padding: "6px", fontSize: "11px" }}>№</TableCell>
                  <TableCell sx={{ width: '15%', textAlign: "center", fontSize: "11px", padding: "6px" }}>Заказчик</TableCell>
                  <TableCell sx={{ width: '15%', textAlign: "center", fontSize: "11px", padding: "6px" }}>Називания</TableCell>
                  <TableCell sx={{ width: '30%', textAlign: "center", fontSize: "11px", padding: "6px" }}>Примичения</TableCell>
                  <TableCell sx={{ width: '20%', textAlign: "center", fontSize: "11px", padding: "6px" }}>Кол-во</TableCell>
                  <TableCell sx={{ width: "15%", textAlign: "center", fontSize: "11px", padding: "6px" }}>Действия</TableCell>
                  {/* <TableCell sx={{ width: 120, textAlign: "center" }}>Действия</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody >

                {stockEntry?.accessory_stock_entries?.map((item, index) => (
                  <TableRow key={`${item.id ?? 'new'}-${index}`} sx={{ padding: "0 10px" }}>
                    <TableCell sx={{ fontSize: "14px", padding: "2px 10px" }}>{index + 1}</TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>{item.accessory.brand_name}</TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>{item.accessory.name}</TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>{item.accessory.comment}</TableCell>

                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>{item.quantity}</TableCell>
                    <TableCell sx={{ padding: "2px 10px" }}>
                      <ButtonGroup variant="outlined" size="small" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                        <IconButton onClick={() => handleEditAccessory(item.id)} sx={{ color: "green" }}>
                          <EditIcon  sx={{fontSize:"18px"}}/>
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item.id,"accessory")} sx={{ color: "red" }}>
                          <DeleteForeverIcon   sx={{fontSize:"18px"}}/>
                        </IconButton>
                      </ButtonGroup>
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
        </Box>

   {selectedItem && (
  <DeleteModal
    open={deleteModalOpen}
    onClose={() => { setDeleteModalOpen(false); setSelectedItem(null); }}
    title="Удалить?"
    text={`Вы уверены, что хотите удалить ${selectedItem.type === 'stock' ? 'бренд' : 'аксессуар'} ""?`}
    onConfirm={ confirmDelete}
  />
)}
        <AddStockEntry
          open={addModalOpen}
          onClose={() => { setAddModalOpen(false); }}
          onAdd={handleAddStockEntry}
        />
        <AddAccessoryStockEntry
          openAccessory={addModalAccessoryOpen}
          onCloseAccesory={() => { setAddModalAccessoryOpen(false); }}
          onAddAccessory={handleAddAccessoryStockEntry}
        />
        <EditStockEntry
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditStockEntry(null);
          }}
                    initialData={editStockEntry}
                    
                    onEdit={handleEditSave}
                    />

        <EditStockAccessoryEntry
          open={editAccessoryModalOpen}
          onClose={() => {
            setEditAccessoryModalOpen(false);
            setEditAccessoryStockEntry(null);
          }}
          onEdit={handleEditAccessorySave}
          initialData={editAccessoryStockEntry}
        />
      </Box>
    </Container>
  )
}


export default StockEntry
