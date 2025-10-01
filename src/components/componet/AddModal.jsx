import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";


const AddModal  = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState("");




  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name.trim());
      setName("");
      onClose();
    }
  };


console.log(`onAdd`, onAdd);

    const handleClose = () => {
    setName("");   
    onClose();     
  };

 return (
    <Dialog open={open} onClose={onClose}  PaperProps={{
    style: {
      width: 400, // yoki '400px'
      maxWidth: '100%',
      padding:"15px"
    },
  }}>
      <DialogTitle sx={{padding:"15px",marginBottom:"10px"}}>Добавить бренд</DialogTitle>
      <DialogContent sx={{overflow:"unset",padding:0}}>
        <TextField
          autoFocus
          fullWidth
          label="Название бренда"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
      height:"100%"
    },
    "& .MuiInputLabel-root": {
                  fontSize: "14px",   // Label shrift
                  top: "-7px"    // Label rangi
                },
  }}
        />

      </DialogContent>
      <DialogActions sx={{marginTop:"10px"}}>
        <Button variant="outlined" color="error" onClick={handleClose} sx={{fontSize:"12px"}}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{fontSize:"12px"}}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};



export default AddModal 
