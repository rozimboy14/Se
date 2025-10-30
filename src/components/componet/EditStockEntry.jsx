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
import useDebounce from "../../hooks/useDebounce";

const EditStockEntry = ({ open, onClose, onEdit, initialData }) => {
  const [entries, setEntries] = useState([]);
  const [orderOptions, setOrderOptions] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const debouncedSearch = useDebounce("", 500);

  // =====================
  // Fetch Orders
  // =====================
  useEffect(() => {
    if (!open) return;
    const fetchOrders = async () => {
      setLoadingFetch(true);
      try {
        const res = await getOrders({ page_size: 600 });
        setOrderOptions(res.data.results || []);
      } catch (err) {
        console.error("Ошибка при загрузке заказов:", err);
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchOrders();
  }, [open]);

  // =====================
  // Initialize form with initialData
  // =====================
useEffect(() => {
  if (!initialData || orderOptions.length === 0) return;

  const selectedOrder = orderOptions.find((o) => o.id === initialData.order) || null;
const variants = (initialData.variants || []).map(v => ({
  uuid: uuidv4(),       // frontend key
  id: v.id,             // backend id
  variant: selectedOrder?.variant_link?.find(link => link.id === v.variant) || null,
  quantity: v.quantity
}));

  setEntries([
    {
      id: uuidv4(),
      order: selectedOrder,
      variants
    }
  ]);
}, [initialData, orderOptions]);

  // =====================
  // Handlers
  // =====================
const handleOrderChange = (index, value) => {
  setEntries(prev =>
    prev.map((entry, i) => {
      if (i !== index) return entry;
      const updatedVariants = entry.variants.map(v => ({
        ...v,
        variant: value?.variant_link?.find(vi => String(vi.id) === String(v.variant?.id)) || null
      }));
      return { ...entry, order: value, variants: updatedVariants };
    })
  );
};

  const handleAddVariant = (orderIndex) => {
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === orderIndex
          ? {
              ...entry,
              variants: [...entry.variants, { id: uuidv4(), variant: null, quantity: "" }]
            }
          : entry
      )
    );
  };

  const handleRemoveVariant = (orderIndex, variantIndex) => {
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === orderIndex
          ? { ...entry, variants: entry.variants.filter((_, vi) => vi !== variantIndex) }
          : entry
      )
    );
  };

const handleVariantChange = (orderIndex, variantIndex, newVariant) => {
  setEntries(prev =>
    prev.map((entry, i) => {
      if (i !== orderIndex) return entry;
      const updatedVariants = entry.variants.map((v, vi) =>
        vi === variantIndex
          ? { ...v, variant: newVariant || null, variant_id: newVariant?.id || null }
          : v
      );
      return { ...entry, variants: updatedVariants };
    })
    
  );
    console.log("New variant set:", newVariant);
};

const handleQuantityChange = (orderIndex, variantIndex, quantity) => {
  setEntries(prev =>
    prev.map((entry, i) => {
      if (i !== orderIndex) return entry;
      const updatedVariants = entry.variants.map((v, vi) =>
        vi === variantIndex
          ? { ...v, quantity }
          : v
      );
      return { ...entry, variants: updatedVariants };
    })
  );
};


const handleSubmit = () => {
  if (!entries.length) return;
  const entry = entries[0];

  const payload = {
    order: entry.order?.id,
    variants: entry.variants.map(v => ({
      id: v.id,                    // mavjud bo‘lsa, yangilanadi
      variant: v.variant?.id,      // id yuboramiz
      quantity: Number(v.quantity)
    }))
  };

  console.log("Payload sending to server:", payload);
  onEdit(payload);
  handleClose();
};

  const handleClose = () => {
    setEntries([]);
    onClose();
  };

  // =====================
  // Render
  // =====================
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Редактировать артикул</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {entries.map((entry, orderIndex) => (
          <Box key={entry.id} sx={{ border: "1px solid #ddd", p: 2, borderRadius: 2 }}>
            <Autocomplete
              options={orderOptions}
              value={entry.order}
              onChange={(e, value) => handleOrderChange(orderIndex, value)}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              getOptionLabel={(option) => option.full_name || ""}
              loading={loadingFetch}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Order"
                  size="small"
                  InputProps={{ ...params.InputProps, sx: { height: 35, fontSize: 13 } }}
                  sx={{ "& .MuiInputLabel-root": { fontSize: "12px", top: "0px" } }}
                />
              )}
              sx={{ mb: 1 }}
            />

            {entry.variants.map((variantEntry, variantIndex) => (
              <Box
                key={variantEntry.id}
                sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}
              >
                <Autocomplete
                isOptionEqualToValue={(option, value) => option.id === value?.id}

                  options={entry.order?.variant_link || []}
                  value={variantEntry.variant
                    ? entry.order?.variant_link.find(v => v.id === variantEntry.variant.id) || null
                    : null}
              onChange={(e, value) => handleVariantChange(orderIndex, variantIndex, value)}



                  getOptionLabel={(option) => option.name || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Variant"
                      size="small"
                      InputProps={{ ...params.InputProps, sx: { height: 35, fontSize: 13 } }}
                      sx={{ "& .MuiInputLabel-root": { fontSize: "12px", top: "0px" } }}
                    />
                  )}
                  sx={{ flex: 1 }}
                  disabled={!entry.order}
                />

                <TextField
                  label="Кол-во"
                  value={variantEntry.quantity}
                  onChange={(e) => handleQuantityChange(orderIndex, variantIndex, e.target.value)}
                  size="small"
                  InputProps={{ sx: { height: 35, fontSize: 13 } }}
                  sx={{ width: "20%" }}
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
        <Button variant="outlined" color="error" onClick={handleClose}>
          Отмена
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStockEntry;
