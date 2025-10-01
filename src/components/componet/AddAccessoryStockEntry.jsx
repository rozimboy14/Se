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
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getAccessory } from "../api/axios";

const AddAccessoryStockEntry = ({ openAccessory, onCloseAccesory, onAddAccessory }) => {
  const [entries, setEntries] = useState([
    { id: uuidv4(), accessory: null, quantity: "" }
  ]);
  const [AccessoryOptions, setaccessoryOptions] = useState([]);

  const handleAddRow = () => {
    setEntries([
      ...entries,
      { id: uuidv4(), accessory: null, quantity: "" }
    ]);
  };
  const handleEntryChange = (index, key, value) => {
    const updated = [...entries];
    updated[index][key] = value;
    setEntries(updated);
  };
  const totalQuantity = entries
    .reduce((sum, entry) => sum + (Number(entry.quantity) || 0), 0)
    .toLocaleString("ru-RU");

  const handleRemoveRow = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (openAccessory) {
      const fetchData = async () => {
        try {
          const accessoryResponse = await getAccessory();
          setaccessoryOptions(accessoryResponse.data);
          console.log( accessoryResponse.data)
        } catch (error) {
          console.error("Ошибка при загрузке категорий:", error);
        }
      };
      fetchData();
    }
  }, [openAccessory]);

  const handleSubmit = () => {
    const payload = entries.map((entry) => ({
      accessory: entry.accessory?.id,
      quantity: entry.quantity ? Number(entry.quantity) : null, // ✅ number tip
    }));
    onAddAccessory(payload); // Bir marta, massiv yuboriladi
    setEntries([{ id: uuidv4(), accessory: null, quantity: "" }]);
    onCloseAccesory();
    console.log(payload);
  };

  const handleClose = () => {
    const hasChanges =
      entries.some(entry => entry.accessory !== null || entry.quantity.trim() !== "");

    if (hasChanges) {
      const confirmClose = window.confirm("Formadagi o‘zgarishlar saqlanmaydi. Chiqishni xohlaysizmi?");
      if (!confirmClose) return;
    }

    setEntries([{ id: uuidv4(), accessory: null, quantity: "" }]);
    onCloseAccesory();
  };

  return (
    <Dialog
      open={openAccessory}
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
        handleClose();
      }}
      PaperProps={{ style: { width: "900px", padding: "15px" } }}
      maxWidth={false}
      fullWidth={false}
    >
      <DialogTitle>Kirim  <span style={{ fontSize: "14px", color: "gray" }}>(Jami: {totalQuantity})</span></DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          overflow: "unset",
          padding: 0,
          width: "100%",
        }}
      >
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <Autocomplete
              options={AccessoryOptions}
             getOptionLabel={(option) => {
                const art = option.name || "";
                const spec = option.brand_name || "";
                const com = option.comment || "";
                return `${art} -${com}- ${spec}`.trim();
              }}
              value={entry.accessory}
              onChange={(e, value) =>
                handleEntryChange(index, "accessory", value)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Аксессуарь"
           InputProps={{
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
                    }} 
                />
              )}
              sx={{ width: "70%", padding: "3px" }}
            />

            <TextField
              fullWidth

              label="Кол-во"
              value={
                entry.quantity
                  ? Number(entry.quantity.replace(/\s/g, "")).toLocaleString("ru-RU")
                  : ""
              }
              onChange={(e) => {
                // faqat raqamlarni olish
                const rawValue = e.target.value.replace(/\s/g, "").replace(/\D/g, "");
                handleEntryChange(index, "quantity", rawValue);
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

            {entries.length > 1 && (
              <IconButton
                color="error"
                onClick={() => handleRemoveRow(index)}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            )}
          </div>
        ))}
      </DialogContent>

      <DialogActions sx={{ mt: 2 }}>
        <Button variant="outlined" color="success" onClick={handleAddRow}>
          Добавит
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

export default AddAccessoryStockEntry;
