import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  IconButton,
} from "@mui/material";
import { getArticle, getSpecification } from "../api/axios";
import { Add, Delete } from "@mui/icons-material";
import { debounce } from "lodash";
const AddOrders = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState({
    specification: null,
    article: null,
    comment: "",
    quantity: "",
    variants: [],
  });

  const [articleOptions, setArticleOptions] = useState([]);
  const [specificationOptions, setSpecificationOptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchSeason, setSearchSeason] = useState("");
  const [loadingFetch, setLoadingFetch ] = useState(false);
  // useEffect(() => {
  //   if (open) {
  //     const fetchData = async () => {
  //       try {
  //         const articleResponse = await getArticle({ search: text, page_size: 20 });
  //         setArticleOptions(articleResponse.data.results);

  //         const specificationgResponse = await getSpecification();
  //         setSpecificationOptions(specificationgResponse.data);
  //       } catch (error) {
  //         console.error("Ошибка при загрузке категорий:", error);
  //       }
  //     };

  //     fetchData();
  //   }
  // }, [open]);


useEffect(() => {
  if (open) {
    const fetchInitial = async () => {
      const [articleRes, specRes] = await Promise.all([
        getArticle({ page_size: 20 }),
        getSpecification({ page_size: 20 }),
      ]);
      setArticleOptions(articleRes.data.results);
      setSpecificationOptions(specRes.data.results);
    };
    fetchInitial();
  }
}, [open]);





const createDebouncedFetch = (apiFunc, setOptions, setLoading) =>
  debounce(async (text) => {
    setLoading(true);
    try {
      const response = await apiFunc({ search: text, page_size: 20 });
      setOptions(response.data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, 300);

const debouncedFetchArticle = createDebouncedFetch(getArticle, setArticleOptions, setLoadingFetch);
const debouncedFetchSpecification = createDebouncedFetch(getSpecification, setSpecificationOptions, setLoadingFetch);

useEffect(() => {
  if (open) debouncedFetchArticle(searchText);
  return () => debouncedFetchArticle.cancel();
}, [searchText, open]);

useEffect(() => {
  if (open) debouncedFetchSpecification(searchSeason);
  return () => debouncedFetchSpecification.cancel();
}, [searchSeason, open]);

  // 🔹 Variant qo‘shish
  const handleAddVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "" }],
    }));
  };

  // 🔹 Variant o‘zgartirish
  const handleVariantChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.variants];
      updated[index][field] = value;
      return { ...prev, variants: updated };
    });
  };

  // 🔹 Variant o‘chirish
  const handleRemoveVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  // 🔹 Formani yuborish
  const handleSubmit = () => {
    onAdd({
      specification: form.specification?.id,
      article: form.article?.id,
      comment: form.comment.trim(),
      quantity: form.quantity.trim(),
      variants: JSON.stringify(form.variants), 
    });

    setForm({
      specification: null,
      article: null,
      comment: "",
      quantity: "",
      variants: [],
    });
    onClose();
  };

  const handleClose = () => {
    setForm({
      specification: null,
      article: null,
      comment: "",
      quantity: "",
      variants: [],
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ style: { width: 600, padding: "15px" } }}
    >
      <DialogTitle>Добавить категорию</DialogTitle>
      <DialogContent sx={{ overflow: "unset", padding: 0 }}>
        <Autocomplete
          options={specificationOptions}
          getOptionLabel={(option) => option.name || ""}
          value={form.specification}
          onInputChange={(event, value) => setSearchSeason(value)} 
          onChange={(e, value) => setForm({ ...form, specification: value })}
          renderInput={(params) => (
            <TextField {...params} label="Сезон"  InputProps={{
                    ...params.InputProps,
                    sx: {
                      height: 35,        // 🔹 balandlik
                      fontSize: 14       // 🔹 shrift
                    }
                  }}
                  sx={{
                    "& .MuiInputLabel-root": {
                      fontSize: "14px",   // Label shrift
                      top: "-7px",  
                   // Label rangi
                    },
                       mb:2  
                  }} />
          )}
        />

        <Autocomplete
          options={articleOptions}
          getOptionLabel={(option) => option.full_name || ""}
          value={form.article}
onInputChange={(event, value) => setSearchText(value)} 
          onChange={(e, value) => setForm({ ...form, article: value })}
          renderInput={(params) => (
            <TextField {...params} label="Модель" InputProps={{
                    ...params.InputProps,
                    sx: {
                      height: 35,        // 🔹 balandlik
                      fontSize: 14       // 🔹 shrift
                    }
                  }}
                  sx={{
                    "& .MuiInputLabel-root": {
                      fontSize: "14px",   // Label shrift
                      top: "-7px"    // Label rangi
                    },
                       mb:2  
                  }} />
          )}
        />

        <TextField
          fullWidth
          label="Примичения"
          value={form.comment}
          onChange={handleChange("comment")}
          
          variant="outlined"
         InputProps={{
                sx: {
                  height: 35,              // 🔹 balandlik
                  fontSize: 14             // 🔹 shrift
                }
              }}
              sx={{
                mb: 2, "& .MuiInputLabel-root": {
                  fontSize: "14px",   // Label shrift
                  top: "-7px"    // Label rangi
                },
              }}
        />

        <TextField
          fullWidth
          type="number"
          label="Кол-во"
          value={form.quantity}
          onChange={handleChange("quantity")}
          variant="outlined"
    InputProps={{
                sx: {
                  height: 35,              // 🔹 balandlik
                  fontSize: 14             // 🔹 shrift
                }
              }}
              sx={{
                 mb: 3, "& .MuiInputLabel-root": {
                  fontSize: "14px",   // Label shrift
                  top: "-7px"    // Label rangi
                },
              }}
        />

        {/* 🔹 Variantlar ro‘yxati */}
        {form.variants.map((variant, index) => (
          <div
            key={index}
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <TextField
              label="Вариант"
              value={variant.name}
              onChange={(e) =>
                handleVariantChange(index, "name", e.target.value)
              }
            InputProps={{
                sx: {
                  height: 35,              // 🔹 balandlik
                  fontSize: 14             // 🔹 shrift
                }
              }}
              sx={{
                 mb: 1, "& .MuiInputLabel-root": {
                  fontSize: "14px",   // Label shrift
                  top: "-7px"    // Label rangi
                },
                width:"80%"
              }}
            />
            <IconButton
              color="error"
              onClick={() => handleRemoveVariant(index)}
            >
              <Delete  sx={{fontSize:"20px"}}/>
            </IconButton>
          </div>
        ))}

        <Button
          startIcon={<Add />}
          onClick={handleAddVariant}
          variant="outlined"
          sx={{ mt: 1,fontSize:"10px" }}
        >
          Вариант qo‘shish
        </Button>
      </DialogContent>

      <DialogActions sx={{ mt: 2 }}>
        <Button variant="outlined" color="error" onClick={handleClose} sx={{fontSize:"12px"}}> 
          Отмена
        </Button>
        <Button onClick={handleSubmit} variant="contained" sx={{fontSize:"12px"}}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrders;
