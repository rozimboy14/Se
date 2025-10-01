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

const EditAccessory = ({ open, onClose, initialData, onUpdate }) => {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    comment: "",
    type: "",
    image: null,
  });

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      brand: "",
      comment: "",
      type: "",
      image: null,
    });
  };

  // Modal ochilganda eski qiymatlarni yuklab olish
  useEffect(() => {
    if (open && initialData) {
      setForm({
        name: initialData.name || "",
        brand: initialData.brand?.id || initialData.brand || "",
        type: initialData.type,
        comment: initialData.comment || "",
        image: null, // faqat yangi yuklansa o‘zgaradi
      });
    }
  }, [initialData, open]);

  // Brendlarni olish
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

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSubmit = () => {
    const data = new FormData();
    data.append("name", form.name.trim());
    data.append("brand", form.brand);
    data.append("comment", form.comment.trim());
    data.append("type", form.type);

    if (form.image instanceof File) {
      data.append("image", form.image);
    }

    if (onUpdate) {
      onUpdate(data, initialData.id); // parentda API chaqiriladi
    }

    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };
  const TYPE_CHOICES = [
    { value: "KG", label: "Кг" },
    { value: "SHT", label: "Шт" },
    { value: "M", label: "Метр" },
  ];

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Aksessuarni tahrirlash</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nomi"
          fullWidth
          value={form.name}
          onChange={handleChange("name")}
        />

        <TextField
          margin="dense"
          label="Brand"
          select
          fullWidth
          value={form.brand || ""}
          onChange={handleChange("brand")}
        >
          <MenuItem value="">— Tanlang —</MenuItem>
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
          value={form.type || ""}
          onChange={handleChange("type")}
        >
          <MenuItem value="">— --- —</MenuItem>
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
        />

        {/* Fayl yuklash */}
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ textTransform: "none", mt: 2 }}
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

        {/* Eski rasm yoki yangi preview */}
        {(form.image || initialData?.image) && (
          <div style={{ marginTop: "12px" }}>
            <img
              src={
                form.image
                  ? URL.createObjectURL(form.image)
                  : initialData?.image
              }
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: 200,
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            />
            {form.image && <p>📁 {form.image.name}</p>}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Bekor qilish</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Yangilash
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAccessory;
