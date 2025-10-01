import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import CancelIcon from '@mui/icons-material/Cancel';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Autocomplete,
} from "@mui/material";
import { getMonthPlaningOptions, getOrders, getWarehouse } from "../api/axios";

const AddMonthPlaningOrder = ({ open, onClose, onAdd, }) => {

  const [entries, setEntries] = useState([]);
    const [optionsOrder, setOptionsOrder] = useState([])
    const [form, setForm] = useState({

        order: "",
        planed_quantity: "",
        comment: ""
    });

  const handleAddOrder = () => {
    setEntries([
      ...entries,
      { id: uuidv4(), order: null, planed_quantity: "",comment:"" }
    ]);
  };

  const handleRemoveOrder = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };



    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                try {
                    const optionsResponse = await getOrders();
                    setOptionsOrder(optionsResponse.data);

                } catch (error) {
                    console.error("Ошибка при загрузке брендов:", error);
                }
            };
            fetchData();
                 if (entries.length === 0) {
                    setEntries([{ id: uuidv4(), order: null, variants: [] }]);
                  }
        }
    }, [open]);

    const resetForm = () => {
        setForm({

            order: "",
            planed_quantity: "",
            comment: ""
        });
    };


  const handleChangeEntry = (index, key, value) => {
    const updated = [...entries];
    updated[index][key] = value;
    setEntries(updated);
  };

const handleSubmit = () => {
  const data = entries.map(entry => ({
    order: entry.order?.id, // yoki kerakli field
    planed_quantity: entry.planed_quantity,
    comment: entry.comment
  }));
console.log(data);

  onAdd(data);
  setEntries([]);
  onClose();
};


      const handleClose = () => {
    const hasChanges = entries.some((entry) => entry.order);

    if (hasChanges) {
      const confirmClose = window.confirm("Formada o‘zgarishlar bor. Yopishni xohlaysizmi?");
      if (!confirmClose) return;
    }

    setEntries([{ id: uuidv4(), order: null, planed_quantity: "", comment: "" }]);
    setOptionsOrder([]);
    onClose();
  };


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                style: { width: 1000, maxWidth: "100%", padding: "15px" },
            }}
        >
            <DialogTitle sx={{ padding: "15px", marginBottom: "10px" }}>
                Model
            </DialogTitle>

            <DialogContent sx={{ overflow: "unset", padding: 0, }}>
                  {entries.map((entry, index) => (
                <div style={{display: "flex", gap: "10px", alignItems: "end",  }}>

       
                {/* Sana */}
                <Autocomplete
                    options={optionsOrder}
                    getOptionLabel={(option) => option.full_name || ""}

                    value={entry.order}
                    onChange={(e, value) => handleChangeEntry(index, "order", value)}
                    renderInput={(params) => (
                        <TextField {...params} label="Модель" variant="standard" InputProps={{
                            ...params.InputProps,
                            sx: {
                                height: 30,        // 🔹 balandlik
                                fontSize: 12       // 🔹 shrift
                            }

                        }}
                            sx={{
                                "& .MuiInputLabel-root": {
                                    fontSize: "12px",   // Label shrift
                                    top: "-9px"    // Label rangi
                                },
                                "& .MuiInputBase-input": {
                                    fontSize: "13px",   // Input shrift
                                    height: "30px",     // Balandlik
                                }
                            }} />
                    )}
                    sx={{ width: "55%" }}
                />
                <TextField

                    label="Reja"
                    type="number"

                    value={entry.planed_quantity}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {   // faqat raqam
                             handleChangeEntry(index, "planed_quantity", val);
                        }
                    }}
                    InputLabelProps={{ shrink: true }}
                    variant="standard"
                    inputProps={{
                        // ✅ faqat musbat son
                        pattern: "\\d*",
                        inputMode: "numeric",

                    }}
                    InputProps={{
                        style: {



                            height: 30,              // 🔹 balandlik
                            fontSize: 12
                        },

                    }}
                // sx={{
                //     "& .MuiOutlinedInput-input": { padding: 0, height: "100%" },
                //     "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
                //         WebkitAppearance: "none",
                //         margin: 0,
                //     },
                //     "& input[type=number]": {
                //         MozAppearance: "textfield", // Firefox uchun
                //     },

                //     width: "10%"
                // }}
                />
                <TextField
                    fullWidth
                    label="Izox"
                         value={entry.comment}

                     onChange={(e) => handleChangeEntry(index, "comment", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    variant="standard"
                    InputProps={{
                        style: { height: 30, padding: "0 10px", fontSize: "12px" },
                    }}
                    sx={{
                        "& .MuiOutlinedInput-input": { padding: 0, height: "100%" },
                        width: "35%"
                    }}                   
                />
      {entries.length > 1 && (
              <Button
                color="error"
                onClick={() => handleRemoveOrder(index)}
                sx={{ padding: "0", lineHeight: "25px", minWidth: "30px" }}
              >
                <CancelIcon sx={{ fontSize: "18px" }} />
              </Button>
            )}
                         </div>
                           ))}
            </DialogContent>

            <DialogActions sx={{ marginTop: "10px" }}>
                      <Button variant="outlined"color="black" onClick={handleAddOrder}sx={{ fontSize: "10px",fontWeight:"600" }}>
                          Model qo‘shish
                        </Button>
                <Button variant="outlined" color="error" onClick={handleClose} sx={{ fontSize: "10px" }}>
                    Отмена
                </Button>
                <Button onClick={handleSubmit} variant="contained" sx={{ fontSize: "10px" }}>
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddMonthPlaningOrder;
