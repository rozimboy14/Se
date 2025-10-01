import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import { getWarehouse } from "../api/axios";


const AddTotalEntry = ({ open, onClose, onAdd }) => {

  const [warehouseOptions, setWarehouseOptions] = useState([]);

  const [form, setForm] = useState({
    name: "",
    warehouse: null,

  });




  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const warehouseResponse = await getWarehouse();
          setWarehouseOptions(warehouseResponse.data);

        } catch (error) {
          console.error("Ошибка при загрузке категорий:", error);
        }
      };

      fetchData();
    }
  }, [open]);

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };


  const handleSubmit = () => {
    onAdd({
      name: form.name.trim(),
      warehouse: form.warehouse?.id,
    });

    setForm({
      name: "",
      warehouse: null,

    });
    onClose();
  };



  const handleClose = () => {
   setForm({
      name: "",
      warehouse: null,

    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{
      style: {
        width: 400, // yoki '400px'
        maxWidth: '100%',
        padding: "15px"
      },
    }}>
      <DialogTitle sx={{ padding: "15px", marginBottom: "10px" }}>Добавить бренд</DialogTitle>
      <DialogContent sx={{ overflow: "unset", padding: 0 }}>
         <Autocomplete
                  options={warehouseOptions}
                  getOptionLabel={(option) => option.name || ""}
                  value={form.warehouse}
                  onChange={(e, value) => setForm({ ...form, warehouse: value })}
                  renderInput={(params) => (
                    <TextField {...params} label="Filial"   InputProps={{
                      ...params.InputProps,
                      sx: {
                        height: 35,
                        fontSize: 13
                      }
                    }}
                      sx={{
                        "& .MuiInputLabel-root": {
                          fontSize: "12px",
                          top: "-5px",
                   
                        },
                              mb: 2 
                      }}/>
                  )}
                />
        <TextField
          autoFocus
          fullWidth
          label="Izox"
          value={form.name}
                    onChange={handleChange("name")}
          variant="outlined"
          InputProps={{
            style: {
              height: 40,
              padding: '0 10px',
              fontSize: '14px',
            },

          }}
          sx={{
            '& .MuiOutlinedInput-input': {
              padding: 0, // padding yo‘q
              height: "100%"
            },
          }}
        />

      </DialogContent>
      <DialogActions sx={{ marginTop: "10px" }}>
        <Button variant="outlined" color="error" onClick={handleClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained">Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};



export default AddTotalEntry 
