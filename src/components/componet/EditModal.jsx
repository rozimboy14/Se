// EditModal.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const EditModal = ({ open, onClose, onEdit, initialValue }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (initialValue) {
      setName(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = () => {
    if (name.trim()) {
      onEdit(name.trim());
      setName("");
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: 400,
          maxWidth: "100%",
          padding: "15px",
        },
      }}
    >
      <DialogTitle sx={{ padding: "15px", marginBottom: "10px" }}>
        Редактировать бренд
      </DialogTitle>
      <DialogContent sx={{ overflow: "unset", padding: 0 }}>
        <TextField
          autoFocus
          fullWidth
          label="Название бренда"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          InputProps={{
            style: {
              height: 40,
              padding: "0 10px",
              fontSize: "14px",
            },
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

export default EditModal;
