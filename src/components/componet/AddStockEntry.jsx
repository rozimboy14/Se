import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  IconButton,
  Typography,
  Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getOrders } from "../api/axios";
import useDebounce from "../../hooks/useDebounce";

const AddStockEntry = ({ open, onClose, onAdd }) => {
  const [entries, setEntries] = useState([]);
  const [ordersOptions, setOrdersOptions] = useState([]);
  const[loadingFetch,setLoadingFetch]=useState(false)
  const [searchText, setSearchText] = useState("");
const debouncedBrandSearch = useDebounce(searchText, 500);




useEffect(() => {
  if (!open) return;

  const fetchData = async () => {
    setLoadingFetch(true);
    try {
      const params = debouncedBrandSearch?.trim()
        ? { search: debouncedBrandSearch, page_size: 20 }
        : { page_size: 20 };
      const res = await getOrders(params);
      setOrdersOptions(res.data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFetch(false);
    }
  };

  fetchData();

  if (entries.length === 0) {
    setEntries([{ id: uuidv4(), order: null, variants: [] }]);
  }
}, [debouncedBrandSearch, open]);


  const handleAddOrder = () => {
    setEntries([
      ...entries,
      { id: uuidv4(), order: null, variants: [] }
    ]);
  };

  const handleOrderChange = (index, value) => {
    const updated = [...entries];
    updated[index].order = value;
    updated[index].variants = []; // yangi order bo‘lsa, variantlarni reset
    setEntries(updated);
  };

  const handleAddVariant = (orderIndex) => {
    const updated = [...entries];
    updated[orderIndex].variants.push({
      id: uuidv4(),
      variant: null,
      quantity: ""
    });
    setEntries(updated);
  };

  const handleVariantChange = (orderIndex, variantIndex, key, value) => {
    const updated = [...entries];
    updated[orderIndex].variants[variantIndex][key] = value;
    setEntries(updated);
  };

  const handleRemoveVariant = (orderIndex, variantIndex) => {
    const updated = [...entries];
    updated[orderIndex].variants.splice(variantIndex, 1);
    setEntries(updated);
  };

  const handleRemoveOrder = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const payload = {
      orders: entries.map((entry) => ({
        order: entry.order?.id,
        variants: entry.variants.map((v) => ({
          variant: v.variant?.id,
          quantity: Number(v.quantity)
        }))
      }))
    };
    onAdd(payload); // endi DRF kutgan dict formatida
    setEntries([]);
    onClose();
  };
  const handleClose = () => {
    // 🔹 Faqat foydalanuvchi biror narsa tanlagan bo‘lsa ogohlantirish chiqsin
    const hasChanges = entries.some(
      (entry) => entry.order || entry.variants.length > 0
    );

    if (hasChanges) {
      const confirmClose = window.confirm("Formada o‘zgarishlar bor. Yopishni xohlaysizmi?");
      if (!confirmClose) return; // Bekor qilsa, modal yopilmaydi
    }

    // 🔹 Modal yopilganda formani reset qilish
    setEntries([{ id: uuidv4(), order: null, variants: [] }]);
    setOrdersOptions([]);
    onClose(); // prop orqali modalni yopish
  };

  const totalQuantity = entries
    .reduce(
      (sum, entry) =>
        sum +
        entry.variants.reduce(
          (s, v) => s + (Number(v.quantity) || 0),
          0
        ),
      0
    )
    .toLocaleString("ru-RU");

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Kirim{" "}
        <span style={{ fontSize: "14px", color: "gray" }}>
          (Jami: {totalQuantity})
        </span>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {entries.map((entry, orderIndex) => (
          <Box key={entry.id} sx={{ border: "1px solid #ddd", p: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Autocomplete
                options={ordersOptions}
                loading={loadingFetch}
                getOptionLabel={(option) =>
                  `${option.article_name || ""} - ${option.specification_name || ""}`
                }
                value={entry.order}
                onChange={(e, value) => handleOrderChange(orderIndex, value)}
                  onInputChange={(e, value) => {
    setSearchText(value);
  }}
                renderInput={(params) => (
                  <TextField {...params} label="Order" size="small" InputProps={{
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
                    }} />
                )}
                sx={{ flex: 1 }}
              />
              <IconButton color="error" onClick={() => handleRemoveOrder(orderIndex)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Variants */}
            {entry.variants.map((variantEntry, variantIndex) => (
              <Box
                key={variantEntry.id}
                sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0 }}
              >
                <Autocomplete
                  options={entry.order?.variant_link || []}
                  getOptionLabel={(option) => option.name || ""}
                  value={variantEntry.variant}
                  onChange={(e, value) =>
                    handleVariantChange(orderIndex, variantIndex, "variant", value)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Variant" size="small" InputProps={{
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
                      }} />
                  )}
                  sx={{ flex: 1 }}
                  disabled={!entry.order}
                />
                <TextField
                  label="Кол-во"
                  value={
                    variantEntry.quantity
                      ? Number(
                        variantEntry.quantity.replace(/\s/g, "")
                      ).toLocaleString("ru-RU")
                      : ""
                  }
                  onChange={(e) => {
                    const rawValue = e.target.value
                      .replace(/\s/g, "")
                      .replace(/\D/g, "");
                    handleVariantChange(orderIndex, variantIndex, "quantity", rawValue);
                  }}
                  variant="outlined"
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
                <IconButton
                  color="error"
                  onClick={() => handleRemoveVariant(orderIndex, variantIndex)}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}

            <Button
              variant="outlined"
              size="small"
              onClick={() => handleAddVariant(orderIndex)}
              sx={{ mt: 0.5, fontSize: "10px" }}
              disabled={!entry.order || (entry.order?.variant_link?.length === 0)}
            >
              Variant qo‘shish
            </Button>
          </Box>
        ))}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="success" onClick={handleAddOrder}>
          Order qo‘shish
        </Button>
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

export default AddStockEntry;
