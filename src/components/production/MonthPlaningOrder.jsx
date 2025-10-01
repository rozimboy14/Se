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
import { deleteMonthPlaningOrder, deleteStockEntry, exportPdfMonthPlaning, getMonthPlaning, getMonthPlaningDetail, getMonthPlaningOrder, getProductionReport, getStock, getStockEntry, getStockTotalEntry, patchMonthPlaningOrder, patchProductionReport, patchStockEntry, patchStockTotalEntry, postMonthPlaning, postMonthPlaningOrder, postProductionReport, postStockEntry, refreshMonthPlaningOrder } from "../api/axios";
import EditTotalEntry from "../componet/EditTotalEntry";
import { useNavigate, useParams } from "react-router-dom";
import AddStockEntry from "../componet/AddStockEntry";
import DeleteModal from "../componet/DeleteModal";
import EditStockEntry from "../componet/EditStockEntry";
import { formatNumber } from "../utils/formatNumber";
import EditReport from "../production Modal/EditReport";
import AddReport from "../production Modal/AddReport";
import AddMonthPlaning from "../production Modal/AddMonthPlaning";
import AddMonthPlaningOrder from "../production Modal/AddMonthPlaningOrder";
import EditMonthPlaningOrder from "../production Modal/EditMonthPlaningOrder";



function MonthPlaningOrder() {
    const [monthPlaningOrder, setMonthPlaningOrder] = useState([])
    const [loatingFetch, setLoadingFetch] = useState(false)
    const [selectedMonthPlaningOrder, setSelectedMonthPlaningOrder] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editMonthPlaningOrder, setEditMonthPlaningOrder] = useState(null);
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const { monthId } = useParams();




    const handleDelete = (id) => {
        const item = monthPlaningOrder.find((b) => b.id === id);
        setSelectedMonthPlaningOrder(item);
        setDeleteModalOpen(true);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoadingFetch(true)
            try {
                const response = await getMonthPlaningDetail(monthId);
                setMonthPlaningOrder(response.data)
                console.log(response.data);

            } catch (error) {
                console.log(error);

            } finally {
                setLoadingFetch(false)
            }
        }
        fetchOrders()
    }, [])


    const handleAddMonthPlaningOrder = async (item) => {
        const data = item.map(entry => ({
            month_planing: parseInt(monthId, 10),
            order: entry.order,
            planed_quantity: Number(entry.planed_quantity),
            comment: entry.comment
        }));

        console.log(item);
        try {
            const response = await postMonthPlaningOrder(data);
            setMonthPlaningOrder(prev => [...prev, ...(Array.isArray(response.data) ? response.data : [response.data])]);
        } catch (err) {
            console.error("Add failed:", err);
        } finally {
            setAddModalOpen(false);
        }
    };

    const handleEdit = (id) => {
        const item = monthPlaningOrder.find((b) => b.id === id);
        setEditMonthPlaningOrder(item);
        console.log(item);

        setEditModalOpen(true);
        console.log(editMonthPlaningOrder);

    };
    const handleEditSave = async (edited) => {
        console.log(edited);

        if (!editMonthPlaningOrder) return;
        try {
            const res = await patchMonthPlaningOrder(editMonthPlaningOrder.id, edited);
            setMonthPlaningOrder(prev =>
                prev.map(b => (b.id === editMonthPlaningOrder.id ? res.data : b))
            );
        } catch (err) {
            console.error("Edit failed:", err);
        } finally {
            setEditModalOpen(false);
            setEditMonthPlaningOrder(null);
        }
    };

    const confirmDelete = async () => {
        if (!selectedMonthPlaningOrder) return;
        try {
            await deleteMonthPlaningOrder(selectedMonthPlaningOrder.id);
            setMonthPlaningOrder(prev => prev.filter(b => b.id !== selectedMonthPlaningOrder.id));
        } catch (err) {
            console.error("Delete failed:", err);
        } finally {
            setDeleteModalOpen(false);
            setSelectedMonthPlaningOrder(null);
        }
    };
    const handleRefresh = async () => {
        try {
            // 1. Yangilash API
            await refreshMonthPlaningOrder();

            // 2. Yangilangan ro‘yxatni qayta olish
            const res2 = await getMonthPlaningDetail(monthId);

            // 3. State-ni yangilash
            setMonthPlaningOrder(res2.data);

            console.log("Yangilangan quantity:", res2.data);
        } catch (err) {
            console.error(err);
        }
    };



    const handleExportPDF = async () => {
        try {
            const response = await exportPdfMonthPlaning(parseInt(monthId, 10));
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

    return (
        <Container maxWidth="full">
            <Box sx={{ width: "100%", height: "100%" }}>
                <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px" }}>
                    <Box sx={{ flex: 1, textAlign: "center" }}>
                        <h3 style={{ margin: "0", marginBottom: "6px" }}>Tikuv rejasi</h3>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>

                        <Button size="small" sx={{ fontSize: "10px" }} variant="contained" onClick={() => setAddModalOpen(true)}>
                            Добавит
                        </Button>
                        <Button size="small" sx={{ fontSize: "10px" }} variant="outlined" color="error" onClick={() => handleExportPDF()}>
                            EXPORT PDF
                        </Button>
                        <Button size="small" sx={{ fontSize: "10px" }} variant="contained" onClick={() => handleRefresh()}>
                            REFRESH
                        </Button>
                    </Box>
                </Box>

                <TableContainer component={Paper} sx={{ width: "100%", minWidth: "0" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ fontWeight: "500", }}>
                                <TableCell sx={{ width: "5%", fontSize: "12px", padding: "5px 10px" }}>№</TableCell>
                                <TableCell sx={{ width: '10%', textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>Brend</TableCell>
                                <TableCell sx={{ width: '10%', textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>Sezon</TableCell>
                                <TableCell sx={{ width: '20%', textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>Model</TableCell>
                                <TableCell sx={{ width: '5%', textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>Reja</TableCell>
                                <TableCell sx={{ width: '7%', textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>Bajarildi</TableCell>
                                <TableCell sx={{ width: '8%', textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>Kroy</TableCell>
                                <TableCell sx={{ width: '10%', textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>%</TableCell>
                                <TableCell sx={{ width: '20%', textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>Izox</TableCell>
                                <TableCell sx={{ width: "5%", textAlign: "center", fontWeight: "500", padding: "5px 10px", fontSize: "12px", borderLeft: "1px solid #C9C9C9" }}>Действия</TableCell>
                                {/* <TableCell sx={{ width: 120, textAlign: "center" }}>Действия</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {monthPlaningOrder?.month_planing_orders?.map((item, index) => (
                                <TableRow key={`${item.id ?? 'new'}-${index}`} sx={{ padding: "0 10px" }}>
                                    <TableCell sx={{ fontSize: "12px", padding: "6px 10px" }}>{index + 1}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "6px 10px" }}>
                                        {item.order_detail.brand_name}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "6px 10px" }}>
                                        {item.order_detail.specification_name}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "6px 10px" }}>{item.order_detail.article_name}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "6px 10px" }}>{formatNumber(item.planed_quantity)}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "6px 10px" }}>{formatNumber(item.fact_quantity)}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "6px 10px" }}>{formatNumber(item.stock_quantity)}</TableCell>

                                    <TableCell sx={{ textAlign: "center", padding: "6px 10px", width: "150px" }}>
                                        <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={Number(item.percent_done) || 0}

                                                sx={{
                                                    width: "100%",
                                                    height: 25,
                                                    borderRadius: "3px",
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

                                    <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "6px 10px" }}>{formatNumber(item.comment)}</TableCell>
                                    <TableCell sx={{ padding: "6px 10px" }}>
                                        <ButtonGroup variant="outlined" size="small" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                            <IconButton onClick={() => handleEdit(item.id)} sx={{ color: "green" }}>
                                                <EditIcon sx={{ fontSize: "18px" }} />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(item.id)} sx={{ color: "red" }}>
                                                <DeleteForeverIcon sx={{ fontSize: "18px" }} />
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
                {selectedMonthPlaningOrder && (
                    <DeleteModal
                        open={deleteModalOpen}
                        onClose={() => { setDeleteModalOpen(false); setSelectedMonthPlaningOrder(null) }}
                        title="Удалить бренд?"
                        text={`Вы уверены, что хотите удалить бренд "${selectedMonthPlaningOrder.order_detail.article_name}"?`}
                        onConfirm={confirmDelete}
                    />
                )}
                <AddMonthPlaningOrder
                    open={addModalOpen}
                    onClose={() => { setAddModalOpen(false); }}
                    onAdd={handleAddMonthPlaningOrder}
                />
                <EditMonthPlaningOrder
                    open={editModalOpen}
                    onClose={() => {
                        setEditModalOpen(false);
                        setEditMonthPlaningOrder(null);
                    }}
                    onUpdate={handleEditSave}
                    initialData={editMonthPlaningOrder} />
            </Box>
        </Container>
    )
}


export default MonthPlaningOrder
