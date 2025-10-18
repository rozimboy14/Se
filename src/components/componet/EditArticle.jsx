import React, { useEffect, useState,useCallback  } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box
} from "@mui/material";
import { getAccessory, getBrand, getPackagingCategory, getSewinggCategory } from "../api/axios";
import { debounce } from "lodash";
const EditArticle = ({ open, onClose, onUpdate, initialData }) => {
  const [form, setForm] = useState({
    name: "",
    article: "",
    brand: null,
    sewing_category: null,
    packaging_category: null,
    accessories: [],
    image: null,
  });

  const [sewingOptions, setSewingOptions] = useState([]);
  const [packagingOptions, setPackagingOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [accessoryOptions, setAccessoryOptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [inputBrandText, setInputBrandText] = useState("");
  // Kategoriyalarni yuklash
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const [packRes, sewRes, accessoryRes] = await Promise.all([
            getPackagingCategory(),

            getSewinggCategory(),
            getAccessory(),
          ]);
          setPackagingOptions(packRes.data);

          setSewingOptions(sewRes.data);
          setAccessoryOptions(accessoryRes.data);
        } catch (error) {
          console.error("Ошибка при загрузке категорий:", error);
        }
      };
      fetchData();
    }
  }, [open]);
useEffect(() => {
  if (initialData && open && brandOptions.length) {
    const brand = brandOptions.find((b) => b.id === initialData.brand) || null;
    setForm((prev) => ({ ...prev, brand }));
    setInputBrandText(brand?.name || "");
  }
}, [initialData, brandOptions, open]);

  // initialData + options kelganda formni set qilish
  useEffect(() => {
 if (initialData && open)  {
      setForm({
        name: initialData.name || "",
        article: initialData.article || "",
        brand: brandOptions.find((b) => b.id === initialData.brand) || null,
        sewing_category:
          sewingOptions.find((s) => s.id === initialData.sewing_category) ||
          null,
        packaging_category:
          packagingOptions.find((p) => p.id === initialData.packaging_category) ||
          null,
        // 🔹 accessory_link backenddan keladi
        accessories:
          initialData.accessory_link?.map((a) => ({
            accessory:
              accessoryOptions.find((opt) => opt.id === a.accessory) || null,
            quantity: a.quantity || "",
          })) || [],
        image: initialData.image || null,
      });
    }
  }, [
    initialData,
    brandOptions,
    sewingOptions,
    packagingOptions,
    accessoryOptions,
  ]);


  const debouncedFetch = debounce(async (text, setBrand, setLoadingFetch) => {
    setLoadingFetch(true);
    try {
      const response = await getBrand({ search: text, page_size: 20 });
      setBrandOptions(response.data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFetch(false);
    }
  }, 300); // 300ms delay

useEffect(() => {
  if (searchText !== form.brand?.name) { // tanlangan optionni yozib yubormaslik
    debouncedFetch(searchText, setBrandOptions, setLoadingFetch);
  }
}, [searchText]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };



  const handleAccessoryChange = (index, field, value) => {
    const newAccessories = [...form.accessories];
    newAccessories[index] = { ...newAccessories[index], [field]: value };
    setForm({ ...form, accessories: newAccessories });
  };

  const addAccessory = () => {
    setForm({
      ...form,
      accessories: [...form.accessories, { accessory: null, quantity: "" }],
    });
  };

  const removeAccessory = (index) => {
    const newAccessories = form.accessories.filter((_, i) => i !== index);
    setForm({ ...form, accessories: newAccessories });
  };


  const handleSubmit = () => {
    if (form.name.trim() && form.article.trim()) {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("article", form.article.trim());
      formData.append("brand", form.brand?.id || "");
      formData.append("packaging_category", form.packaging_category?.id || "");
      formData.append("sewing_category", form.sewing_category?.id || "");

      if (form.image instanceof File) {
        formData.append("image", form.image);
      }


      const accessoriesData = form.accessories.map((a) => ({
        accessory: a.accessory?.id || "",
        quantity: a.quantity,
      }));
      formData.append("accessories", JSON.stringify(accessoriesData));

      onUpdate(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setForm({
      name: "",
      article: "",
      brand: null,
      sewing_category: null,
      packaging_category: null,
      accessories: [],
      image: null,
    });
    onClose();
  };


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: 900, maxWidth: "100%",
          padding: "15px",

        }
      }}
    >
      <DialogTitle>Редактировать артикул</DialogTitle>
      <DialogContent sx={{ overflow: "unset", padding: 0 }}>
        <Box sx={{ width: "100%", display: "flex", gap: "8px", alignItems: "start", marginBottom: "10px" }}>
          <Box sx={{ width: "70%" }}>



            <TextField
              fullWidth
              label="Название"
              value={form.name}
              onChange={handleChange("name")}
              variant="outlined"
              InputProps={{
                sx: {
                  height: 35,              // 🔹 balandlik
                  fontSize: 14             // 🔹 shrift
                }
              }}
              sx={{
                mt: 1, mb: 2, "& .MuiInputLabel-root": {
                  fontSize: "14px",   // Label shrift
                  top: "-7px"    // Label rangi
                },
              }}
            />
            <TextField
              fullWidth
              label="Артикль"
              value={form.article}
              onChange={handleChange("article")}
              variant="outlined"
              InputProps={{
                sx: {
                  height: 35,              // 🔹 balandlik
                  fontSize: 14             // 🔹 shrift
                }
              }}
              sx={{
                mt: 1, mb: 3, "& .MuiInputLabel-root": {
                  fontSize: "14px",   // Label shrift
                  top: "-7px"    // Label rangi
                },
              }}
            />


            <Autocomplete
              options={brandOptions}
              value={form.brand}
                onChange={(e, newValue) => {
    setForm({ ...form, brand: newValue });
    setInputBrandText(newValue?.name || "");
  }}
  inputValue={inputBrandText}
                onInputChange={(e, newInputValue, reason) => {
    if (reason === "input") {
      setInputBrandText(newInputValue);
      debouncedFetch(newInputValue, setBrandOptions, setLoadingFetch);
    }
  }}
              getOptionLabel={(option) => option.name || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Заказчик"
                  InputProps={{
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
                  }}
                />
              )}
            />
          </Box >
          <Box sx={{ width: "30%" }}>


            {/* Preview qismi */}
            {form.image ? (
              <Box
                component="img"
                src={typeof form.image === "string" ? form.image : URL.createObjectURL(form.image)}
                alt="preview"
                sx={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "8px",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 150,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px dashed #aaa",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  fontSize: "13px",
                  color: "#777",
                }}
              >
                Нет изображения
              </Box>
            )}

            {/* Upload tugmasi */}
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ textTransform: "none" }}
            >
              Загрузить
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setForm({ ...form, image: file });
                  }
                }}
              />
            </Button>
          </Box>
        </Box>

        <Box sx={{ width: "100%", gap: "10px" }}>
          <h3 style={{ textAlign: "center" }}>Kategoriya</h3>
          <Box sx={{ width: "100%", display: "flex", gap: "10px" }}>



            <Autocomplete
              sx={{ width: "50%" }}
              options={sewingOptions}
              getOptionLabel={(option) => option.name || ""}
              value={form.sewing_category}
              onChange={(e, value) => setForm({ ...form, sewing_category: value })}
              renderInput={(params) => (
                <TextField {...params} label="Швейная категория" InputProps={{
                  ...params.InputProps,
                  sx: {
                    height: 35,
                    fontSize: 14
                  }
                }}
                  sx={{
                    "& .MuiInputLabel-root": {
                      fontSize: "14px",
                      top: "-7px"
                    },
                  }} />
              )}
            />
            <Autocomplete
              sx={{ width: "50%", }}
              options={packagingOptions}
              getOptionLabel={(option) => option.name || ""}
              value={form.packaging_category}
              onChange={(e, value) =>
                setForm({ ...form, packaging_category: value })
              }
              renderInput={(params) => (
                <TextField {...params} label="Упаковочная категория" InputProps={{
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
                  }} />
              )}
            />
          </Box>
        </Box>


        <Box  >
          <h3 style={{ textAlign: "center" }}>Accessory</h3>
          <Box sx={{ width: "100%" }}>


            {/* Accessories block */}
            {form.accessories.map((a, index) => (
              <div key={index} style={{ display: "flex", gap: "15px", alignItems: "center", marginBottom: "10px" }}>
                <Autocomplete
                  sx={{ width: "70%", marginBottom: "3px" }}
                  options={accessoryOptions}
                  getOptionLabel={(option) => option.name || ""}
                  value={a.accessory}
                  onChange={(e, value) =>
                    handleAccessoryChange(index, "accessory", value)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Аксессуар" InputProps={{
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
                        "& .MuiInputBase-input": {
                          fontSize: "13px",   // Input shrift
                          height: "30px",     // Balandlik
                        }
                      }} />
                  )}

                />
                <TextField
                  label="Количество"
                  type="number"
                  value={a.quantity}
                  onChange={(e) =>
                    handleAccessoryChange(index, "quantity", e.target.value)
                  }
                  InputProps={{
                    sx: {
                      height: 35,              // 🔹 balandlik
                      fontSize: 14             // 🔹 shrift
                    }
                  }}
                  sx={{
                    mt: 1, mb: 1, width: "20%",
                    "& .MuiInputLabel-root": {
                      fontSize: "14px",   // Label shrift
                      top: "-7px"    // Label rangi
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  color="error"


                  onClick={() => removeAccessory(index)}
                >
                  X
                </Button>
              </div>
            ))}

            <Button onClick={addAccessory} variant="outlined" sx={{ mt: 1 }}>
              + Добавить аксессуар
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ mt: 2 }}>
        <Button variant="outlined" color="error" onClick={handleClose}>
          Отмена
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditArticle;
