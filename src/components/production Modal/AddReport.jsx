import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
    MenuItem,
} from "@mui/material";
import { getProductionReport, getProductionReportOptions, getWarehouse } from "../api/axios";

const AddReport = ({ open, onClose, onAdd,  }) => {
  const [optionsMonth, setOptionsMonth] = useState([])
  const [optionsWarehouse, setOptionsWarehouse] = useState([])
  const [optionsYear, setOptionsYear] = useState([])
  const [form, setForm] = useState({
    warehouse:"",
    year: "",
    month: "",
    comment: "",
    day:"",
  });

  const resetForm = () => {
    setForm({
      warehouse:"",
    year: "",
    month: "",
    comment: "",
    day:"",
    });
  };

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const optionsResponse = await getProductionReportOptions();
          setOptionsMonth(optionsResponse.data.actions.POST.month.choices);
          setOptionsYear(optionsResponse.data.actions.POST.year.choices);
          console.log(optionsResponse.data);

        
         const warehouseResponse = await getWarehouse();
          setOptionsWarehouse(warehouseResponse.data);

        } 
        
        catch (error) {
          console.error("Ошибка при загрузке брендов:", error);
        }
      };
      fetchData();
    }
  }, [open]);


  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };



  const handleSubmit = () => {
    const data = new FormData();
    if (form.warehouse) data.append("warehouse", form.warehouse);
    if (form.year) data.append("year", form.year);
    if (form.month) data.append("month", form.month);
    if (form.comment.trim()) data.append("comment", form.comment.trim());
    if (form.day.trim()) data.append("day", form.day.trim()||"");


    onAdd(data); // parent komponentda API chaqiriladi
    resetForm();
    onClose();
    console.log(`onAdd`, data);
  };

  


  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: { width: 400, maxWidth: "100%", padding: "15px" },
      }}
    >
      <DialogTitle sx={{ padding: "15px", marginBottom: "10px" }}>
        Редактировать дату
      </DialogTitle>
      <DialogContent sx={{ overflow: "unset", padding: 0 }}>
        {/* Sana */}
         <TextField
          margin="dense"
          label="Filial"
          select
          fullWidth
          value={form.warehouse}
         onChange={handleChange("warehouse")}
          InputProps={{
            sx: {
              height: 30,              // 🔹 balandlik
              fontSize: 13             // 🔹 shrift
            }
          }}
          sx={{
            mt: 1, mb: 1,
            "& .MuiInputLabel-root": {
              fontSize: "13px",   // Label shrift
              top: "-10px"    // Label rangi
            },
          }}
            SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  maxHeight: 120,       // ✅ maksimal balandlik (scroll chiqadi)
                  "& .MuiMenuItem-root": {
                    fontSize: "12px",
                    minHeight: "28px",
                    paddingY: "2px",
                  },
                },
              },
            },
          }}
        >

          {optionsWarehouse.map((opt) => (
            <MenuItem key={opt.id} value={opt.id}>
              {opt.name}
            </MenuItem>
          ))}

        </TextField>

       <TextField
          margin="dense"
          label="Yil"
          select
          fullWidth
          value={form.year}
         onChange={handleChange("year")}
          InputProps={{
            sx: {
              height: 30,              // 🔹 balandlik
              fontSize: 13             // 🔹 shrift
            }
          }}
          sx={{
            mt: 1, mb: 1,
            "& .MuiInputLabel-root": {
              fontSize: "13px",   // Label shrift
              top: "-10px"    // Label rangi
            },
          }}
            SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  maxHeight: 120,       // ✅ maksimal balandlik (scroll chiqadi)
                  "& .MuiMenuItem-root": {
                    fontSize: "12px",
                    minHeight: "28px",
                    paddingY: "2px",
                  },
                },
              },
            },
          }}
        >

          {optionsYear.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.display_name}
            </MenuItem>
          ))}

        </TextField>
        <TextField
          margin="dense"
          label="Oy"
          select
          fullWidth
          value={form.month}
   onChange={handleChange("month")}
          InputProps={{
            sx: {
              height: 30,              // 🔹 balandlik
              fontSize: 13             // 🔹 shrift
            }
          }}
          sx={{
            mb: 2,
            "& .MuiInputLabel-root": {
              fontSize: "13px",   // Label shrift
              top: "-9px"    // Label rangi
            },
          }}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  maxHeight: 120,       // ✅ maksimal balandlik (scroll chiqadi)
                  "& .MuiMenuItem-root": {
                    fontSize: "12px",
                    minHeight: "28px",
                    paddingY: "2px",
                  },
                },
              },
            },
          }}
        >

          {optionsMonth.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: "12px", minHeight: "28px", paddingY: "2px", }}>
              {opt.display_name}
            </MenuItem>
          ))}
        </TextField>

        {/* Ish kuni */}
        <TextField
          fullWidth
          label="Ish kuni"
          type="number"
          value={form.day}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) {   // faqat raqam
              setForm({ ...form, day: val });
            }
          }}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          inputProps={{
            min: 1,               // ✅ faqat musbat son
            pattern: "\\d*",
            inputMode: "numeric",

          }}
          InputProps={{
            style: {
              height: 40,
              padding: "0 10px",

              marginBottom: "15px",
              height: 30,              // 🔹 balandlik
              fontSize: 13
            },

          }}
          sx={{
            "& .MuiOutlinedInput-input": { padding: 0, height: "100%" },
            "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
            "& input[type=number]": {
              MozAppearance: "textfield", // Firefox uchun
            },


          }}
        />

        {/* Izoh */}
        <TextField
          fullWidth
          label="Izox"
          value={form.comment}
          onChange={handleChange("comment")}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          InputProps={{
            style: { height: 40, padding: "0 10px", fontSize: "14px" },
          }}
          sx={{
            "& .MuiOutlinedInput-input": { padding: 0, height: "100%" },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ marginTop: "10px" }}>
        <Button variant="outlined" color="error" onClick={handleClose}>
          Отмена
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddReport;
