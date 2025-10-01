import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { getBrand } from "../api/axios";

const AddAccessory = ({ open, onClose, onAdd }) => {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({
    name: "",
    comment: "",
    brand: "",
    type: "",
    image: null,
  });

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      comment: "",
      brand: "",
      type: "",
      image: null,
    });
  };

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const brandsResponse = await getBrand();
          setBrands(brandsResponse.data);
        } catch (error) {
          console.error("Ошибка при загрузке брендов:", error);
        }
      };
      fetchData();
    }
  }, [open]);

  const handleSubmit = async () => {
    const data = new FormData();
    if (form.name.trim()) data.append("name", form.name.trim());
    if (form.comment.trim()) data.append("comment", form.comment.trim());
    if (form.brand) data.append("brand", form.brand);
    if (form.type) data.append("type", form.type);

    if (form.image instanceof File) {
      data.append("image", form.image);
    }

    onAdd(data); // parent komponentda API chaqiriladi
    resetForm();
    onClose();
    console.log(`onAdd`, data);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const TYPE_CHOICES = [
    { value: "KG", label: "Кг" },
    { value: "SHT", label: "Шт" },
    { value: "M", label: "Метр" },
  ];

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Yangi Accessory qo‘shish</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nomi"
          fullWidth
          value={form.name}
          onChange={handleChange("name")}
            InputProps={{
                sx: {
                  height: 35,              // 🔹 balandlik
                  fontSize: 14             // 🔹 shrift
                }
              }}
              sx={{
                 mb: 1, "& .MuiInputLabel-root": {
                  fontSize: "14px",   // Label shrift
                  top: "-7px"    // Label rangi
                },
             
              }}
        />

        <TextField
          margin="dense"
          label="Brand"
          select
          fullWidth
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
            InputProps={{
                sx: {
                  height: 35,              // 🔹 balandlik
                  fontSize: 14             // 🔹 shrift
                }
              }}
              sx={{
                 mb: 1, "& .MuiInputLabel-root": {
                  fontSize: "14px",   // Label shrift
                  top: "-7px"    // Label rangi
                },
      
              }}
        >

          {brands.map((b) => (
            <MenuItem key={b.id} value={b.id}>
              {b.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="type"
          select
          fullWidth
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
                 InputProps={{
                sx: {
                  height: 35,              // 🔹 balandlik
                  fontSize: 14             // 🔹 shrift
                }
              }}
              sx={{
                 mb: 1, "& .MuiInputLabel-root": {
                  fontSize: "14px",   // Label shrift
                  top: "-7px"    // Label rangi
                },
      
              }}
        >

          {TYPE_CHOICES.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Izoh"
          fullWidth
          value={form.comment}
          onChange={handleChange("comment")}
                 InputProps={{
                sx: {
                  height: 35,              // 🔹 balandlik
                  fontSize: 14             // 🔹 shrift
                }
              }}
              sx={{
                 mb: 1, "& .MuiInputLabel-root": {
                  fontSize: "14px",   // Label shrift
                  top: "-7px"    // Label rangi
                },
      
              }}
        />

        {/* Fayl tanlash */}
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ textTransform: "none", mt: 2 ,fontSize:"12px"}}
        >
          Rasm yuklash
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setForm({ ...form, image: file });
              }
            }}
          />
        </Button>

        {/* Preview */}
        {form.image && (
          <div style={{ marginTop: "12px" }}>
            <img
              src={URL.createObjectURL(form.image)}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: 200,
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            />
            <p>📁 {form.image.name}</p>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{fontSize:"12px"}}>Bekor qilish</Button>
        <Button variant="contained" sx={{fontSize:"12px"}} onClick={handleSubmit}>
          Saqlash
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAccessory;
