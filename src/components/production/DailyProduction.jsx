import { Box, Button } from "@mui/material";
import { ButtonGroup, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { styled, useTheme } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { deleteDaily, getDaily, patchDaily, postDaily } from "../api/axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatNumber } from "../utils/formatNumber";
import DailyModal from "../production Modal/DailyModal";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DeleteModal from "../componet/DeleteModal";

import PreviewIcon from '@mui/icons-material/Preview';
// --- Styled Accordion ---
const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': { borderBottom: 0 },
    '&::before': { display: 'none' },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor: 'rgba(0, 0, 0, .10)',
    flexDirection: 'row-reverse',
    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
        transform: 'rotate(90deg)',
    },
    [`& .${accordionSummaryClasses.content}`]: {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: '#fafafa',
}));





function DailyProduction({ onPreview, dailyReport }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [errorMessage, setErrorMessage] = useState([])
    const [selectedItem, setSelectedItem] = useState(null);


    const handlePreview = (item) => {
        setSelectedItem(item.id);
        if (onPreview) onPreview(item.id);
    };

    return (
        <Box sx={{ flex: 1, position: "relative" }}>
            {errorMessage.map((msg, i) => (
                <Snackbar
                    key={i}
                    open={true}
                    autoHideDuration={null} // ⬅️ avtomatik yopilmaydi
                    onClose={() =>
                        setErrorMessage(prev => prev.filter((_, idx) => idx !== i))
                    }
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    sx={{
                        zIndex: 1400,
                        mt: `${i * 8}vh` // har bir Snackbar biroz pastga siljiydi
                    }}
                >
                    <Alert
                        severity="error"
                        sx={{ width: '100%' }}
                        action={
                            <Button color="inherit" size="small" onClick={() =>
                                setErrorMessage(prev => prev.filter((_, idx) => idx !== i))

                            } variant="outlined" sx={{ padding: "0", maxWidth: "15px" }}>
                                X
                            </Button>
                        }
                    >
                        {msg}
                    </Alert>
                </Snackbar>
            ))}

            <h3 style={{ textAlign: "center", marginBottom: "8px", margin: "0" }}> Kunlik bajarilgan ishlar</h3>
            {/* <Button size="small" sx={{ fontSize: "10px", }} onClick={() => setAddModalOpen(true)}>
                Yangi kun
            </Button> */}


            <TableContainer component={Paper} sx={{ maxHeight: 740, backgroundColor: isDark ? "#0e1c26" : "white", }} >
                <Table stickyHeader>
                    <TableHead sx={{ backgroundColor: isDark ? "#0e1c26" : "white", }}>
                        <TableRow >
                            <TableCell sx={{ width: 60, fontSize: "12px", padding: "5px 10px" }}>№</TableCell>
                            <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>День</TableCell>
                            <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>высший сорт </TableCell>
                            <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>2-сорт </TableCell>
                            <TableCell sx={{ textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>Брак</TableCell>
                            <TableCell sx={{ width: 120, textAlign: "center", fontSize: "12px", padding: "5px 10px" }}>--</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dailyReport?.map((item, idx) => (
                            <TableRow key={`${item.id}-${idx}`} sx={{
                                backgroundColor: item.is_weekend ? "#f89b29" : "", ":hover": {
                                    backgroundColor: isDark ? "#557c93" : "#c3e1fc",
                                }
                            }}>
                                <TableCell sx={{ padding: "2px 10px", fontSize: "12px" }}>{idx + 1}</TableCell>
                                <TableCell sx={{ textAlign: "center", padding: 0, fontSize: "12px" }}>{item.date}</TableCell>
                                <TableCell sx={{ textAlign: "center", padding: 0, fontSize: "12px" }}>{formatNumber(item.sort_1)}</TableCell>
                                <TableCell sx={{ textAlign: "center", padding: 0, fontSize: "12px" }}>{formatNumber(item.sort_2)}</TableCell>
                                <TableCell sx={{ textAlign: "center", padding: 0, fontSize: "12px" }}>{formatNumber(item.defect_quantity)}</TableCell>
                                <TableCell sx={{ textAlign: "center", padding: 0, fontSize: "12px" }}>

                                    <IconButton onClick={() => handlePreview(item)}>
                                        <PreviewIcon sx={{ fontSize: "18px" }} />
                                    </IconButton>
                                    {/* <IconButton sx={{ color: "red" }}  onClick={() => handleDelete(item)}>
                                            <DeleteForeverIcon sx={{fontSize:"17px"}}  />
                                        </IconButton> */}

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* {selectedItem && (
              <DeleteModal
                open={deleteModalOpen}
                onClose={() => { setDeleteModalOpen(false); setSelectedItem(null); }}
                title="Удалить?"
                text={`Вы уверены, что хотите удалить  "${selectedItem.date}" ?`}
                onConfirm={ confirmDelete}
              />
            )} */}


        </Box>
    )
}

export default DailyProduction
