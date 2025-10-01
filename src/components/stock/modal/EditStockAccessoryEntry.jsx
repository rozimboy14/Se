import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete
} from "@mui/material";

import { getAccessory } from "../../api/axios";
import { interpolate } from "framer-motion";

const EditStockAccessoryEntry = ({ open, onClose, onEdit, initialData }) => {
  const [form, setForm] = useState({
    accessory: null,
    quantity: ""
  });
console.log(form);

  const [accessoryOptions, setAccessoryOrderOptions] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const accessoryRes = await getAccessory();
          setAccessoryOrderOptions(accessoryRes.data);
        } catch (error) {
          console.error("Ошибка при загрузке заказов:", error);
        }
      };
      fetchData();
    }
  }, [open]);

  // Fill form with initial data
useEffect(() => {
  if (initialData && accessoryOptions.length > 0) {
    const matchedAccessory = accessoryOptions.find(
      (b) => b.id === initialData.accessory?.id
    ) || null;
    console.log(initialData);
    
console.log(matchedAccessory);

    setForm({
      accessory: matchedAccessory,
      quantity: String(initialData.quantity || "")
    });
  }
}, [initialData, accessoryOptions]);

console.log(initialData);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
const handleSubmit = () => {
  onEdit({
    id: initialData.id,
    accessory: form.accessory ? form.accessory.id : null,
    quantity: form.quantity ? Number(form.quantity.replace(/\s/g, "")) : null
  });
  handleClose();
};

  const handleClose = () => {
    setForm({ accessory: null, quantity: "" });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ style: { width: "900px", padding: "15px" } }}
      maxWidth={false}
      fullWidth={false}
    >
      <DialogTitle>Редактировать артикул</DialogTitle>
      <DialogContent sx={{display:"flex",     alignItems: "center",gap:"6px", overflow: "unset", padding: 0 }}>
        <Autocomplete
          options={accessoryOptions}
            getOptionLabel={(option) => {
                const art = option.name || "";
                const spec = option.brand_name || "";
                const com = option.comment || "";
                return `${art} -${com}- ${spec}`.trim();
              }}
        value={form.accessory || null}
          onChange={(e, value) => handleChange("accessory", value)}
          renderInput={(params) => (
            <TextField {...params} label="Аксессуарь"    InputProps={{
                    ...params.InputProps,
                    sx: {
                      height: 35,
                      fontSize: 13
                    }
                  }}
                    sx={{
                      "& .MuiInputLabel-root": {
                        fontSize: "12px",
                        top: "-7px"
                      },
                    }} />
          )}
                        sx={{ width: "70%", padding: "3px" }}
        />
        <TextField
          fullWidth
          label="Кол-во"
         value={
  form.quantity
    ? Number(form.quantity.replace(/\s/g, "")).toLocaleString("ru-RU")
    : ""
}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/\s/g, "").replace(/\D/g, "");
            handleChange("quantity", rawValue);
          }}
          variant="outlined"
     InputProps={{
                    sx: {
                      height: 35,              // 🔹 balandlik
                      fontSize: 13             // 🔹 shrift
                    }
                  }}
                  sx={{
                    mt: 1, mb: 1, width: "20%",
                    "& .MuiInputLabel-root": {
                      fontSize: "13px",   // Label shrift
                      top: "-7px"    // Label rangi
                    },
                  }}
        />
      </DialogContent>
      <DialogActions sx={{ mt: 2 }}>
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

export default EditStockAccessoryEntry;
