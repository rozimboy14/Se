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
import { getLine } from "../api/axios";


const AddLineNorm  = ({ open, onClose, onAdd,reportId,usedLines,warehouse  }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null); 
  const [line, setLine] = useState([]); 
const [form, setForm] = useState({
  production_report: null,
  line: [],
});



  const handleSubmit = () => {

onAdd({
  production_report: reportId,
  line: form.line ? form.line.map(l => l.id) : [],
});
setForm({
  production_report: null,
  line: [],
});
    onClose();


  };

useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const lineResponse = await getLine(warehouse);

          // 🔹 Faqat qo‘shilmagan liniyalarni chiqaramiz
          const filtered = lineResponse.data.filter(
            (l) => !usedLines.includes(l.id)
          );

          setLine(filtered);
        } catch (error) {
        }
      };

      fetchData();
    }
  }, [open, usedLines]);

    const handleClose = () => {
    setName("");    // inputni tozalash
     setImage(null);
     setForm({
  production_report: null,
  line: [],
});
    onClose();      // modalni yopish
  };

 return (
    <Dialog open={open} onClose={onClose}  PaperProps={{
    style: {
      width: 400, // yoki '400px'
      maxWidth: '100%',
      padding:"15px"
    },
  }}>
<DialogTitle sx={{padding:"15px",marginBottom:"10px"}}>
  Добавить линию
</DialogTitle>
      <DialogContent sx={{overflow:"unset",padding:0}}>
       
      <Autocomplete
  multiple
  options={line}
getOptionLabel={(option) => option?.full_name ?? ""}
  value={form.line || []}   // 🔹 line array sifatida saqlanadi
  onChange={(e, value) => setForm({ ...form, line: value })}
  filterSelectedOptions   // 🔹 tanlangan item optionsdan yo‘qoladi
  renderInput={(params) => (
    <TextField {...params} label="Линия" sx={{ mb: 2 }} />
  )}
/>
      </DialogContent>
      <DialogActions sx={{marginTop:"10px"}}>
        <Button variant="outlined" color="error" onClick={handleClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained">Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};



export default AddLineNorm
