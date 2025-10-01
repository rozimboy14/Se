import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  IconButton,
  Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getOrders } from "../api/axios";
import { v4 as uuidv4 } from "uuid";

const EditStockEntry = ({ open, onClose, onEdit, initialData }) => {
  const [entries, setEntries] = useState([]);
  const [orderOptions, setOrderOptions] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const orderRes = await getOrders();
          setOrderOptions(orderRes.data);
          console.log(`orderRes.data`, orderRes.data);
        } catch (error) {
          console.error("Ошибка при загрузке заказов:", error);
        }
      };
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (initialData && orderOptions.length > 0) {
      setEntries([
        {
          id: uuidv4(),
          order: orderOptions.find(o => o.id === initialData.order) || null,
          variants: initialData.variants.map(v => ({
            id: uuidv4(),
            variant: { id: v.variant, name: v.variant_name },
            quantity: v.quantity
          }))
        }
      ]);
    }
  }, [initialData, orderOptions]);

  const handleOrderChange = (index, value) => {
    const updated = [...entries];
    updated[index].order = value;
    updated[index].variants = []; // yangi order bo‘lsa variantlarni reset qilamiz
    setEntries(updated);
  };

  const handleVariantChange = (orderIndex, variantIndex, key, value) => {
    const updated = [...entries];
    updated[orderIndex].variants[variantIndex][key] = value;
    setEntries(updated);
  };

  const handleAddVariant = (orderIndex) => {
    const updated = [...entries];
    updated[orderIndex].variants.push({ id: uuidv4(), variant: null, quantity: "" });
    setEntries(updated);
  };

  const handleRemoveVariant = (orderIndex, variantIndex) => {
    const updated = [...entries];
    updated[orderIndex].variants.splice(variantIndex, 1);
    setEntries(updated);
  };

  const handleSubmit = () => {
    if (!entries.length) return;
    const entry = entries[0]; // faqat bitta edit qilinadi
    const payload = {
      order: entry.order?.id,
      variants: entry.variants.map(v => ({
        variant: v.variant?.id || v.variant,
        quantity: Number(v.quantity)
      }))
    };
    onEdit(payload);
    handleClose();
  };

  const handleClose = () => {
    setEntries([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Редактировать артикул</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {entries.map((entry, orderIndex) => (
          <Box key={entry.id} sx={{ border: "1px solid #ddd", p: 2, borderRadius: 2 }}>
            <Autocomplete
              options={orderOptions}
              getOptionLabel={option => option.full_name}
              value={entry.order}
              onChange={(e, value) => handleOrderChange(orderIndex, value)}
              renderInput={(params) => <TextField {...params} label="Order" size="small" InputProps={{
                  ...params.InputProps,
                  sx: {
                    height: 35,     
                    fontSize: 13,   
                    marginBottom:"0px"
                  }
                }}
                  sx={{
                    "& .MuiInputLabel-root": {
                      fontSize: "12px",   
                      top: "-0px"   
                    },
                  }}/>}
              sx={{ mb: 0.5 }}
            />

            {entry.variants.map((variantEntry, variantIndex) => (
              <Box key={variantEntry.id} sx={{ display: "flex", gap: 1, alignItems: "center", mb: 0 }}>
                <Autocomplete
                  options={entry.order?.variant_link || []}
                  getOptionLabel={(option) => option.name || ""}
                  value={variantEntry.variant}
                  onChange={(e, value) =>
                    handleVariantChange(orderIndex, variantIndex, "variant", value)
                  }
                  renderInput={(params) => <TextField {...params} label="Variant" size="small" InputProps={{
                  ...params.InputProps,
                  sx: {
                    height: 35,     
                    fontSize: 13   
                  }
                }}
                  sx={{
                    "& .MuiInputLabel-root": {
                      fontSize: "12px",   
                      top: "-0px"   
                    },
                  }} />}
                  sx={{ flex: 1 }}
                  disabled={!entry.order}
                />
                <TextField
                  label="Кол-во"
                  value={variantEntry.quantity}
                  onChange={(e) => handleVariantChange(orderIndex, variantIndex, "quantity", e.target.value)}
                  size="small"
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
                      top: "0px"    // Label rangi
                    },
                  }}
                />
                <IconButton color="error" onClick={() => handleRemoveVariant(orderIndex, variantIndex)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}

            <Button
              size="small"
              onClick={() => handleAddVariant(orderIndex)}
              disabled={!entry.order || entry.order?.variant_link?.length === 0}
            >
              Add Variant
            </Button>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={handleClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSubmit}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStockEntry;
