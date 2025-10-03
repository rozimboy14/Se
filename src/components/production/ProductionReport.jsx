import { Box, Button, Container, LinearProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ButtonGroup, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { deleteProductionReport, deleteStockEntry, getProductionReport, getProductionReportOptions, getStock, getStockEntry, getStockTotalEntry, getWarehouse, patchProductionReport, patchStockEntry, patchStockTotalEntry, postProductionReport, postStockEntry } from "../api/axios";
import EditTotalEntry from "../componet/EditTotalEntry";
import { useNavigate, useParams } from "react-router-dom";
import AddStockEntry from "../componet/AddStockEntry";
import DeleteModal from "../componet/DeleteModal";
import EditStockEntry from "../componet/EditStockEntry";
import { formatNumber } from "../utils/formatNumber";
import EditReport from "../production Modal/EditReport";
import AddReport from "../production Modal/AddReport";
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';


function ProductionReport() {
  const [productionReport, setProductionReport] = useState([])
  const [loatingFetch, setLoadingFetch] = useState(false)
  const [selectedProductionReport, setSelectedProductionReport] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProductionReport, setEditProductionReport] = useState(null);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(() => {
    const stored = localStorage.getItem("report_selectedWarehouse");
    return stored ? Number(stored) : null;
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    const stored = localStorage.getItem("report_selectedYear");
    return stored ? Number(stored) : null;
  });
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [warehouse, setWarehouse] = useState([])
  const [optionsMonth, setOptionsMonth] = useState([])
  const [optionsYear, setOptionsYear] = useState([])




  useEffect(() => {
    if (warehouse.length > 0 && !selectedWarehouse)  {
      setSelectedWarehouse(warehouse[0].id);
      localStorage.setItem("report_selectedWarehouse", warehouse[0].id);
    }
  }, [warehouse, selectedWarehouse]);

  useEffect(() => {
    if (optionsYear.length > 0 && !selectedYear)  {
      setSelectedYear(optionsYear[0].value);
      localStorage.setItem("report_selectedYear", optionsYear[0].value);
    }
  }, [optionsYear, selectedYear]);


  const handleDelete = (id) => {
    console.log(id);

    const item = productionReport.find((b) => b.id === id);
    setSelectedProductionReport(item);
    setDeleteModalOpen(true);
  };


  useEffect(() => {
    const fetchWarehouse = async () => {
      setLoadingFetch(true)
      try {
        const response = await getWarehouse();
        setWarehouse(response.data)
        console.log(response.data);
        const optionsResponse = await getProductionReportOptions();
        setOptionsMonth(optionsResponse.data.actions.POST.month.choices);
        setOptionsYear(optionsResponse.data.actions.POST.year.choices);
        console.log(optionsResponse.data);

      } catch (error) {
        console.log(error);

      } finally {
        setLoadingFetch(false)
      }
    }
    fetchWarehouse()
  }, [])


  useEffect(() => {
    const fetchOrders = async () => {
      if (!selectedWarehouse) return;
      setLoadingFetch(true)
      try {
        const response = await getProductionReport(selectedWarehouse, selectedYear || "", selectedMonth || "");
        setProductionReport(response.data)
        console.log(response.data);

      } catch (error) {
        console.log(error);

      } finally {
        setLoadingFetch(false)
      }
    }
    fetchOrders()
  }, [selectedWarehouse, selectedYear, selectedMonth])


  const handleAddProductionReport = async (item) => {



    console.log(item);


    try {
      const response = await postProductionReport(item);
      setProductionReport(prev => [...prev, ...(Array.isArray(response.data) ? response.data : [response.data])]);
    } catch (err) {
      console.error("Add failed:", err);
    } finally {
      setAddModalOpen(false);
    }
  };

  const handleEdit = (id) => {
    const item = productionReport.find((b) => b.id === id);
    setEditProductionReport(item);
    console.log(item);

    setEditModalOpen(true);
    console.log(editProductionReport);

  };
  const handleEditSave = async (edited) => {
    console.log(edited);

    if (!editProductionReport) return;
    try {
      const res = await patchProductionReport(editProductionReport.id, {
        comment: edited.comment,
        month: edited.month,
        day: edited.day,
      });
      setProductionReport(prev =>
        prev.map(b => (b.id === editProductionReport.id ? res.data : b))
      );
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setEditModalOpen(false);
      setEditProductionReport(null);
    }
  };

  const confirmDelete = async () => {
    if (!selectedProductionReport) return;
    try {
      await deleteProductionReport(selectedProductionReport.id);
      setProductionReport(prev => prev.filter(b => b.id !== selectedProductionReport.id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedProductionReport(null);
    }
  };

  return (
    <Container maxWidth="full">
      <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
        <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px" }}>
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <h3 style={{ margin: "0", marginTop: "10px", marginBottom: "6px" }}> Tikuv rejasi</h3>
          </Box>
          <Button size="small" sx={{ fontSize: "10px" }} variant="contained" onClick={() => setAddModalOpen(true)}>
            Добавит
          </Button>
        </Box>
        <Box sx={{ width: 350, position: "absolute", left: "0", top: "20px", display: "flex" }}>
          <FormControl fullWidth>

            <NativeSelect
              value={selectedWarehouse || ""}   // controlled value
              onChange={(e) => setSelectedWarehouse(e.target.value)} // id saqlanadi

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
          <FormControl fullWidth>

            <NativeSelect
              value={selectedYear || ""}   // controlled value
              onChange={(e) => setSelectedYear(e.target.value)} // id saqlanadi

              sx={{ fontSize: "12px", cursor: "pointer" }}
              inputProps={{
                name: 'Filial',
                id: 'uncontrolled-native',
              }}
            >
              <option value="" style={{ fontSize: "13px", cursor: "pointer" }}>
                All
              </option>     {optionsYear?.map((item) => (
                <option key={item.value} value={item.value} style={{ fontSize: "13px", cursor: "pointer" }}>
                  {item.display_name}
                </option>
              ))}

            </NativeSelect>
          </FormControl>
          <FormControl fullWidth>

            <NativeSelect
              value={selectedMonth || ""}   // controlled value
              onChange={(e) => setSelectedMonth(e.target.value)} // id saqlanadi

              sx={{ fontSize: "12px", cursor: "pointer" }}
              inputProps={{
                name: 'Filial',
                id: 'uncontrolled-native',
              }}
            >
              <option value="" style={{ fontSize: "13px", cursor: "pointer" }}>
                All
              </option>   {optionsMonth?.map((item) => (
                <option key={item.value} value={item.value} style={{ fontSize: "13px", cursor: "pointer" }}>
                  {item.display_name}
                </option>
              ))}

            </NativeSelect>
          </FormControl>
        </Box>

        <TableContainer component={Paper} sx={{ width: "100%", minWidth: "0" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ fontWeight: "600", fontSize: "12px", padding: "5px 10px" }}>
                <TableCell sx={{ width: "5%", fontSize: "12px", padding: "5px 10px" }}>№</TableCell>
                <TableCell sx={{ width: '10%', textAlign: "center", fontWeight: "600", fontSize: "12px", padding: "5px 10px" }}>Yil-Oy</TableCell>
                <TableCell sx={{ width: '10%', textAlign: "center", fontWeight: "600", fontSize: "12px", padding: "5px 10px" }}>Jami reja</TableCell>
                <TableCell sx={{ width: '5%', textAlign: "center", fontWeight: "600", fontSize: "12px", padding: "5px 10px" }}>Ish kuni</TableCell>
                <TableCell sx={{ width: '5%', textAlign: "center", fontWeight: "600", fontSize: "12px", padding: "5px 10px" }}>1-sort</TableCell>
                <TableCell sx={{ width: '5%', textAlign: "center", fontWeight: "600", fontSize: "12px", padding: "5px 10px" }}>2-sort</TableCell>
                <TableCell sx={{ width: '5%', textAlign: "center", fontWeight: "600", fontSize: "12px", padding: "5px 10px" }}>Brak</TableCell>
                <TableCell sx={{ width: '15%', textAlign: "center", fontWeight: "600", fontSize: "12px", padding: "5px 10px" }}>%</TableCell>
                <TableCell sx={{ width: '25%', textAlign: "center", fontWeight: "600", fontSize: "12px", padding: "5px 10px" }}>Izox</TableCell>
                <TableCell sx={{ width: "10%", textAlign: "center", fontWeight: "600", fontSize: "12px", padding: "5px 10px" }}>Действия</TableCell>
                {/* <TableCell sx={{ width: 120, textAlign: "center" }}>Действия</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody >
              {productionReport?.map((item, index) => (
                <TableRow key={`${item.id ?? 'new'}-${index}`} sx={{ padding: "0 10px" }}>
                  <TableCell sx={{ fontSize: "13px", padding: "2px 10px" }}>{index + 1}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>
                    {item.year_display}-{item.month_display}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{formatNumber(item.total_norm)}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{formatNumber(item.day)}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{formatNumber(item.total_sort_1)}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{formatNumber(item.total_sort_2)}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{formatNumber(item.total_defect)}</TableCell>
                  <TableCell sx={{ textAlign: "center", padding: "2px 10px", width: "150px" }}>
                    <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <LinearProgress
                        variant="determinate"
                        value={Number(item.percent_done) || 0}

                        sx={{
                          width: "100%",
                          height: 22,
                          borderRadius: 5,

                          backgroundColor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor:
                              item.percent_done <= 50
                                ? "#f44336"   // qizil
                                : item.percent_done <= 80
                                  ? "#ff9800"   // sariq
                                  : "#4caf50",  // yashil
                          },
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          position: "absolute",
                          fontSize: "14px",
                          width: "100%",
                          textAlign: "center",
                          fontWeight: "bold",
                          color:
                            item.percent_done <= 50
                              ? "#000"      // qizil bar ustida oq
                              : "#fff",     // sariq/yashil bar ustida qora
                        }}
                      >
                        {item.percent_done}%
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ textAlign: "center", fontSize: "13px", padding: "2px 10px" }}>{item.comment}</TableCell>
                  <TableCell sx={{ padding: "2px 10px" }}>
                    <ButtonGroup variant="outlined" size="small" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <IconButton onClick={() => handleEdit(item.id)} sx={{ color: "green" }}>
                        <EditIcon sx={{ fontSize: "18px" }} />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)} sx={{ color: "red" }}>
                        <DeleteForeverIcon sx={{ fontSize: "18px" }} />
                      </IconButton>


                      <IconButton onClick={() => navigate(`/production/production-report/${item.id}?daily=${item.month_display}&year=${item.year_display}&warehouse=${item.warehouse}`)}>
                        <VisibilityIcon sx={{ fontSize: "18px" }} />
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
        {selectedProductionReport && (
          <DeleteModal
            open={deleteModalOpen}
            onClose={() => { setDeleteModalOpen(false); setSelectedProductionReport(null) }}
            title="Удалить бренд?"
            text={`Вы уверены, что хотите удалить бренд "${selectedProductionReport.month}"?`}
            onConfirm={confirmDelete}
          />
        )}
        <AddReport
          open={addModalOpen}
          onClose={() => { setAddModalOpen(false); }}
          onAdd={handleAddProductionReport}
        />
        <EditReport
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditProductionReport(null);
          }}
          onEdit={handleEditSave}
          initialValue={editProductionReport}
        />
      </Box>
    </Container>
  )
}


export default ProductionReport
