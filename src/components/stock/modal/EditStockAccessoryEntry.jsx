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
import { v4 as uuidv4 } from "uuid";
import { getAccessory } from "../../api/axios";
import useDebounce from "../../../hooks/useDebounce";


const EditStockAccessoryEntry = ({ open, onClose, onEdit, initialData }) => {
  const [entries, setEntries] = useState([]);
  const [accessoryOptions, setAccessoryOptions] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);

  // =====================
  // Initial accessory fetch
  // =====================
  useEffect(() => {
    if (!initialData?.accessory) return;

    const fetchInitialAccessory = async () => {
      try {
        const res = await getAccessory({ id: initialData.accessory });
        const accessory = res.data.results[0];
        if (accessory) {
          setAccessoryOptions([accessory]);
          setEntries([
            {
              id: uuidv4(),
              accessory: accessory,
              quantity: initialData.quantity || ""
            }
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchInitialAccessory();
  }, [initialData]);

  // =====================
  // Live search
  // =====================
  useEffect(() => {
    if (!debouncedSearch?.trim()) return;
    setLoadingFetch(true);

    const fetchAccessories = async () => {
      try {
        const res = await getAccessory({ search: debouncedSearch, page_size: 20 });
        setAccessoryOptions(prev => {
          const selected = entries[0]?.accessory;
          const merged = selected
            ? [selected, ...res.data.results.filter(a => a.id !== selected.id)]
            : res.data.results;
          return merged;
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingFetch(false);
      }
    };

    fetchAccessories();
  }, [debouncedSearch]);

  // =====================
  // Handlers
  // =====================
  const handleAccessoryChange = (index, value) => {
    const updated = [...entries];
    updated[index].accessory = value;
    setEntries(updated);
  };

  const handleQuantityChange = (index, value) => {
    const updated = [...entries];
    updated[index].quantity = value;
    setEntries(updated);
  };

  const handleSubmit = () => {
    if (!entries.length) return;
    const entry = entries[0];
    onEdit({
      id: initialData?.id,
      accessory: entry.accessory?.id || null,
      quantity: entry.quantity ? Number(entry.quantity) : null
    });
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
      <DialogTitle>Редактировать аксессуар</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {entries.map((entry, index) => (
          <Box key={entry.id} sx={{ border: "1px solid #ddd", p: 2, borderRadius: 2, display: "flex", gap: 1, alignItems: "center" }}>
            <Autocomplete
              options={accessoryOptions}
              value={entry.accessory || null}
              onChange={(e, value) => handleAccessoryChange(index, value)}
              getOptionLabel={(option) => {
                const art = option.name || "";
                const brand = option.brand_name || "";
                const comment = option.comment || "";
                return `${art} -${comment}- ${brand}`.trim();
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onInputChange={(e, value) => setSearchText(value)}
              loading={loadingFetch}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Аксессуар"
                  size="small"
                  InputProps={{ ...params.InputProps, sx: { height: 35, fontSize: 13 } }}
                  sx={{ "& .MuiInputLabel-root": { fontSize: "12px", top: "-7px" } }}
                />
              )}
              sx={{ flex: 1 }}
            />

            <TextField
              label="Кол-во"
              value={entry.quantity ? Number(entry.quantity).toLocaleString("ru-RU") : ""}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "");
                handleQuantityChange(index, rawValue);
              }}
              size="small"
              InputProps={{ sx: { height: 35, fontSize: 13 } }}
              sx={{ width: "150px" }}
            />

            <IconButton color="error" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
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

export default EditStockAccessoryEntry;
