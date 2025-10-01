import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  IconButton,
  Autocomplete,
  Button,
  Box,
  Typography,
  ButtonGroup,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { formatNumber } from "../utils/formatNumber"; // Daily.jsx dagi util

const LineAccordion = ({ item, orders, handleEditLineNorm }) => {
  const [editingRow, setEditingRow] = useState({});

  const handleDoubleClick = (rowId) => {
    setEditingRow({ lineId: item.id, rowId });
  };

  const handleCancelEdit = () => setEditingRow({});

  return (
    <Accordion sx={{ mb: 1, border: "1px solid #ddd" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {item.line_name || "Unnamed Line"}
        </Typography>
        <Typography sx={{ ml: 2, fontSize: "12px", color: "text.secondary" }}>
          Общ.План: {formatNumber(item.total_norm)} | 1-Sort: {formatNumber(item.total_sort_1)} | 2-Sort: {formatNumber(item.total_sort_2)} | Brak: {formatNumber(item.total_defect)}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: 12 }}>Model nomi</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Variant nomi</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Reja</TableCell>
              <TableCell sx={{ fontSize: 12, textAlign: "right" }}>1-sort</TableCell>
              <TableCell sx={{ fontSize: 12, textAlign: "right" }}>2-sort</TableCell>
              <TableCell sx={{ fontSize: 12, textAlign: "right" }}>Brak</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {item.norm_category?.map((detail) => {
              const isEditing =
                editingRow.lineId === item.id && editingRow.rowId === detail.id;

              return (
                <TableRow
                  key={detail.id}
                  hover
                  onDoubleClick={() => handleDoubleClick(detail.id)}
                  sx={{ cursor: "pointer" }}
                >
                  {/* Model nomi */}
                  <TableCell sx={{ fontSize: 12, padding: "2px 4px" }}>
                    {isEditing ? (
                      <Autocomplete
                        options={orders}
                        getOptionLabel={(o) => o.full_name || ""}
                        value={detail.order_detail || null}
                        onChange={(_, val) => {
                          detail.order_detail = val;
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        renderInput={(params) => (
                          <TextField {...params} size="small" variant="standard" />
                        )}
                      />
                    ) : (
                      detail.order_name
                    )}
                  </TableCell>

                  {/* Variant nomi */}
                  <TableCell sx={{ fontSize: 12, padding: "2px 4px" }}>
                    {isEditing ? (
                      <Autocomplete
                        options={detail.order_detail?.variant_link || []}
                        getOptionLabel={(v) => v.name || ""}
                        value={
                          detail.order_detail?.variant_link.find(
                            (v) => v.id === detail.order_variant
                          ) || null
                        }
                        onChange={(_, val) => {
                          detail.order_variant = val?.id || null;
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        renderInput={(params) => <TextField {...params} size="small" variant="standard" />}
                      />
                    ) : (
                      detail.order_variant_name
                    )}
                  </TableCell>

                  {/* Reja */}
                  <TableCell sx={{ fontSize: 12, padding: "2px 4px" }}>
                    {isEditing ? (
                      <TextField
                        type="number"
                        size="small"
                        variant="standard"
                        value={detail.norm}
                        onChange={(e) => (detail.norm = e.target.value)}
                      />
                    ) : (
                      formatNumber(detail.norm)
                    )}
                  </TableCell>

                  {/* 1-sort */}
                  <TableCell sx={{ textAlign: "right", fontSize: 12 }}>
                    {formatNumber(detail.total_sort_1)}
                  </TableCell>

                  {/* 2-sort */}
                  <TableCell sx={{ textAlign: "right", fontSize: 12 }}>
                    {formatNumber(detail.total_sort_2)}
                  </TableCell>

                  {/* Brak */}
                  <TableCell sx={{ textAlign: "right", fontSize: 12 }}>
                    {formatNumber(detail.total_defect)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell sx={{ fontSize: 12 }}>
                    {isEditing ? (
                      <ButtonGroup size="small">
                        <IconButton color="success" onClick={() => handleEditLineNorm(detail)}>
                          <CheckCircleOutlineIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="error" onClick={handleCancelEdit}>
                          <HighlightOffIcon fontSize="small" />
                        </IconButton>
                      </ButtonGroup>
                    ) : (
                      <Button size="small" onClick={() => handleDoubleClick(detail.id)}>Edit</Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  );
};

export default LineAccordion;
