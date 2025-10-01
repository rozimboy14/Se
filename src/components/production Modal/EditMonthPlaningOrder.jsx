import React, { useState, useEffect } from "react";
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

const EditMonthPlaningOrder = ({ open, onClose, onUpdate, initialData, }) => {


    const [optionsOrder, setOptionsOrder] = useState([])
    const [form, setForm] = useState({

        order: null,
        planed_quantity: "",
        comment: ""
    });


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
        }
    }, [open]);
    useEffect(() => {
        if (open && initialData) {
            setForm({
                order: initialData.order?.id || initialData.order_detail.id,
                comment: initialData.comment || "",
                planed_quantity: initialData.planed_quantity,
            });
        }
    }, [initialData, open]);
    console.log(initialData);
    console.log(form);


    useEffect(() => {
        if (form.order && typeof form.order === "number" && optionsOrder.length > 0) {
            const orderObj = optionsOrder.find(o => o.id === form.order) || null;
            setForm(prev => ({ ...prev, order: orderObj }));
        }
    }, [optionsOrder]);
    const resetForm = () => {
        setForm({

            order: null,
            planed_quantity: "",
            comment: ""
        });
    };

    const handleChange = (key) => (e) => {
        setForm({ ...form, [key]: e.target.value });
    };

    const handleSubmit = async () => {
        const data = new FormData();
if (form.order) data.append("order", form.order.id || form.order);

        if (form.planed_quantity) data.append("planed_quantity", form.planed_quantity);
        if (form.comment.trim()) data.append("comment", form.comment.trim());


        onUpdate(data); // parent komponentda API chaqiriladi
        resetForm();
        onClose();
        console.log(`onAdd`, data);
    };

    const handleClose = () => {
        resetForm();
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
            <DialogContent sx={{ overflow: "unset", padding: 0, display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>
                {/* Sana */}
                <Autocomplete
                    options={optionsOrder}
                    getOptionLabel={(option) => option.full_name || ""}

                    value={form.order}
                    onChange={(e, value) => setForm({ ...form, order: value })}
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

                    value={form.planed_quantity}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {   // faqat raqam
                            setForm({ ...form, planed_quantity: val });
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
                    value={form.comment}

                    onChange={handleChange("comment")}
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
            </DialogContent>

            <DialogActions sx={{ marginTop: "10px" }}>
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

export default EditMonthPlaningOrder;
