import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField
} from "@mui/material";

const AddCategory = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [norm, setNorm] = useState("");

  const handleSubmit = () => {
    if (name.trim() && norm.trim()) {
      onAdd({ name: name.trim(), norm: parseFloat(norm) });
      setName("");
      setNorm("");
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    setNorm("");
    onClose();
  };



  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ style: { width: 400, padding: "15px" } }}>
      <DialogTitle>Добавить категорию</DialogTitle>
      <DialogContent sx={{ overflow: "unset", padding: 0 }}>
        <TextField
          autoFocus fullWidth label="Название"
          value={name} onChange={(e) => setName(e.target.value)}
          variant="outlined" sx={{ mt: 1, mb: 2 }}
        />
        <TextField
          fullWidth type="number" label="Норма"
          value={norm} onChange={(e) => setNorm(e.target.value)}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions sx={{ mt: 2 }}>
        <Button variant="outlined" color="error" onClick={handleClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained">Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategory;
