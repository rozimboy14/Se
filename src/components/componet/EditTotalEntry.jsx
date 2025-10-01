import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const EditTotalEntry = ({ open, onClose, onEdit, initialValue }) => {
  const [date, setDate] = useState("");
    const [name, setName] = useState("");

useEffect(() => {
    if (initialValue?.created_date && initialValue?.comment !== undefined)  {
    // "11.08.2025 11:04" -> ["11", "08", "2025 11:04"]
    const [day, month, yearTime] = initialValue.created_date.split(".");
    const [year] = yearTime.split(" "); // "2025"
    const formatted = `${year}-${month}-${day}`; // "2025-08-11"
    setDate(formatted);
     setName(initialValue.comment || "");
  }
  console.log(initialValue);
  
}, [open, initialValue]); // open ni qo'shish kerak

  const handleSubmit = () => {
    if (date.trim()) {
      onEdit({ comment: name.trim(),created_date:date}); // Sana string formatida yuboriladi
      setDate("");
      setName("")
      onClose();
    }
  };

  const handleClose = () => {
    setDate("");
    onClose();
      setName("")
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
        <TextField
          autoFocus
          fullWidth
          label="Дата"
          type="date"
          value={date} // Faqat YYYY-MM-DD
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          InputProps={{
            style: { height: 40, padding: "0 10px", fontSize: "14px" },
          }}
          sx={{
            "& .MuiOutlinedInput-input": {
              padding: 0,
              height: "100%",
            },
            marginBottom:"15px"
          }}
        />
                <TextField
          autoFocus
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
            "& .MuiOutlinedInput-input": {
              padding: 0,
              height: "100%",
            },
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

export default EditTotalEntry;
