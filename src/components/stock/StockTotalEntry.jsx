import { Backdrop, Box, Button, Container, Fade, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ButtonGroup, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { confirmStockTotalEntry, deleteStockTotalEntry, getStockTotalEntry, getTotalEntryExportPdf, patchStockTotalEntry, postStockTotalEntry } from "../api/axios";
import EditTotalEntry from "../componet/EditTotalEntry";
import AddTotalEntry from "../componet/AddTotalEntry";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../componet/DeleteModal";
import { formatNumber } from "../utils/formatNumber";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function StockTotalEntry() {
  const [stockTotalEntry, setStockTotalEntry] = useState([])
  const [loatingFetch, setLoadingFetch] = useState(false)
  const [selectedTotalEntry, setSelectedTotalEntry] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTotalEntry, setEditTotalEntry] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ confirmedId ,setConfirmedId] = useState(null)
  const [ confirmedModal ,setConfirmedModal] = useState(false)
  const navigate = useNavigate();

  const handleDelete = (id) => {
    const item = stockTotalEntry.find((b) => b.id === id);
    setSelectedTotalEntry(item);
    setDeleteModalOpen(true);
  };

const handleExportPDF = async (id) => {
  try {
    const response = await getTotalEntryExportPdf(id);
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'accessory_stock.pdf'); // fayl nomi
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
        const response = await getStockTotalEntry();
        setStockTotalEntry(response.data)
        console.log(response.data);

      } catch (error) {
        console.log(error);

      } finally {
        setLoadingFetch(false)
      }
    }
    fetchOrders()
  }, [])
  console.log(stockTotalEntry);

  const handleAddTotalEntry = async (item) => {


    try {
      const response = await postStockTotalEntry(item);
      setStockTotalEntry(prev => [...prev, response.data]);
    } catch (err) {
      console.error("Add failed:", err);
    } finally {
      setAddModalOpen(false);
    }
  }
  const handleEdit = (id) => {
    const item = stockTotalEntry.find((b) => b.id === id);
    setEditTotalEntry(item);
    setEditModalOpen(true);
  };

  const handleClose = ()=>{
    setConfirmedId(null)
    setConfirmedModal(false)
  }

  const handleEditSave = async (newName) => {
    console.log(newName);
    if (!editTotalEntry) return;
    try {
      const res = await patchStockTotalEntry(editTotalEntry.id, { created_date: newName.created_date, comment: newName.comment });
      setStockTotalEntry(prev =>
        prev.map(b => (b.id === editTotalEntry.id ? res.data : b))
      );
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setEditModalOpen(false);
      setEditTotalEntry(null);
    }
  };

  const confirmDelete = async () => {
    if (!selectedTotalEntry) return;
    try {
      await deleteStockTotalEntry(selectedTotalEntry.id);
      setStockTotalEntry(prev => prev.filter(b => b.id !== selectedTotalEntry.id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedTotalEntry(null);
    }
  };
  const handleConfirm = async (id) => {
  try {
    const res = await confirmStockTotalEntry(id);
    console.log(res.data.detail); 
  } catch (err) {
    console.error(err.response?.data);
  }
};
  return (
    <Container maxWidth="full">
      <Box sx={{ width: "100%", height: "100%" }}>
        <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px" }}>
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <h3>Модель</h3>
          </Box>
          <Button size="small" sx={{ fontSize: "12px" }} variant="contained" onClick={() => setAddModalOpen(true)}>
            Добавит
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ width: "100%", minWidth: "0" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "5%", fontSize: "11px", padding: "5px 10px" }}>№</TableCell>

                <TableCell sx={{ width: '10%', textAlign: "center", fontSize: "11px", padding: "5px 10px" }}>Филиал</TableCell>
                <TableCell sx={{ width: '20%', textAlign: "center", fontSize: "11px", padding: "5px 10px" }}>Дата Приход</TableCell>
                <TableCell sx={{ width: '20%', textAlign: "center", fontSize: "11px", padding: "5px 10px" }}>Примичения</TableCell>
                <TableCell sx={{ width: '15%', textAlign: "center", fontSize: "11px", padding: "5px 10px" }}>Кол-во Крой</TableCell>
                <TableCell sx={{ width: '15%', textAlign: "center", fontSize: "11px", padding: "5px 10px" }}>Кол-во аксессуарь</TableCell>
                <TableCell sx={{ width: "15%", textAlign: "center", fontSize: "11px", padding: "5px 10px" }}>Действия</TableCell>
                {/* <TableCell sx={{ width: 120, textAlign: "center" }}>Действия</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody >
              {stockTotalEntry?.map((item, index) => (
                <TableRow key={item.id} sx={{ padding: "0 10px" }}>
                  <TableCell sx={{ fontSize: "13px", padding: "2px 10px" }}>{index + 1}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{item.warehouse_name}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{item.created_date}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{item.comment}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{formatNumber(item.total_quantity)}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{formatNumber(item.total_quantity_accessory)}</TableCell>
                  <TableCell sx={{ padding: "2px 10px" }}>
                    <ButtonGroup variant="outlined" size="small" sx={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", }}>
                      <IconButton onClick={() => handleEdit(item.id)} sx={{ color: "green" }}>
                        <EditIcon sx={{ fontSize: "17px" }} />
                      </IconButton>
                      <IconButton onClick={() => {setConfirmedModal(true);setConfirmedId(item.id) } } sx={{ color: "red" }}   disabled={item.confirmed}  >
                        <CheckCircleIcon sx={{ fontSize: "17px" }} />
                      </IconButton>
                      <IconButton onClick={() => handleExportPDF(item.id) }     >
                        <FileDownloadIcon sx={{ fontSize: "17px" }} />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)} sx={{ color: "red" }}>
                        <DeleteForeverIcon sx={{ fontSize: "17px" }} />
                      </IconButton>
                      <Button onClick={() =>
                        navigate(
                          `/stock/stock_total_entry/${item.id}?created_date=${encodeURIComponent(
                            item.created_date
                          )}&comment=${encodeURIComponent(item.comment)}`
                        )

                      } >
                        <ArrowForwardIosIcon sx={{ fontSize: "13px" }} />
                      </Button>
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


  <Modal
  aria-labelledby="transition-modal-title"
  aria-describedby="transition-modal-description"
  open={confirmedModal}
  onClose={handleClose}
  closeAfterTransition
  slots={{ backdrop: Backdrop }}
  slotProps={{
    backdrop: {
      timeout: 500,
    },
  }}
>
  <Fade in={confirmedModal}>
    <Box sx={style}>
      <Typography id="transition-modal-title" variant="h6" component="h2">
        Kirimni tasdiqlash
      </Typography>
      <Typography id="transition-modal-description" sx={{ mt: 2 }}>
        Siz ushbu kirimni tasdiqlamoqchimisiz?
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
        >
          Bekor qilish
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            handleConfirm(confirmedId); // tasdiqlash API chaqiriladi
            handleClose();              // modal yopiladi
          }}
        >
          Tasdiqlash
        </Button>
      </Box>
    </Box>
  </Fade>
</Modal>

        <DeleteModal
          open={deleteModalOpen}
          onClose={() => { setDeleteModalOpen(false); setSelectedTotalEntry(null) }}
          title="Удалить бренд?"
          text={`Вы уверены, что хотите удалить бренд "${selectedTotalEntry?.created_date}"?`}
          onConfirm={confirmDelete}
        />
        <AddTotalEntry
          open={addModalOpen}
          onClose={() => { setAddModalOpen(false); }}
          onAdd={handleAddTotalEntry}
        />
        <EditTotalEntry
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditTotalEntry(null);
          }}
          onEdit={handleEditSave}
          initialValue={editTotalEntry}
        />
      </Box>
    </Container>
  )
}

export default StockTotalEntry
