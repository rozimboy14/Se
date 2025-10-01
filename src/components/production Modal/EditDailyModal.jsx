import React, { useEffect, useState } from "react";
import {
    Dialog, DialogTitle, DialogActions, Button, Box, Divider,
    Table, TableBody, TableCell, TableHead, TableRow, IconButton, TextField, Typography
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, { accordionSummaryClasses } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { formatNumber } from "../utils/formatNumber";
import { getProductionNorm, patchDaily } from "../api/axios";

// --- Styled Accordion ---
const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": { borderBottom: 0 },
    "&::before": { display: "none" },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor: "rgba(0, 0, 0, .10)",
    flexDirection: "row-reverse",
    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
        transform: "rotate(90deg)",
    },
    [`& .${accordionSummaryClasses.content}`]: {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: "#fafafa",
}));

const EditDailyModal = ({ open, onClose, reportId, editData, onUpdate }) => {
    const [productionNorm, setProductionNorm] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedDate, setSelectedDate] = useState(dayjs());

    // --- Load editData into formData ---
    useEffect(() => {
        if (editData) {
            setSelectedDate(dayjs(editData.date));
            if (Array.isArray(editData.lines)) {
                const newFormData = {};
                editData.lines.forEach(line => {
                    newFormData[line.line] = (line.order_line || []).map(row => ({
                        order: row.order
                            ? { id: row.order, label: row.full_name, ...row.order }
                            : null,
                        quantity: row.quantity || ""
                    }));
                });

                console.log(newFormData);
                setFormData(newFormData);
                console.log(formData);
            }
            console.log(editData);
        }
    }, [editData]);

    // --- Accordion expand ---
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    // --- Form handlers ---
    const handleOrderChange = (lineId, rowIndex, newOrder) => {
        setFormData(prev => {
            const updatedRows = [...(prev[lineId] || [])];
            updatedRows[rowIndex].order = newOrder;
            return { ...prev, [lineId]: updatedRows };
        });
    };

    const handleQuantityChange = (lineId, rowIndex, value) => {
        setFormData(prev => {
            const updatedRows = [...(prev[lineId] || [])];
            updatedRows[rowIndex].quantity = value;
            return { ...prev, [lineId]: updatedRows };
        });
    };

    const handleDeleteRow = (lineId, rowIndex) => {
        setFormData(prev => {
            const updatedRows = [...(prev[lineId] || [])];
            updatedRows.splice(rowIndex, 1);
            return { ...prev, [lineId]: updatedRows };
        });
    };

    const handleAddRow = (lineId) => {
        setFormData(prev => ({
            ...prev,
            [lineId]: [...(prev[lineId] || []), { order: null, quantity: "" }]
        }));
    };

    // --- Submit updated daily ---
const handleSubmit = () => {
    const payload = {
        production_report: reportId,
        date: selectedDate ? selectedDate.format("YYYY-MM-DD") : null,
        lines: Object.entries(formData).map(([lineId, rows]) => ({
            line: Number(lineId),
            order_line: rows.map(row => ({
                order: row.order?.id || null,
                quantity: Number(row.quantity) || 0
            }))
        }))
    };

    // 🔑 Endi PATCH qilmaysiz, faqat parentga qaytarasiz
    onUpdate(editData.id, payload);
  
};

    // --- Fetch production lines ---
    useEffect(() => {
        const fetchProduction = async () => {
            try {
                const res = await getProductionNorm(reportId);
                setProductionNorm(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        if (reportId) fetchProduction();
    }, [reportId]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog
                open={open}
                onClose={onClose}
                PaperProps={{
                    style: {
                        width: 1000,
                        maxWidth: "100%",
                        padding: "15px",
                        maxHeight: "90vh",
                        overflowY: "auto"
                    },
                }}
            >
                <DialogTitle sx={{ padding: "15px", mb: "10px", display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h6" component="span" sx={{ flex: 1 }}>
                        Kunlik ishni tahrirlash
                    </Typography>
                    <DatePicker
                        label="Sana tanlang"
                        value={selectedDate}
                        onChange={(v) => setSelectedDate(v)}
                        slotProps={{
                            textField: {
                                size: "small",
                                sx: { minWidth: 170, "& .MuiInputBase-input": { fontSize: "12px" } }
                            }
                        }}
                    />
                </DialogTitle>

                <Box sx={{ flex: 1 }}>
                    {productionNorm.map((item, idx) => {
                        const selectedIds = (formData[item.line] || []).map(row => row.order?.id).filter(Boolean);
                        const options = item.norm_category
                            .map(nc => ({ id: nc.id, order: nc.order, label: nc.order_name }))
                            .filter(opt => !selectedIds.includes(opt.id));
console.log(options);
console.log(selectedIds);

                        return (
                            <React.Fragment key={item.line}>
                                {idx > 0 && <Divider sx={{ my: 1 }} />}
                                <Accordion expanded={expanded === `panel${idx}`} onChange={handleChange(`panel${idx}`)}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography sx={{ flex: 1, fontWeight: 500, fontSize: "14px" }}>{item.line_name}</Typography>
                                        <Typography sx={{ color: "text.secondary", mr: 1, fontSize: "14px" }}>
                                            Jami: <strong>{formatNumber((formData[item.line] || []).reduce((sum, d) => sum + Number(d.quantity || 0), 0))}</strong>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ width: "70%", fontSize: "11px" }}>Model nomi</TableCell>
                                                    <TableCell sx={{ width: "20%", fontSize: "11px", textAlign: "center" }}>Bajardi</TableCell>
                                                    <TableCell sx={{ width: "10%" }} />
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {(formData[item.line] || []).map((row, rowIndex) => {
                                                    const rowOptions = [
                                                        ...options,
                                                        ...(row.order && !options.some(o => o.order === row.order) ? [row.order] : [])
                                                    ];
                                                    return (
                                                        <TableRow key={rowIndex}>
                                                            <TableCell>
                                                                <Autocomplete
                                                                    options={rowOptions}
                                                                    value={row.order}
                                                                    onChange={(e, newValue) => handleOrderChange(item.line, rowIndex, newValue)}
                                                                    getOptionLabel={(option) => option?.label || ""}
                                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                                    renderInput={(params) => <TextField {...params} size="small" placeholder="Model tanlang" />}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    type="number"
                                                                    size="small"
                                                                    value={row.quantity}
                                                                    onChange={(e) => handleQuantityChange(item.line, rowIndex, e.target.value)}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="error" onClick={() => handleDeleteRow(item.line, rowIndex)}>
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                <TableRow>
                                                    <TableCell colSpan={3}>
                                                        <Button variant="outlined" onClick={() => handleAddRow(item.line)} disabled={options.length === 0}>
                                                            ➕ Qator qo‘shish
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </AccordionDetails>
                                </Accordion>
                            </React.Fragment>
                        );
                    })}
                </Box>

                <DialogActions sx={{ mt: "10px" }}>
                    <Button variant="outlined" color="error" onClick={onClose}>Bekor qilish</Button>
                    <Button onClick={handleSubmit} variant="contained">Yangilash</Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default EditDailyModal;
