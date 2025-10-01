import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";


const AddBrand  = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null); 

      console.log(onAdd);
const handleSubmit = () => {
  if (name.trim()) {
    const formData = new FormData();
    formData.append("name", name.trim());
    
    if (image) {   // faqat image bo‘lsa qo‘shamiz
      formData.append("image", image);
    }

    onAdd(formData); 
    setName("");
    setImage(null);
    onClose();
  }
};




    const handleClose = () => {
    setName("");    // inputni tozalash
     setImage(null);
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
    "& .MuiInputLabel-root": {
                  fontSize: "12px",   // Label shrift
                  top: "-7px"    // Label rangi
                },
    '& .MuiOutlinedInput-input': {
      padding: 0, // padding yo‘q
      height:"100%",

    },
    mb:1
  }}
        />
        <Button variant="outlined" component="label" fullWidth sx={{fontSize:"12px"}}>
          {image ? image.name : "Выберите изображение"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Button>
      </DialogContent>
      <DialogActions sx={{marginTop:"10px"}}>
        <Button variant="outlined" color="error" onClick={handleClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained">Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};



export default AddBrand
