import { Autocomplete, Box, Button, CircularProgress, Container, Divider, TextField } from "@mui/material";
import { ButtonGroup, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { getOrders, getProductionNorm, getProductionReport, getProductionReportId, patchCategoryNorm, postCategoryNorm, postDaily, postProductionNorm } from "../api/axios";
import { data, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatNumber } from "../utils/formatNumber";
import DailyModal from "../production Modal/DailyModal";
import AddLineNorm from "../production Modal/AddLineNorm";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DailyProduction from "./DailyProduction";
import CategorySummaryChart from "../production Modal/CategorySummaryChart";
import { motion, AnimatePresence } from "framer-motion";
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';
import DailyLineProduction from "./DailyLineProduction";
// --- Styled Accordion ---
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': { borderBottom: 0 },
  '&::before': { display: 'none' },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .10)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
    transform: 'rotate(90deg)',
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
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

const MotionBox = motion(Box);
function Daily() {

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [productionNorm, setProductionNorm] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const { reportId } = useParams();
  const [addModalNormOpen, setAddModalNormOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [formData, setFormData] = useState({});
  const [orders, setOrders] = useState([]);
  const [editingRow, setEditingRow] = useState({});
  const [originalRow, setOriginalRow] = useState(null);
  const [errorMessage, setErrorMessage] = useState("")
  const [searchParams] = useSearchParams();
  const daily = searchParams.get("daily");
  const year = searchParams.get("year");
  const warehouse = searchParams.get("warehouse");
  const [warehouseId, setWarehouseId] = useState(warehouse)
  const [showFirst, setShowFirst] = useState(true);
  const [leftView, setLeftView] = useState("DailyProduction");
  const [selectedDaily, setSelectedDaily] = useState(null)
  const [productionReport, setProductionReport] = useState({})
  const [dailyReport, setDailyReport] = useState([])
  // const specification = searchParams.get("spec");

  const monthNames = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
  ];



  const handleBack = () => {
    setLeftView("DailyProduction");
  };

  // double-click bosilganda row edit rejimiga o'tadi
  const handleDoubleClick = (lineId, rowId) => {
    const line = productionNorm.find((l) => l.id === lineId);
    const row = line?.norm_category.find((r) => r.id === rowId);

    setOriginalRow({ lineId, rowId, ...row });
    setEditingRow({ lineId, rowId });

  };

  // edit rejimdan chiqish
  const handleCloseEdit = () => {
    if (originalRow) {
      setProductionNorm((prev) =>
        prev.map((line) =>
          line.id === originalRow.lineId
            ? {
              ...line,
              norm_category: line.norm_category?.map((cat) =>
                cat.id === originalRow.rowId
                  ? { ...cat, ...originalRow } // 🔹 asl qiymatni qaytarish
                  : cat
              ),
            }
            : line
        )
      );
    }
    setEditingRow({});
    setOriginalRow(null);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  const handleAddRow = (lineId) => {
    setFormData((prev) => ({
      ...prev,
      [lineId]: [...(prev[lineId] || []), { order: null, order_variant: null, quantity: "" }]
    }));
  };


  useEffect(() => {
    const fetchProduction = async () => {
      setLoadingFetch(true);
      try {

        const res = await getProductionReportId(reportId);
        setProductionReport(res.data);
        setProductionNorm(res.data.production_norm);
        setDailyReport(res.data.daily_report);
        console.log("productionreport", res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchProduction();
  }, [reportId]);


  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingFetch(true);
      try {
        const response = await getOrders({ page_size: 600 });
        setOrders(response.data.results);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchOrders();
  }, []);


  const handleAddLine = async (item) => {
    try {
      const response = await postProductionNorm(item);
      // agar backend list qaytarsa
      const newItems = Array.isArray(response.data) ? response.data : [response.data];
      setProductionNorm(prev => [...prev, ...newItems]);
    } catch (err) {
      console.error("Add failed:", err);
    } finally {
      setAddModalNormOpen(false); // 🔹 sen addModalOpen emas, addModalNormOpen ishlatishing kerak edi
    }
  };


  const handleDeleteRow = (lineId, rowIndex) => {
    setFormData((prev) => {
      const updatedRows = [...(prev[lineId] || [])];
      updatedRows.splice(rowIndex, 1);
      return { ...prev, [lineId]: updatedRows };
    });
  };



  const handleAddLineNorm = async (lineId, row, rowIdx) => {
    const payload = {
      production_norm: lineId,
      order: row.order?.id, // yoki order_name bo‘lsa shu
      order_variant: row.variant?.id,
      norm: Number(row.norm),
    };

    try {
      const response = await postCategoryNorm(payload);

      // yangi kategoriya qaytsa uni productionNorm ga qo‘shamiz
      setProductionNorm((prev) =>
        prev.map((line) =>
          line.id === lineId
            ? {
              ...line,
              norm_category: [...line.norm_category, response.data],
              total_norm: line.total_norm + Number(row.norm),
            }
            : line
        )
      );

      // formData ichidan o‘sha qatordan o‘chirib tashlaymiz
      setFormData((prev) => ({
        ...prev,
        [lineId]: prev[lineId].filter((_, i) => i !== rowIdx),
      }));
    } catch (err) {
      if (err.response && err.response.data) {
        // DRF validation errors
        const errors = err.response.data;
        console.log(errors.order[0]);

        // barcha field xatolarini bitta stringga birlashtiramiz
        const messages = Object.entries(errors)
          .map(([field, msgs]) => {
            if (Array.isArray(msgs)) return `${field}: ${msgs.join(", ")}`;
            return `${field}: ${msgs}`;
          })
          .join(" | ");
        console.log(errorMessage);

        setErrorMessage(errors.order[0]);
      } else {
        setErrorMessage("Serverga ulanishda xato yuz berdi");
      }
      console.error(err);
    }
  };
  const handleEditLineNorm = async (row) => {
    console.log("handleEditLineNorm-ROW",row);

const payload = {
  order: row.order_detail?.id ?? row.order?.id, // row.order_detail bo‘lsa undan, aks holda row.order
  order_variant: row.order_variant ?? row.variant?.id, // variant id ni olamiz
  norm: Number(row.norm),
};
    console.log("handleEditLineNorm-PAYLOAD",payload)

    try {
      const { data } = await patchCategoryNorm(editingRow.rowId, payload);

      // order obyektini olish
      const orderObj =
        typeof data.order === "number"
          ? orders.find((o) => o.id === data.order)
          : data.order;

      // yangilangan qator
      const updatedRow = {
        ...data,
        order: orderObj,
        order_name: orderObj?.full_name,
      };

setProductionNorm(prev =>
  prev.map(line =>
    line.id !== editingRow.lineId
      ? line
      : {
          ...line,
          norm_category: line.norm_category.map(cat =>
            cat.id === editingRow.rowId ? updatedRow : cat
          ),
        }
  )
);
// handleCloseEdit faqat cancel bo‘lganda chaqiriladi
setEditingRow({});
setOriginalRow(null);
    } catch (err) {
      if (err.response && err.response.data) {
        // DRF validation xabari
        console.log(`error`, err.response.data);
        setErrorMessage(Object.values(err.response.data).flat().join("\n"));
      } else {
        setErrorMessage("Serverga ulanishda xato yuz berdi");
      }
      console.error(err);
    }
  };

  return (
    <Container maxWidth="full" sx={{ gap: 2, minHeight: "800px" }}>
      <h2 style={{ textAlign: "center", margin: "0", marginBottom: "5px" }}>{daily}-{year}</h2>
      {/* Chap tomonda jadval */}
      <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
          <AnimatePresence mode="wait">
            {leftView === "DailyProduction" && (
              <MotionBox
                key="DailyProduction"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {loadingFetch ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "700px",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <DailyProduction
                    onPreview={(item) => {
                      setSelectedDaily(item);
                      setLeftView("DailyLineProduction");
                    }}
                    dailyReport={dailyReport}
                  />
                )}
              </MotionBox>
            )}

            {leftView === "DailyLineProduction" && (
              <MotionBox
                key="DailyLineProduction"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >

                <DailyLineProduction
                  reportId={reportId}
                  lineId={selectedDaily}
                  onBack={handleBack}
                />
              </MotionBox>
            )}
          </AnimatePresence>
        </Box>

        <Snackbar
          open={!!errorMessage}
          autoHideDuration={6000}
          onClose={() => setErrorMessage("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => setErrorMessage("")} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
        <Box sx={{ width: "2px", height: "780px", background: "gray" }}></Box>
        {/* O'ng tomonda accordionlar */}
        <Box sx={{ display: "flex", flexDirection: "column", width: "50%", position: "relative" }}>
          <div style={{ position: "relative" }}>
            <h3 style={{ textAlign: "center", margin: "0" }}>Bir oylik liniya rejasi</h3>
            <IconButton sx={{ cursor: "pointer", padding: "6px", position: "absolute", left: "0" }} onClick={() => setShowFirst(!showFirst)}>

              <ThreeSixtyIcon />
            </IconButton>

          </div>


          {showFirst ? (
            <MotionBox key="first"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.5 }} sx={{ flex: 1, overlay: "auto" }}

              style={{ display: showFirst ? "block" : "none" }}>

              <Button size="small" sx={{ fontSize: "10px", position: "absolute", right: "0", top: "-4px" }} variant="contained" onClick={() => setAddModalNormOpen(true)}>
                Добавить линия
              </Button>
              {loadingFetch ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200px",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                productionNorm?.map((item, idx) => (


                  <React.Fragment key={`line-${item.id}-${idx}`}>
                    {idx > 0 && (
                      <>
                        <Divider sx={{ my: 0.5 }} />
                      </>
                    )}

                    <Accordion
                      expanded={expanded === `panel${idx}`}
                      onChange={handleChange(`panel${idx}`)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          backgroundColor: isDark
                            ? (expanded === `panel${idx}` ? '#4b749f' : '##223545')  // dark mode ranglari
                            : (expanded === `panel${idx}` ? '#b9dfee' : '#eef2f3'),  // light mode ranglari

                          '&:hover': { backgroundColor: isDark ? "#557c93" : "#c3e1fc", },
                          padding: "4px 4px",       // yuqori/past kichikroq
                          minHeight: "20px",            // default 48px → kichraytirildi
                          "& .MuiAccordionSummary-content": {
                            margin: 0,              // ichki content bo‘shlig‘ini olib tashlash
                          }
                        }}
                      >
                        <Typography sx={{
                          flex: 1, fontWeight: 500, fontSize: "14px", color: isDark
                            ? (expanded === `panel${idx}` ? "#00ff87" : "#11d3f3") // dark mode ranglari
                            : (expanded === `panel${idx}` ? "#D70F20" : "#3C60AD")
                        }}>
                          {item.line_name}
                        </Typography>

                        <Typography sx={{ flex: 1, color: 'text.secondary', fontSize: "14px" }}>
                          Общ.План: <strong>{formatNumber(item.total_norm)}</strong>

                        </Typography>
                        <Typography sx={{ color: 'text.secondary', mr: 10, fontSize: "14px" }}>
                          1-Sort: <strong>{formatNumber(item.total_sort_1)}</strong>

                        </Typography>
                        <Typography sx={{ color: 'text.secondary', mr: 10, fontSize: "14px" }}>
                          2-Sort: <strong>{formatNumber(item.total_sort_2)}</strong>

                        </Typography>
                        <Typography sx={{ color: 'text.secondary', mr: 5, fontSize: "14px" }}>
                          Brak: <strong>{formatNumber(item.total_defect)}</strong>

                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ padding: "10px", backgroundColor: isDark ? "#243740" : "white", }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ width: "40%", fontSize: "12px", padding: "5px 10px" }}>Model nomi</TableCell>
                              <TableCell sx={{ width: "10%", fontSize: "12px", padding: "5px 10px" }}>variant nomi</TableCell>
                              <TableCell sx={{ width: "10%", fontSize: "12px", padding: "5px 10px" }}>Reja</TableCell>
                              <TableCell sx={{ textAlign: "right", width: "10%", fontSize: "12px", padding: "5px 10px" }}>1-sort</TableCell>
                              <TableCell sx={{ textAlign: "right", width: "10%", fontSize: "12px", padding: "5px 10px" }}>2-sort</TableCell>
                              <TableCell sx={{ textAlign: "right", width: "5%", fontSize: "12px", padding: "5px 10px" }}>Brak</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {item.norm_category?.map((detail) => {
                              const isEditing =
                                editingRow.lineId === item.id && editingRow.rowId === detail.id;

                              return (
                                <TableRow
                                  key={detail.id}
                                  onDoubleClick={() => handleDoubleClick(item.id, detail.id)}
                                  sx={{ cursor: "pointer" }}
                                >
                                  {/* Model nomi */}
                                  <TableCell sx={{ fontSize: "12px", padding: "2px 4px" }}>
                                    {isEditing ? (
                                      <Autocomplete
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        options={orders}
                                        getOptionLabel={(option) => option.full_name || ""}
                                        value={detail.order_detail || null}
                                        onChange={(e, newValue) => {
                                          setProductionNorm(prev =>
                                            prev.map(line =>
                                              line.id === item.id
                                                ? {
                                                  ...line,
                                                  norm_category: line.norm_category.map(cat =>
                                                    cat.id === detail.id
                                                      ? { ...cat, order: newValue, order_variant: null }
                                                      : cat
                                                  ),
                                                }
                                                : line
                                            )
                                          );
                                        }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            size="small"
                                            label="Model tanlang"
                                            variant="standard"
                                            InputProps={{ ...params.InputProps, ...commonInputProps }}
                                            sx={commonTextFieldSx}
                                          />
                                        )}
                                      />
                                    ) : (
                                      detail.order_name
                                    )}
                                  </TableCell>

                                  <TableCell sx={{ fontSize: "12px", padding: "2px 4px" }}>
                                    {isEditing ? (
                                      <Autocomplete
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        options={detail.order_detail?.variant_link || []}
                                        getOptionLabel={(option) => option.name || ""}
                                        value={
                                          detail.order_detail?.variant_link.find(
                                            (v) => v.id === detail.order_variant
                                          ) || null
                                        }
                                       onChange={(e, newValue) => {
  setProductionNorm(prev =>
    prev.map(line =>
      line.id === item.id
        ? {
            ...line,
            norm_category: line.norm_category.map(cat =>
              cat.id === detail.id
                ? { ...cat, order_variant: newValue?.id || null }
                : cat
            ),
          }
        : line
    )
  );
}}

                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            size="small"
                                            label="Variant tanlang"
                                            variant="standard"
                                            InputProps={{ ...params.InputProps, ...commonInputProps }}
                                            sx={commonTextFieldSx}
                                          />
                                        )}
                                      />
                                    ) : (
                                      detail.order_variant_name
                                    )}
                                  </TableCell>

                                  <TableCell sx={{ fontSize: "12px", padding: "6px 4px" }}>
                                    {isEditing ? (
                                      <TextField
                                        type="number"
                                        label="Reja"
                                        size="small"
                                        variant="standard"
                                        value={detail.norm}
                                        onChange={(e) => {
                                          const newValue = e.target.value;
                                          setProductionNorm((prev) =>
                                            prev.map((line) =>
                                              line.id === item.id
                                                ? {
                                                  ...line,
                                                  norm_category: line.norm_category?.map((cat) =>
                                                    cat.id === detail.id
                                                      ? { ...cat, norm: newValue }
                                                      : cat
                                                  ),
                                                }
                                                : line
                                            )
                                          );
                                        }}
                                        InputProps={commonInputProps}
                                        sx={commonTextFieldSx}
                                      />
                                    ) : (
                                      formatNumber(detail.norm)
                                    )}
                                  </TableCell>



                                  {/* Bajarildi yoki Edit tugmalari */}
                                  <TableCell sx={{ textAlign: "right", padding: "2px 10px", fontSize: "12px" }}>
                                    {isEditing ? (
                                      <ButtonGroup size="small">
                                        <IconButton
                                          color="success"
                                          onClick={() => {
                                            // ✅ Save (masalan serverga jo‘natish mumkin)
                                            console.log("Save:", detail);
                                            handleEditLineNorm(detail);
                                          }}
                                        >
                                          <CheckCircleOutlineIcon sx={{ fontSize: "20px" }} />
                                        </IconButton>
                                        <IconButton color="error" onClick={handleCloseEdit}>
                                          <HighlightOffIcon sx={{ fontSize: "20px" }} />
                                        </IconButton>
                                      </ButtonGroup>
                                    ) : (
                                      formatNumber(detail.total_sort_1)
                                    )}
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "right", padding: "2px 10px", fontSize: "12px" }}>
                                    {isEditing ? (
                                      <></>
                                    ) : (
                                      formatNumber(detail.total_sort_2)
                                    )}
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "right", padding: "2px 10px", fontSize: "12px" }}>
                                    {isEditing ? (
                                      <></>
                                    ) : (
                                      formatNumber(detail.total_defect)
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}



                            {formData[item.id]?.map((row, rowIdx) => (
                              <TableRow key={`new-${rowIdx}`}>
                                <TableCell>
                                  <Autocomplete
                                    options={orders}
                                    getOptionLabel={(option) => option.full_name || ""}
                                    value={row.order || null}
                                    onChange={(e, newValue) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        [item.id]: prev[item.id].map((r, i) =>
                                          i === rowIdx
                                            ? {
                                              ...r,
                                              order: newValue,
                                              variant: null   // 🔹 yangi order tanlansa, variantni reset qilamiz
                                            }
                                            : r
                                        ),
                                      }))
                                    }
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Model tanlang"
                                        sx={{
                                          "& .MuiInputBase-input": { fontSize: "12px" },
                                          "& .MuiInputLabel-root": { fontSize: "12px" },
                                        }}
                                      />
                                    )}
                                  />

                                </TableCell>

                                {/* Variant tanlash */}
                                <TableCell>
                                  <Autocomplete
                                    options={row.order?.variant_link || []}
                                    getOptionLabel={(option) => option.name || ""}
                                    value={row.variant || null}
                                    onChange={(e, newValue) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        [item.id]: prev[item.id].map((r, i) =>
                                          i === rowIdx ? { ...r, variant: newValue } : r
                                        ),
                                      }))
                                    }
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Variant tanlang"
                                        sx={{
                                          "& .MuiInputBase-input": { fontSize: "12px" },
                                          "& .MuiInputLabel-root": { fontSize: "12px" },
                                        }}
                                      />
                                    )}
                                  />
                                </TableCell>

                                {/* Norm soni */}
                                <TableCell>
                                  <TextField
                                    type="number"
                                    size="small"
                                    variant="outlined"
                                    placeholder="Reja"
                                    value={row.norm ?? ""}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        [item.id]: prev[item.id].map((r, i) =>
                                          i === rowIdx ? { ...r, norm: e.target.value } : r
                                        ),
                                      }))
                                    }
                                    sx={{ "& .MuiInputBase-input": { fontSize: "12px" } }}
                                  />
                                </TableCell>

                                {/* Action tugmalar */}
                                <TableCell sx={{ textAlign: "right" }}>
                                  <Box >
                                    <IconButton onClick={() => handleDeleteRow(item.id, rowIdx)}>
                                      <HighlightOffIcon color="error" />
                                    </IconButton>
                                    <IconButton onClick={() => handleAddLineNorm(item.id, row, rowIdx)}>
                                      <CheckCircleOutlineIcon color="success" />
                                    </IconButton>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}


                            <TableRow>
                              <TableCell colSpan={6}>
                                <Button
                                  variant="contained"
                                  onClick={() => handleAddRow(item.id)}
                                  sx={{ fontSize: "9px", padding: "5px" }}
                                >
                                  ➕ Добавить план
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </AccordionDetails>
                    </Accordion>

                  </React.Fragment>
                )))}





              <AddLineNorm
                open={addModalNormOpen}
                onClose={() => { setAddModalNormOpen(false); }}
                onAdd={handleAddLine}
                warehouse={warehouseId}
                reportId={reportId}
                usedLines={productionNorm.map(item => item.line)} // mavjud liniya idlarini yuboramiz
              />
            </MotionBox >
          ) : (
            <MotionBox sx={{ marginBottom: "10px" }} key="second"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.5 }}>     <h4 style={{ textAlign: "center" }}>Kategoriya</h4><CategorySummaryChart /></MotionBox>
          )}

        </Box>
      </Box>
    </Container>
  );
}

export default Daily;
