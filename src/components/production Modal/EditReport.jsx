import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const EditReport = ({ open, onClose, onEdit, initialValue }) => {
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (initialValue) {
      let formatted = "";

      // 1) ISO format (2025-08-11T00:00:00Z)
      if (initialValue.month?.includes("T")) {
        formatted = initialValue.month.split("T")[0];
      }
      // 2) "11.08.2025 11:04"
      else if (initialValue.month?.includes(".")) {
        const [d, m, yTime] = initialValue.month.split(".");
        const [y] = yTime.split(" ");
        formatted = `${y}-${m}-${d}`;
      }
      // 3) Agar to‘g‘ridan-to‘g‘ri "2025-08-01" kelsa
      else if (/^\d{4}-\d{2}-\d{2}$/.test(initialValue.month)) {
        formatted = initialValue.month;
      }

      setDate(formatted);
      setName(initialValue.comment || "");
      setDay(initialValue.day || "");
    }
  }, [open, initialValue]);

  const handleSubmit = () => {
    if (date.trim()) {
      onEdit({
        comment: name.trim(),
        day: Number(day),      // ✅ raqam qilib yuboramiz
        month: date,    // YYYY-MM-DD
      });
      setDate("");
      setName("");
      setDay("");
      onClose();
    }
  };

  const handleClose = () => {
    setDate("");
    setName("");
    setDay("");
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
          fullWidth
          label="Дата"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          InputProps={{
            style: { height: 40, padding: "0 10px", fontSize: "14px" },
          }}
          sx={{
            "& .MuiOutlinedInput-input": { padding: 0, height: "100%" },
            marginBottom: "15px",
          }}
        />

        {/* Ish kuni */}
        <TextField
          fullWidth
          label="Ish kuni"
          value={day}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) {   // faqat raqam
              setDay(val);
            }
          }}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          inputProps={{
            min: 1,               // ✅ faqat musbat son
            pattern: "\\d*",
            inputMode: "numeric"
          }}
          InputProps={{
            style: {
              height: 40,
              padding: "0 10px",
              fontSize: "14px",
              marginBottom: "15px",
            },
          }}
          sx={{
            "& .MuiOutlinedInput-input": { padding: 0, height: "100%" },
          }}
        />

        {/* Izoh */}
        <TextField
          fullWidth
          label="Izox"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

export default EditReport;
