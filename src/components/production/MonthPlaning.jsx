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
import { deleteStockEntry, getMonthPlaning, getMonthPlaningOptions, getProductionReport, getProductionReportOptions, getStock, getStockEntry, getStockTotalEntry, getWarehouse, patchProductionReport, patchStockEntry, patchStockTotalEntry, postMonthPlaning, postProductionReport, postStockEntry } from "../api/axios";
import EditTotalEntry from "../componet/EditTotalEntry";
import { useNavigate, useParams } from "react-router-dom";
import AddStockEntry from "../componet/AddStockEntry";
import DeleteModal from "../componet/DeleteModal";
import EditStockEntry from "../componet/EditStockEntry";
import { formatNumber } from "../utils/formatNumber";
import EditReport from "../production Modal/EditReport";
import AddReport from "../production Modal/AddReport";
import AddMonthPlaning from "../production Modal/AddMonthPlaning";
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';


function MonthPlaning() {
    const [monthPlaning, setMonthPlaning] = useState([])
    const [loatingFetch, setLoadingFetch] = useState(false)
    const [selectedMonthPlaning, setSelectedMonthPlaning] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editMonthPlaning, setEditMonthPlaning] = useState(null);
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(() => {
        const stored = localStorage.getItem("selectedWarehouse");
        console.log("🚀 localStorage initial:", stored); // <-- tekshirish
        return stored ? Number(stored) : null;
    });
    const [selectedYear, setSelectedYear] = useState(() => {
        const stored = localStorage.getItem("selectedYear");
        console.log("🚀 localStorage initial:", stored); // <-- tekshirish
        return stored ? Number(stored) : null;
    });
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [warehouse, setWarehouse] = useState([])
    const [optionsMonth, setOptionsMonth] = useState([])
    const [optionsYear, setOptionsYear] = useState([])

    useEffect(() => {
        if (warehouse.length > 0 && !selectedWarehouse) {
            setSelectedWarehouse(warehouse[0].id);
            localStorage.setItem("selectedWarehouse", warehouse[0].id);
        }
    }, [warehouse, selectedWarehouse]);



    useEffect(() => {
        if (optionsYear.length > 0 && !selectedYear) {
            setSelectedYear(optionsYear[0].value);
            localStorage.setItem("selectedYear", optionsYear[0].value);
        }
    }, [optionsYear, selectedYear]);
    console.log(`optionsYear`, optionsYear);


    const handleDelete = (id) => {
        const item = monthPlaning.find((b) => b.id === id);
        setSelectedMonthPlaning(item);
        setDeleteModalOpen(true);
    };

    useEffect(() => {
        const fetchWarehouse = async () => {
            setLoadingFetch(true)
            try {
                const response = await getWarehouse();
                setWarehouse(response.data)
                console.log(response.data);
                const optionsResponse = await getMonthPlaningOptions();
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
                const response = await getMonthPlaning(selectedWarehouse, selectedYear || "", selectedMonth || "");
                setMonthPlaning(response.data)
                console.log(response.data);

            } catch (error) {
                console.log(error);

            } finally {
                setLoadingFetch(false)
            }
        }
        fetchOrders()
    }, [selectedWarehouse, selectedYear, selectedMonth])

    const handleAddMonthPlaning = async (item) => {
        console.log(item);
        try {
            const response = await postMonthPlaning(item);
            setMonthPlaning(prev => [...prev, ...(Array.isArray(response.data) ? response.data : [response.data])]);
        } catch (err) {
            console.error("Add failed:", err);
        } finally {
            setAddModalOpen(false);
        }
    };

    const handleEdit = (id) => {
        const item = monthPlaning.find((b) => b.id === id);
        setEditMonthPlaning(item);
        console.log(item);

        setEditModalOpen(true);
        console.log(editMonthPlaning);

    };


    const handleChange = (event, newValue) => {
        setSelectedWarehouse(newValue);
        localStorage.setItem("selectedWarehouse", newValue);

        const selected = warehouse.find(w => w.id === newValue);
        if (selected) {
            setWarehouseName(selected.name);
            localStorage.setItem("selectedWarehouseName", selected.name);
        }
    }

    return (
        <Container maxWidth="full">
            <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
                <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px" }}>
                    <Box sx={{ flex: 1, textAlign: "center" }}>
                        <h3 style={{ margin: "0", marginBottom: "10px" }}>Tikuv rejasi</h3>
                    </Box>
                    <Button size="small" sx={{ fontSize: "10px" }} variant="contained" onClick={() => setAddModalOpen(true)}>
                        Добавит
                    </Button>
                </Box>
                <Box sx={{ width: 350, position: "absolute", left: "0", top: "19px", display: "flex" }}>
                    <FormControl fullWidth>

                        <NativeSelect
                            value={selectedWarehouse || ""}   // controlled value
                            onChange={(e) => setSelectedWarehouse(e.target.value)} // id saqlanadi

                            sx={{ fontSize: "12px", cursor: "pointer", backgroundColor: "transparent" }}
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
                            <TableRow sx={{ fontWeight: "500", }}>
                                <TableCell sx={{ width: "3%", fontSize: "12px", padding: "5px 10px" }}>№</TableCell>
                                <TableCell sx={{ width: '10%', textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>Filial</TableCell>
                                <TableCell sx={{ width: '7%', textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>Yil</TableCell>
                                <TableCell sx={{ width: '10%', textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>Oy</TableCell>
                                <TableCell sx={{ width: '10%', textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>Ish kuni</TableCell>
                                <TableCell sx={{ width: '10%', textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>Reja</TableCell>
                                <TableCell sx={{ width: '10%', textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>Bajarildi</TableCell>
                                <TableCell sx={{ width: '15%', textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>%</TableCell>
                                <TableCell sx={{ width: '15%', textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>Izox</TableCell>
                                <TableCell sx={{ width: "10%", textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>Действия</TableCell>
                                {/* <TableCell sx={{ width: 120, textAlign: "center" }}>Действия</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {monthPlaning?.map((item, index) => (
                                <TableRow key={`${item.id ?? 'new'}-${index}`} sx={{ padding: "0 10px" }}>
                                    <TableCell sx={{ fontSize: "12px", padding: "2px 10px" }}>{index + 1}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>
                                        {item.warehouse_name}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>
                                        {item.year_display}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>
                                        {item.month_display}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>{formatNumber(item.day_planing)}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>{formatNumber(item.planing_quantity)}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>{formatNumber(item.fact_quantity)}</TableCell>
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

                                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "2px 10px" }}>{item.comment}</TableCell>
                                    <TableCell sx={{ padding: "2px 10px" }}>
                                        <ButtonGroup variant="outlined" size="small" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                            <IconButton onClick={() => handleEdit(item.id)} sx={{ color: "green" }}>
                                                <EditIcon sx={{ fontSize: "18px" }} />
                                            </IconButton>
                                            {/* <IconButton onClick={() => handleDelete(item.id)} sx={{ color: "red" }}>
                                                <DeleteForeverIcon sx={{ fontSize: "18px" }} />
                                            </IconButton> */}


                                            <IconButton onClick={() => navigate(`/production/month-planing/${item.id}?daily=${item.month_display}&year=${item.year_display}`)}>
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
                {selectedMonthPlaning && (
                    <DeleteModal
                        open={deleteModalOpen}
                        onClose={() => { setDeleteModalOpen(false); setSelectedMonthPlaning(null) }}
                        title="Удалить бренд?"
                        text={`Вы уверены, что хотите удалить бренд "${selectedMonthPlaning.month}"?`}
                        onConfirm={confirmDelete}
                    />
                )}
                <AddMonthPlaning
                    open={addModalOpen}
                    onClose={() => { setAddModalOpen(false); }}
                    onAdd={handleAddMonthPlaning}
                />
                <EditReport
                    open={editModalOpen}
                    onClose={() => {
                        setEditModalOpen(false);
                        setEditMonthPlaning(null);
                    }}
                    initialValue={editMonthPlaning} />
            </Box>
        </Container>
    )
}


export default MonthPlaning
