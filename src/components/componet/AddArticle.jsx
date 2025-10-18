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
import { Add, Delete } from "@mui/icons-material";
import {
  getBrand,
  getPackagingCategory,
  getSewinggCategory,
  getAccessory,
} from "../api/axios";
import { debounce } from "lodash";
const AddArticle = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    article: "",
    brand: null,
    sewing_category: null,
    packaging_category: null,
    accessories: [], // [{accessory: {id, name..}, quantity: 1}]
    image: null,
  });

  const [brandOptions, setBrandOptions] = useState([]);
  const [sewingOptions, setSewingOptions] = useState([]);
  const [packagingOptions, setPackagingOptions] = useState([]);
  const [accessoryOptions, setAccessoryOptions] = useState([]);
const [searchText, setSearchText] = useState("");
  const [loadingFetch, setLoadingFetch ] = useState(false);
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const [sewing, packaging, accessories] = await Promise.all([
 
            getSewinggCategory(),
            getPackagingCategory(),
            getAccessory(),
          ]);

          setSewingOptions(sewing.data);
          setPackagingOptions(packaging.data);
          setAccessoryOptions(accessories.data);
        } catch (err) {
          console.error("Kategoriya yuklashda xatolik:", err);
        }
      };
      fetchData();
    }
  }, [open]);



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
  debouncedFetch(searchText, setBrandOptions, setLoadingFetch);
}, [searchText]);


  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  // 🔹 Accessory qo‘shish
  const handleAddAccessory = () => {
    setForm({
      ...form,
      accessories: [...form.accessories, { accessory: null, quantity: 1 }],
    });
  };

  // 🔹 Accessory o‘zgartirish
  const handleAccessoryChange = (index, key, value) => {
    const newAcc = [...form.accessories];
    newAcc[index][key] = value;
    setForm({ ...form, accessories: newAcc });
  };

  // 🔹 Accessory o‘chirish
  const handleRemoveAccessory = (index) => {
    const newAcc = [...form.accessories];
    newAcc.splice(index, 1);
    setForm({ ...form, accessories: newAcc });
  };

  // 🔹 Submit
  const handleSubmit = () => {
    if (!form.name.trim() || !form.article.trim()) return;

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("article", form.article.trim());
    formData.append("brand", form.brand?.id || "");
    formData.append("sewing_category", form.sewing_category?.id || "");
    formData.append("packaging_category", form.packaging_category?.id || "");
    if (form.image) {
      formData.append("image", form.image);
    }

    // 🔹 Accessories + quantity JSON qilib yuboramiz
    formData.append(
      "accessories",
      JSON.stringify(
        form.accessories.map((a) => ({
          accessory: a.accessory?.id,
          quantity: a.quantity,
        }))
      )
    );

    onAdd(formData);

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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Yangi Article qo‘shish</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          label="Nomi"
          value={form.name}
          onChange={handleChange("name")}
          InputProps={{
            sx: {

              height: 35,              // 🔹 balandlik
              fontSize: 13             // 🔹 shrift
            }
          }}
          sx={{

            "& .MuiInputLabel-root": {
              fontSize: "13px",   // Label shrift
              top: "-7px"    // Label rangi
            },
          }}
        />
        <TextField
          fullWidth
          label="Article"
          value={form.article}
          onChange={handleChange("article")}
          InputProps={{
            sx: {
              mt: 1,
              height: 35,              // 🔹 balandlik
              fontSize: 13             // 🔹 shrift
            }
          }}
          sx={{

            "& .MuiInputLabel-root": {
              fontSize: "13px",   // Label shrift
              top: "0px"     // Label rangi
            },
          }}
        />

        <Autocomplete
          options={brandOptions}
          getOptionLabel={(option) => option.name || ""}
          value={form.brand}
          onInputChange={(e, value) => setSearchText(value)}
          onChange={(e, value) => setForm({ ...form, brand: value })}
          renderInput={(params) => (
            <TextField {...params} label="Brand" InputProps={{
              ...params.InputProps,
              sx: {
                mt: 1,
                height: 35,
                fontSize: 13
              }
            }}
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "12px",
                  top: "0px"
                },
              }} />
          )}
        />

        <Autocomplete
          options={sewingOptions}
          getOptionLabel={(option) => option.name || ""}
          value={form.sewing_category}
          onChange={(e, value) => setForm({ ...form, sewing_category: value })}
          renderInput={(params) => (
            <TextField {...params} label="Sewing Category" InputProps={{
              ...params.InputProps,
              sx: {
                mt: 1,
                height: 35,
                fontSize: 13
              }
            }}
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "12px",
                  top: "0px"
                },
              }} />
          )}
        />

        <Autocomplete
          options={packagingOptions}
          getOptionLabel={(option) => option.name || ""}
          value={form.packaging_category}
          onChange={(e, value) =>
            setForm({ ...form, packaging_category: value })
          }
          renderInput={(params) => (
            <TextField {...params} label="Packaging Category" InputProps={{
              ...params.InputProps,
              sx: {
                mt: 1,
                height: 35,
                fontSize: 13
              }
            }}
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "12px",
                  top: "0px"
                },
              }} />
          )}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          style={{ marginTop: "20px" }}
        />

        <div style={{ marginTop: "20px" }}>
          <h4>Accessories</h4>
          {form.accessories.map((acc, index) => (
            <div
              key={index}
              style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
            >
              <Autocomplete
                options={accessoryOptions}
                getOptionLabel={(option) => option.full_name}
                value={acc.accessory}
                onChange={(e, value) =>
                  handleAccessoryChange(index, "accessory", value)
                }
                renderInput={(params) => (
                  <TextField {...params} label="Accessory" InputProps={{
                    ...params.InputProps,
                    sx: {
                      height: 30,
                      fontSize: 13
                    }
                  }}
                    sx={{
                      "& .MuiInputLabel-root": {
                        fontSize: "12px",
                        top: "-7px"
                      },
                    }} />
                )}
                sx={{ width: "80%", }}
              />
              <TextField
                type="number"
                label="Quantity"
                value={acc.quantity}
                onChange={(e) =>
                  handleAccessoryChange(index, "quantity", e.target.value)
                }
                InputProps={{
                  sx: {
                    marginLeft: "5px",
                    height: 30,              // 🔹 balandlik
                    fontSize: 13             // 🔹 shrift
                  }
                }}
                sx={{
                  width: "20%",
                  "& .MuiInputLabel-root": {
                    fontSize: "13px",   // Label shrift
                    top: "0px"    // Label rangi
                  },
                }}
              />
              <IconButton color="error" onClick={() => handleRemoveAccessory(index)}>
                <Delete />
              </IconButton>
            </div>
          ))}

          <Button
            startIcon={<Add />}
            onClick={handleAddAccessory}
            variant="outlined"
            sx={{ mt: 1, fontSize: "10px" }}
          >
            Accessory qo‘shish
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="outlined" sx={{ fontSize: "10px" }}>
          Bekor qilish
        </Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ fontSize: "10px" }}>
          Saqlash
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddArticle;
