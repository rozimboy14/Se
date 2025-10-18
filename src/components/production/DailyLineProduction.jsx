import React, { useEffect, useState } from "react";
import {
    Box, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, IconButton, Autocomplete,
    Divider,
    Snackbar,
    Alert
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled, useTheme } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { getCategoryNormReportId, getDetailDaily, patchLineOrders, postLineOrders } from "../api/axios";
import DeleteIcon from '@mui/icons-material/Delete';
const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} sx={{ minHeight: "30px" }} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': { borderBottom: 0 },
    '&::before': { display: 'none' },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', }} />}
        {...props}


    />
))(({ theme }) => ({
    backgroundColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row-reverse',
    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
        transform: 'rotate(90deg)',
    },
    [`& .${accordionSummaryClasses.content}`]: {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(1),
    backgroundColor: '#fafafa',
}));


const commonInputProps = {
    sx: {
        height: 28, // 🔹 bir xil balandlik
        fontSize: 12,
        paddingY: 0,
    },
};

const commonTextFieldSx = {
    "& .MuiInputBase-input": {
        fontSize: "12px",
        padding: "0 6px",   // 🔹 vertikal paddingsiz
        height: "28px",     // 🔹 majburiy balandlik
    },
    "& .MuiInputLabel-root": {
        fontSize: "12px",
        top: "-0px",        // 🔹 label joylashuvini tekislash
    },
};

const DailyLineProduction = ({ lineId, reportId, onBack }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [productionNorm, setProductionNorm] = useState({ lines: [] });
    const [editRowId, setEditRowId] = useState(null);
    const [normCategory, setNormCategory] = useState([]);
    const [formData, setFormData] = useState({});
    const [backupData, setBackupData] = useState({}); // cancel uchun
    const [expanded, setExpanded] = useState(false);
    const [errorMessage, setErrorMessage] = useState([])
    // fetch daily production
    useEffect(() => {
        const fetchDetail = async () => {
            const res = await getDetailDaily(lineId);
            setProductionNorm(res.data);
            console.log(`productionNorm`, res.data);
            const initialData = {};
            res.data.lines.forEach(line => {
                line.order_line.forEach(order => {
                    initialData[order.id] = {
                        order: order.order,
                        sort_1: order.sort_1,
                        sort_2: order.sort_2,
                        defect_quantity: order.defect_quantity,
                    };
                });
            });
            setFormData(initialData);
        };
        fetchDetail();
    }, [lineId]);

    const handleChangeLine = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    // fetch normCategory
    useEffect(() => {
        const fetchNorm = async () => {
            try {
                const res = await getCategoryNormReportId(reportId);
                setNormCategory(res.data);
                console.log(`categoryNorm`, res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchNorm();
    }, [reportId]);

    const handleDoubleClick = (orderId) => {
        setBackupData({ ...formData[orderId] });
        setEditRowId(orderId);
    };

    const handleChange = (orderId, field, value) => {
        setFormData(prev => ({
            ...prev,
            [orderId]: { ...prev[orderId], [field]: value }
        }));
    };
    const handleSave = async (orderId) => {
        try {
            const updatedData = formData[orderId];
            console.log("Save order", orderId, updatedData);

            let savedOrder;

            if (updatedData.isNew) {
                console.log(`updatedData.isNew`, updatedData.isNew);
                // 🔹 Yangi qator uchun POST
                const response = await postLineOrders(updatedData);
                savedOrder = response.data;

                // State ichida vaqtinchalik ID (`Date.now()`) ni backend qaytarayotgan haqiqiy ID bilan almashtirish
                setProductionNorm((prev) => ({
                    ...prev,
                    lines: prev.lines.map((line) =>
                        line.id === updatedData.order_line
                            ? {
                                ...line,
                                order_line: line.order_line.map((order) =>
                                    order.id === orderId ? { ...savedOrder, isNew: false } : order
                                ),
                            }
                            : line
                    ),
                }));
            } else {
                // 🔹 Eski qator uchun PATCH
                await patchLineOrders(orderId, updatedData);
                savedOrder = { ...updatedData, isNew: false };

                setProductionNorm((prev) => ({
                    ...prev,
                    lines: prev.lines.map((line) => ({
                        ...line,
                        order_line: line.order_line.map((order) =>
                            order.id === orderId ? { ...order, ...savedOrder } : order
                        ),
                    })),
                }));
            }

            // Edit rejimdan chiqish
            setEditRowId(null);
        } catch (error) {
            console.error("Error saving order:", error);

            if (error.response && error.response.data && error.response.data.detail) {
                const firstError = error.response.data.detail[0];
                setErrorMessage(error.response.data.detail);
                console.log("Error message to show:", error.response.data.detail);
            } else {
                setErrorMessage("Xatolik yuz berdi");
            }
        }
    };

    const handleCancel = (orderId) => {
        setFormData(prev => ({
            ...prev,
            [orderId]: backupData
        }));
        setEditRowId(null);
    };




    const handleAddRow = (lineId) => {
        // Yangi ID yaratish (unique bo‘lishi uchun timestamp ishlatish)
        const newId = Date.now();
        const newRow = {
            id: newId,
            order_line: lineId, // line id bilan bog‘lash
            order: null,
            sort_1: 0,
            sort_2: 0,
            defect_quantity: 0,
            isNew: true,

        };

        // formData update
        setFormData(prev => ({
            ...prev,
            [newId]: { ...newRow }
        }));

        // productionNorm update
        setProductionNorm(prev => ({
            ...prev,
            lines: prev.lines.map(line =>
                line.id === lineId
                    ? { ...line, order_line: [...line.order_line, newRow] }
                    : line
            )
        }));

        // yangi rowni edit mode da ochish
        setEditRowId(newId);
    };
    const handleDelete = (lineId, orderId) => {
        setProductionNorm(prev => ({
            ...prev,
            lines: prev.lines.map(line => ({
                ...line,
                order_line: line.order_line.filter(order => order.id !== orderId)
            }))
        }));
        setFormData(prev => {
            const newData = { ...prev };
            delete newData[orderId];
            return newData;
        });
        if (editRowId === orderId) setEditRowId(null);
    };


    useEffect(() => {
        if (errorMessage.length > 0) {
            const container = document.getElementById("scroll-container");
            container?.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [errorMessage]);

    const handleCloseAlert = (index) => {
        setErrorMessage(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                <Button onClick={onBack} sx={{ mb: 0.2, fontSize: "10px", padding: 0.2 }} variant="contained">Назад</Button>
                <h3 style={{ margin: 0, flex: 1, }}>{productionNorm.date}</h3>
            </Box>
            <Snackbar
                open={!!errorMessage && (Array.isArray(errorMessage) ? errorMessage.length > 0 : true)}
                autoHideDuration={6000}
                onClose={() => setErrorMessage([])}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Box>
                    {Array.isArray(errorMessage) ? (
                        errorMessage.map((item, index) => (
                            <Alert
                                key={index}
                                onClose={() => handleCloseAlert(index)}
                                severity="error"
                                sx={{ width: '100%', mb: 1 }}
                            >
                                {item}
                            </Alert>
                        ))
                    ) : (
                        <Alert onClose={() => setErrorMessage([])} severity="error" sx={{ width: '100%' }}>
                            {errorMessage}
                        </Alert>
                    )}
                </Box>
            </Snackbar>


            {productionNorm.lines.map((line, idx) => (
                <React.Fragment key={`line-${line.id}-${idx}`}>
                    {idx > 0 && (
                        <>
                            <Divider sx={{ my: 0.5, backgroundColor: "#070707" }} />
                        </>
                    )}
                    <Accordion key={line.id} expanded={expanded === `panel${idx}`}
                        onChange={handleChangeLine(`panel${idx}`)}>
                        <AccordionSummary sx={{
                            borderRight: expanded === `panel${idx}` ? "2px inset #bbc7dc" : "",
                            borderLeft: expanded === `panel${idx}` ? "2px inset #bbc7dc" : "",
                            borderTop: expanded === `panel${idx}` ? "2px inset #bbc7dc" : "",
                            backgroundColor: isDark
                                ? (expanded === `panel${idx}` ? '#4b749f' : '##223545')  // dark mode ranglari
                                : (expanded === `panel${idx}` ? '#b9dfee' : '#eef2f3'),  // light mode ranglari

                            '&:hover': { backgroundColor: isDark ? "#557c93" : "#c3e1fc", },
                            padding: "4px 4px",       // yuqori/past kichikroq
                            minHeight: "35px",            // default 48px → kichraytirildi
                            "& .MuiAccordionSummary-content": {
                                margin: 0,              // ichki content bo‘shlig‘ini olib tashlash
                            }
                        }}>
                            <span style={{
                                marginLeft: "10px", marginRight: "55px", fontSize: "14px", fontWeight: "600", color: isDark
                                    ? (expanded === `panel${idx}` ? "#00ff87" : "#11d3f3") // dark mode ranglari
                                    : (expanded === `panel${idx}` ? "#D70F20" : "#3C60AD") // light mode ranglari
                            }}> {line.line} </span>  <span style={{ marginRight: "15px", fontSize: "13px", }}>Высший сорт : {line.sort_1}</span>  <span style={{ marginRight: "15px", fontSize: "13px" }}>2-сорт: {line.sort_2}</span> <span style={{ marginRight: "15px", fontSize: "13px" }}> Брак: {line.defect_quantity}</span>
                        </AccordionSummary>
                        <AccordionDetails sx={{
                            borderRight: expanded === `panel${idx}` ? "2px inset #bbc7dc" : "",
                            borderLeft: expanded === `panel${idx}` ? "2px inset #bbc7dc" : "",
                            borderBottom: expanded === `panel${idx}` ? "2px inset #bbc7dc" : "",
                            backgroundColor: isDark ? "#243748" : "white",
                        }} >
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: "54%", padding: "0px 10px", fontSize: "11px" }}>Модель</TableCell>
                                        <TableCell sx={{ width: "11%", padding: "0px 10px", fontSize: "11px" }}>высший сорт </TableCell>
                                        <TableCell sx={{ width: "11%", padding: "0px 10px", fontSize: "11px" }}>2-сорт</TableCell>
                                        <TableCell sx={{ width: "11%", padding: "0px 10px", fontSize: "11px" }}>Брак</TableCell>
                                        <TableCell sx={{ width: "13%", padding: "0px 10px", fontSize: "11px" }}></TableCell>


                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {line.order_line.map((order) => (
                                        <TableRow
                                            key={order.id}
                                            onDoubleClick={() => handleDoubleClick(order.id)}
                                        >
                                            <TableCell sx={{ padding: "4px 4px" }}>
                                                {editRowId === order.id ? (
                                                    <Autocomplete
                                                        size="small"
                                                        options={normCategory
                                                            .filter(nc => nc.production_norm === line.production_norm)
                                                            .filter(nc =>

                                                                !line.order_line.some(o => o.order !== order.order && o.order === nc.id)
                                                            )
                                                        }
                                                        getOptionLabel={(option) =>
                                                            `${option.order_name || ""} - ${option.order_variant_name || ""}`
                                                        }
                                                        value={normCategory.find(n => n.id === formData[order.id]?.order) || null}
                                                        onChange={(e, newValue) => handleChange(order.id, 'order', newValue?.id)}
                                                        renderInput={(params) => <TextField {...params} InputProps={{ ...params.InputProps, ...commonInputProps }}
                                                            sx={commonTextFieldSx} />}
                                                    />
                                                ) : (
                                                    order.full_name
                                                )}
                                            </TableCell>
                                            <TableCell sx={{ padding: "4px 2px" }}>
                                                {editRowId === order.id ? (
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        value={formData[order.id]?.sort_1}
                                                        onChange={(e) => handleChange(order.id, 'sort_1', e.target.value)}
                                                        InputProps={commonInputProps}
                                                        sx={commonTextFieldSx}
                                                    />
                                                ) : (
                                                    order.sort_1
                                                )}
                                            </TableCell>
                                            <TableCell sx={{ padding: "4px 2px" }}>
                                                {editRowId === order.id ? (
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        value={formData[order.id]?.sort_2}
                                                        onChange={(e) => handleChange(order.id, 'sort_2', e.target.value)}
                                                        InputProps={commonInputProps}
                                                        sx={commonTextFieldSx}
                                                    />
                                                ) : (
                                                    order.sort_2
                                                )}
                                            </TableCell>
                                            <TableCell sx={{ padding: "4px 2px" }}>
                                                {editRowId === order.id ? (
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        value={formData[order.id]?.defect_quantity}
                                                        onChange={(e) => handleChange(order.id, 'defect_quantity', e.target.value)}
                                                        InputProps={commonInputProps}
                                                        sx={commonTextFieldSx}
                                                    />
                                                ) : (
                                                    order.defect_quantity
                                                )}
                                            </TableCell>

                                            <TableCell sx={{ padding: "4px 2px" }}>
                                                {editRowId === order.id && (
                                                    < >
                                                        <IconButton color="success" onClick={() => handleSave(order.id)} sx={{ padding: 0.6, marginLeft: "5px", marginRight: "5px" }}>
                                                            <CheckIcon sx={{ fontSize: "18px" }} />
                                                        </IconButton>
                                                        <IconButton color="error" onClick={() => handleCancel(order.id)} sx={{ padding: 0.6, marginRight: "5px" }}>
                                                            <CloseIcon sx={{ fontSize: "18px" }} />
                                                        </IconButton>
                                                        {order.isNew && (
                                                            <IconButton color="secondary" onClick={() => handleDelete(line.id, order.id)} sx={{ padding: 0.6 }}>
                                                                <DeleteIcon sx={{ fontSize: "18px" }} />
                                                            </IconButton>
                                                        )}
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Box sx={{ mt: 0.5, textAlign: "left" }}>
                                {(() => {
                                    const usedOrders = line.order_line.map(o => o.order)
                                        .filter(Boolean)

                                    const availableOptions = normCategory.filter(
                                        nc => nc.production_norm === line.production_norm && !usedOrders.includes(nc.id)
                                    );
                                    return (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handleAddRow(line.id)}
                                            sx={{ fontSize: "10px" }}
                                            disabled={availableOptions.length === 0}  // 🔹 faqat qolmagan bo‘lsa disable
                                        >
                                            Добавить
                                        </Button>
                                    );
                                })()}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </React.Fragment>
            ))}
        </Box>
    );
};

export default DailyLineProduction;
