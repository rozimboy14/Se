import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ButtonGroup } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


function DeleteModal({ open, onClose, title, text, onConfirm }) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

   return (
    <Modal
      keepMounted
      open={open}
      onClose={onClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Box sx={style}>
        <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
          {text}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
          <Button variant="outlined" color="error" onClick={onConfirm}>
            Удалить
          </Button>
          <Button variant="outlined" color="success" onClick={onClose}>
            Отмена
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default DeleteModal
