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

const EditBrand = ({ open, onClose, onEdit, initialValue }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  // Modal ochilganda qiymatlarni to‘ldirish
  useEffect(() => {
    if (initialValue) {
      setName(initialValue.name || "");
      setImage(null); // edit paytida yangi rasm tanlamaguncha bo‘sh
    }
  }, [initialValue]);

  const handleSubmit = () => {
    if (name.trim()) {
      const formData = new FormData();
      formData.append("name", name.trim());

      if (image) {
        formData.append("image", image);
      }

      onEdit(formData); // edit funksiyasi chaqiriladi
      setName("");
      setImage(null);
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    setImage(null);
    onClose();
  };
  console.log(initialValue);
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

       <Button
  variant="outlined"
  component="label"
  fullWidth
  sx={{ marginTop: "10px" }}
>
  {image
    ? image.name
    : initialValue?.image
    ? "Текущая: " + initialValue.image.split("/").pop()
    : "Выберите изображение"}
  <input
    type="file"
    accept="image/*"
    hidden
    onChange={(e) => setImage(e.target.files[0])}
  />
</Button>

{!image && initialValue?.image && (
  <img
    src={initialValue.image}
    alt="preview"
    style={{
      marginTop: "10px",
      maxHeight: "100px",
      objectFit: "contain",
    }}
  />
)}
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

export default EditBrand;
