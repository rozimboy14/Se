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
const EditOrders = ({ open, onClose, onUpdate, initialData }) => {
  const [form, setForm] = useState({
    specification: null,
    article: null,
    comment: "",
    quantity: "",
    variants: [], // 🔹 variantlar ham kiritildi
  });

  const [articleOptions, setArticleOptions] = useState([]);
  const [specificationOptions, setSpecificationOptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchSeason, setSearchSeason] = useState("");
  const [loadingFetch, setLoadingFetch] = useState(false);
  // 🔹 Select optionsni olish
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

  // 🔹 Formani to‘ldirish (initialData bilan)
  useEffect(() => {
    if (initialData && open) {
      setForm((prev) => ({
        ...prev,
        specification: specificationOptions.find(
          (b) => b.id === initialData.specification
        ) || prev.specification,
        article: articleOptions.find(
          (b) => b.id === initialData.article
        ) || prev.article,
        comment: initialData.comment || "",
        quantity: initialData.quantity || "",
        variants: initialData.variant_link || [],
      }));
    }
  }, [initialData, specificationOptions, articleOptions, open]);

  // 🔹 Input change
  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  // 🔹 Variant qo‘shish
  const handleAddVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", order: "" }],
    }));
  };

  // 🔹 Variant o‘zgartirish
  const handleVariantChange = (index, field, value) => {
    const updated = [...form.variants];
    updated[index][field] = value;
    setForm({ ...form, variants: updated });
  };

  // 🔹 Variant o‘chirish
  const handleRemoveVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // 🔹 Submit
  const handleSubmit = () => {
    onUpdate({
      id: initialData.id,
      specification: form.specification?.id,
      article: form.article?.id,
      comment: form.comment.trim(),
      quantity: form.quantity,
      variants: JSON.stringify(form.variants), // ✅ backend JSON kutyapti
    });
    handleClose();
  };

  // 🔹 Close
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
      <DialogTitle>Редактировать артикул</DialogTitle>
      <DialogContent sx={{ overflow: "unset", padding: 0 }}>
        <Autocomplete
          options={specificationOptions}
          getOptionLabel={(option) => option.name || ""}
          loading={loadingFetch}
          value={form.specification}
          inputValue={searchSeason} // 🔹 yozilayotgan matn
          onInputChange={(e, value) => setSearchSeason(value)} // 
          onChange={(e, value) => {
            setForm((prev) => ({ ...prev, specification: value }));
            setSearchSeason(value?.name || ""); // 🔹 value bilan ham sync
          }}
          renderInput={(params) => (
            <TextField {...params} label="Сезон" InputProps={{
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
                mb: 2
              }} />
          )}
        />

        <Autocomplete
          options={articleOptions}
          getOptionLabel={(option) => option.full_name || ""}
          value={form.article}
          loading={loadingFetch}
          inputValue={searchText} // 🔹 yozilayotgan matn
          onInputChange={(e, value) => setSearchText(value)}
          onChange={(e, value) => {
            setForm((prev) => ({ ...prev, article: value }));
            setSearchText(value?.full_name || ""); // 🔹 value bilan ham sync
          }}

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
                mb: 2
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
          label="Коло-во"
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

        {/* 🔹 Variantlar */}
        {form.variants.map((variant, index) => (
          <div
            key={index}
            style={{ display: "flex", alignItems: "center", marginBottom: 5 }}
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
                mb: 2, "& .MuiInputLabel-root": {
                  fontSize: "14px",   // Label shrift
                  top: "-7px"    // Label rangi
                },
                width: "80%"
              }}
            />

            <IconButton
              color="error"
              onClick={() => handleRemoveVariant(index)}
            >
              <Delete sx={{ fontSize: "20px" }} />
            </IconButton>
          </div>
        ))}

        <Button
          startIcon={<Add />}
          onClick={handleAddVariant}
          variant="outlined"
          sx={{ fontSize: "12px" }}
        >
          Variant qo‘shish
        </Button>
      </DialogContent>

      <DialogActions sx={{ mt: 2 }}>
        <Button variant="outlined" color="error" onClick={handleClose} sx={{ fontSize: "12px" }}>
          Отмена
        </Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ fontSize: "12px" }}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditOrders;
