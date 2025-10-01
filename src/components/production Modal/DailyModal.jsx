import React, { useEffect, useState } from "react";
import {
    Dialog, DialogTitle, DialogActions, Button, Box, Divider,
    Table, TableBody, TableCell, TableHead, TableRow, IconButton
} from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, { accordionSummaryClasses } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import { formatNumber } from "../utils/formatNumber";
import { getProductionNorm } from "../api/axios";

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

const DailyModal = ({ open, onClose, onAdd, reportId }) => {
    const [productionNorm, setProductionNorm] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedDate, setSelectedDate] = useState(dayjs()); // ⬅️ sana

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    console.log("production norm",productionNorm);
    
    const handleAddRow = (lineId) => {
        setFormData((prev) => ({
            ...prev,
            [lineId]: [...(prev[lineId] || []), { order: null, sort_1: "",sort_2:"",defect_quantity:"" }]
        }));
    };

    const handleOrderChange = (lineId, rowIndex, newOrder) => {
        console.log("newOrder",newOrder);
        
        setFormData((prev) => {
            const updatedRows = [...(prev[lineId] || [])];
            updatedRows[rowIndex].order = newOrder;
            console.log( "updatedRows",updatedRows[rowIndex]);
            
            return { ...prev, [lineId]: updatedRows };
        });
    };

const handleQuantityChange = (lineId, rowIndex, field, value) => {
    setFormData((prev) => {
        const updatedRows = [...(prev[lineId] || [])];
        updatedRows[rowIndex][field] = value;
        return { ...prev, [lineId]: updatedRows };
    });
};

    const handleDeleteRow = (lineId, rowIndex) => {
        setFormData((prev) => {
            const updatedRows = [...(prev[lineId] || [])];
            updatedRows.splice(rowIndex, 1);
            return { ...prev, [lineId]: updatedRows };
        });
    };
    const handleSubmit = () => {
        const payload = {
            production_report: reportId,
            date: selectedDate ? selectedDate.format("YYYY-MM-DD") : null,
            lines: Object.entries(formData).map(([lineId, rows]) => ({
                line: Number(lineId),
                order_line: rows.map(row => ({
                    order: row.order?.id || null, 
                    sort_1: Number(row.sort_1) || 0,
                    sort_2: Number(row.sort_2) || 0,
                    defect_quantity: Number(row.defect_quantity) || 0
                }))
            }))
        };

        console.log("Yuboriladigan payload:", payload);
        onAdd(payload);
        console.log(formData);

        onClose();
    };

    useEffect(() => {
        const fetchProduction = async () => {
            setLoadingFetch(true);
            try {
                const res = await getProductionNorm(reportId);
                setProductionNorm(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingFetch(false);
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
                        maxHeight: "700px",
                        minHeight: "800px",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        padding: "15px",
                        mb: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: 2
                    }}
                >
                    <Typography variant="h6" component="span" sx={{ flex: 1 }}>
                        Kunlik bajarilgan ish
                    </Typography>
                    <DatePicker
                        label="Sana tanlang"
                        value={selectedDate}
                        onChange={(v) => setSelectedDate(v)}
                        slotProps={{
                            textField: {
                                size: "small",
                                sx: {
                                    minWidth: 170,
                                    "& .MuiInputBase-input": { fontSize: "12px" }, // input matn
                                    "& .MuiInputLabel-root": { fontSize: "12px" }, // label
                                }
                            }
                        }}
                    />
                </DialogTitle>

                <Box sx={{ flex: 1 }}>
                    {productionNorm?.map((item, idx) => {
                        const selectedIds = (formData[item.line] || [])
                            .map(row => row.order?.order) // ✅ endi `order` bo‘yicha tekshiramiz
                            .filter(Boolean);
                        const options = item.norm_category.map((nc) => ({
                            id: nc.id,
                            order: nc.order,
                            label: nc.order_name
                        })).filter(opt => !selectedIds.includes(opt.order));

                        return (
                            <React.Fragment key={item.id}>
                                {idx > 0 && <Divider sx={{ my: 1 }} />}
                                <Accordion
                                    expanded={expanded === `panel${idx}`}
                                    onChange={handleChange(`panel${idx}`)}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        sx={{
                                            backgroundColor:
                                                expanded === `panel${idx}` ? "#e3f2fd" : "rgba(0, 0, 0, .03)",
                                            "&:hover": { backgroundColor: "#bbdefb" },
                                        }}
                                    >
                                        <Typography sx={{ flex: 1, fontWeight: 500, fontSize: "14px" }}>
                                            {item.line_name}
                                        </Typography>
                                        <Typography sx={{ color: "text.secondary", mr: 1, fontSize: "14px" }}>
                                            Jami:{" "}
                                            <strong>
                                                {formatNumber(
                                                    (formData[item.line] || []).reduce(
                                                        (sum, detail) => sum + Number(detail.quantity || 0),
                                                        0
                                                    )
                                                )}
                                            </strong>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ width: "65%", fontSize: "11px" }}>Model nomi</TableCell>
                                                    <TableCell sx={{ width: "10%", fontSize: "11px", textAlign: "center" }}>1-сорт</TableCell>
                                                    <TableCell sx={{ width: "10%", fontSize: "11px", textAlign: "center" }}>2-сорт</TableCell>
                                                    <TableCell sx={{ width: "10%", fontSize: "11px", textAlign: "center" }}>Брак</TableCell>
                                                    <TableCell sx={{ width: "5%", fontSize: "11px", textAlign: "center" }} />
                                                </TableRow>
                                            </TableHead>
                                      <TableBody>
  {(formData[item.line] || []).map((row, rowIndex) => (
    <TableRow key={rowIndex}>
      <TableCell sx={{padding:"2px 5px"}}>
        <Autocomplete
          options={options}
          value={row.order}  
          onChange={(e, newValue) =>
            handleOrderChange(item.line, rowIndex, newValue)
          }
          getOptionLabel={(option) => option.label || ""} // ✅ label ko‘rsatish
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              placeholder="Model tanlang"
              sx={{
                "& .MuiInputBase-input": { fontSize: "12px", padding: 0 },
                "& .MuiInputLabel-root": { fontSize: "12px" },
              }}
            />
          )}
          sx={{ "& .MuiInputBase-root": { fontSize: "12px" } }}
          ListboxProps={{
            sx: {
              "& .MuiAutocomplete-option": { fontSize: "12px", padding: 0 },
            },
          }}
        />
      </TableCell>
      <TableCell sx={{padding:"2px 5px"}}>
        <TextField
          type="number"
          size="small"
          value={row.sort_1}
          onChange={(e) =>
             handleQuantityChange(item.line, rowIndex, "sort_1", e.target.value)
          }
          sx={{ "& .MuiInputBase-input": { fontSize: "12px" } }}
        />
      </TableCell>
      <TableCell sx={{padding:"2px 5px"}}>
        <TextField
          type="number"
          size="small"
          value={row.sort_2}
          onChange={(e) =>
                handleQuantityChange(item.line, rowIndex, "sort_2", e.target.value)
          }
          sx={{ "& .MuiInputBase-input": { fontSize: "12px" } }}
        />
      </TableCell>
      <TableCell sx={{padding:"2px 5px"}}>
        <TextField
          type="number"
          size="small"
          value={row.defect_quantity}
          onChange={(e) =>
            handleQuantityChange(item.line, rowIndex, "defect_quantity", e.target.value)
          }
          sx={{ "& .MuiInputBase-input": { fontSize: "12px" } }}
        />
      </TableCell>
      <TableCell align="center" sx={{padding:"2px 5px"}}>
        <IconButton
          color="error"
          onClick={() => handleDeleteRow(item.line, rowIndex)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}

  <TableRow>
    <TableCell colSpan={3}>
      <Button
        variant="outlined"
        onClick={() => handleAddRow(item.line)}
        disabled={options.length === 0}
        sx={{ fontSize: "12px" }}
      >
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
                    <Button variant="outlined" color="error" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default DailyModal;
