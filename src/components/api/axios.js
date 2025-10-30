import axios from "axios";
const BASE_URL = `http://192.168.91.51:8000/`;
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshApi=axios.create({
  baseURL:BASE_URL,
  withCredentials:true,
})

function handleLogout(){
  localStorage.clear();
  sessionStorage.clear();
  document.cookie="access_token=; Max-Age=0; path=/;"
  document.cookie="refresh_token=; Max-Age=0; path=/;"
  window.location.replace("/login")
}

api.interceptors.response.use(
  (response)=>response,
  async(error)=>{
    const originalRequest = error.config;
    if (!originalRequest ||!error.response){
      return Promise.reject(error);

    }
    const isRefreshURL = originalRequest.url.includes("/users/refresh/")
    if (error.response?.status ===401 && !originalRequest._retry && !isRefreshURL){
      originalRequest._retry=true
      try{
        const refreshResponse = await refreshApi.post("/users/refresh/")
          console.log("✅ Token yangilandi:", refreshResponse.data.access);
        return api(originalRequest)
        

      }
      catch (refreshError){
             console.error("❌ Refresh token ishlamadi:", refreshError);
             handleLogout();
             return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
);

//ANCHOR - Users
export const login = (data) => {
  return api.post(`/users/login/`, data);
};
export const logout = () => {
  return api.post("/users/logout/", {}, { withCredentials: true });
};





//ANCHOR Sewing

export const getBrand = (params = {}) => {
  return api.get(`/sewing/brand/`, { params });
};
export const getBrandOptions = (query = "") => {
  return api.get(`/sewing/brand-options/?search=${encodeURIComponent(query)}`);
};

export const postBrand = (data) =>
  api.post(`/sewing/brand/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const patchBrand = (id, data) =>
  api.patch(`/sewing/brand/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const deleteBrand = (id) => api.delete(`/sewing/brand/${id}/`);

export const getSpecification = (params = {}) => api.get(`/sewing/specification/`,{ params });

export const getAccessory = (params={}) => api.get(`/sewing/accessory/`,{ params });

export const postAccessory = (data) =>
  api.post(`/sewing/accessory/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const patchAccessory = (id, data) =>
  api.patch(`/sewing/accessory/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteAccessory = (id) => api.delete(`/sewing/accessory/${id}/`);

export const postSpecification = (data) =>
  api.post(`/sewing/specification/`, data);

export const patchSpecification = (id, data) =>
  api.patch(`/sewing/specification/${id}/`, data);

export const deleteSpecification = (id) =>
  api.delete(`/sewing/specification/${id}/`);

//  Packaging-Category

export const getPackagingCategory = () => api.get(`sewing/packaging_category/`);

export const postPackagingCategory = (data) =>
  api.post(`sewing/packaging_category/`, data);

export const patchPackagingCategory = (id, data) =>
  api.patch(`sewing/packaging_category/${id}/`, data);

export const deletePackagingCategory = (id) =>
  api.delete(`sewing/packaging_category/${id}/`);

// Sewing-Category
export const getSewinggCategory = () => api.get(`sewing/sewing_category/`);

export const postSewinggCategory = (data) =>
  api.post(`sewing/sewing_category/`, data);

export const patchSewinggCategory = (id, data) =>
  api.patch(`sewing/sewing_category/${id}/`, data);

export const deleteSewinggCategory = (id) =>
  api.delete(`sewing/sewing_category/${id}/`);

// Article
export const getArticle = (params={}) => api.get(`/sewing/article`,{params});
export const postArticle = (data) =>
  api.post(`/sewing/article/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const patchArticle = (id, data) =>
  api.patch(`/sewing/article/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteArticle = (id) => api.delete(`/sewing/article/${id}/`);

// Order
export const getOrders = (params={}) => api.get(`/sewing/order/`,{params});

export const postOrder = (data) => api.post(`sewing/order/`, data);

export const patchOrder = (id, data) => api.patch(`sewing/order/${id}/`, data);

export const deleteOrder = (id) => api.delete(`sewing/order/${id}/`);

// ANCHOR  STOCK

// stock
export const getWarehouse = () => api.get(`/stock/warehouse/`);
export const getStock = (brandId, categoryId, warehouseId) =>
  api.get(
    `/stock/stock/?order__article__brand_id=${brandId}&order__article__sewing_category_id=${categoryId}&warehouse_id=${warehouseId}`
  );
export const getStockExportPdf = (warehouseId) =>
  api.get(`/stock/stock/export-pdf/?warehouse_id=${warehouseId}`, {
    responseType: "blob",
  });
export const getStockBrandExportPdf = (warehouseId, branId) =>
  api.get(
    `/stock/stock/export-brand-pdf/?warehouse_id=${warehouseId}&brand_id=${branId}`,
    { responseType: "blob" }
  );

export const getTotalStock = (warehouseId) =>
  api.get(`/stock/total_stock/?warehouse_id=${warehouseId}`);

export const getAccessoryStock = (brand_id, type_name, warehouse_id) =>
  api.get(
    `/stock/accessory-stock/?brand_id=${brand_id}&type_name=${type_name}&warehouse_id=${warehouse_id}`
  );
export const getTotalAccessory = () => api.get(`/stock/total_accessory/`);

export const getAccessoryStockExportPdf = (brand_id, type_name, warehouse_id) =>
  api.get(
    `/stock/accessory-stock/export-pdf/?brand_id=${brand_id}&type_name=${type_name}&warehouse_id=${warehouse_id}`,
    { responseType: "blob" }
  );

export const getTotalEntryExportPdf = (id) =>
  api.get(`/stock/total_entry_pdf/${id}/pdf/`, { responseType: "blob" });

export const getStockTotalEntry = () => api.get(`/stock/total_entry/`);
export const getStockTotalEntryDetail = (id) =>
  api.get(`/stock/total_entry/${id}/`);
export const postStockTotalEntry = (data) =>
  api.post(`/stock/total_entry/`, data);

export const confirmStockTotalEntry = (id) =>
  api.post(`/stock/total_entry/${id}/confirm/`);

export const patchStockTotalEntry = (id, data) =>
  api.patch(`/stock/total_entry/${id}/`, data);

export const deleteStockTotalEntry = (id) =>
  api.delete(`/stock/total_entry/${id}/`);

export const getStockEntry = (id) =>
  api.get(`/stock/stock_entry/?total_entry_id=${id}`);

export const getAccessoryStockEntry = (id) =>
  api.get(`/stock/accessory_stock_entry/?total_entry_id=${id}`);

export const postStockEntryBulk = (data) =>
  api.post(`/stock/order-stock-entry/`, data);

export const postStockEntry = (data) => api.post(`/stock/stock_entry/`, data);

export const postAccessoryStockEntry = (data) =>
  api.post(`/stock/accessory_stock_entry/`, data);

export const patchStockEntry = (id, data) =>
  api.patch(`/stock/stock_entry/${id}/`, data);

export const patchAccessoryStockEntry = (id, data) =>
  api.patch(`/stock/accessory_stock_entry/${id}/`, data);

export const deleteAccessoryStockEntry = (id) =>
  api.delete(`/stock/accessory_stock_entry/${id}/`);

export const deleteStockEntry = (id) => api.delete(`/stock/stock_entry/${id}/`);

export const getStockcategory = (id) =>
  api.get(`/stock/by-category/?warehouse_id=${id}`);

export const getStockBrand = (id) =>
  api.get(`/stock/by-brand/?warehouse_id=${id}`);
export const getAccessoryType = (id) =>
  api.get(`/stock/by-accessory_type/?warehouse_id=${id}`);
export const getAccessoryStockBrand = (id) =>
  api.get(`/stock/by-brand_accessory/?warehouse_id=${id}`);

// ANCHOR Production

/**  Line */

export const getLine = (id) =>
  api.get(`production/production-lines/?warehouse_id=${id}`);
export const exportPdf = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("production/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob", // MUHIM! PDF blob sifatida qaytadi
  });
};
export const postLine = (data) =>
  api.post(`production/production-lines/`, data);

export const patchLine = (id, data) =>
  api.patch(`production/production-lines/${id}/`, data);

export const deleteLine = (id) =>
  api.delete(`production/production-lines/${id}/`);

//**   Bir oylik Ishlab chiqarsih */
// Productionreport
export const getProductionReport = (id, year, month) =>
  api.get(
    `/production/production-reports/?warehouse_id=${id}&year=${year}&month=${month}`
  );
export const getProductionReportId = (id) =>
  api.get(`/production/production-reports/${id}`);
export const getProductionReportOptions = () =>
  api.options(`/production/production-reports/`);
export const postProductionReport = (data) =>
  api.post(`/production/production-reports/`, data);
export const patchProductionReport = (id, data) =>
  api.patch(`/production/production-reports/${id}/`, data);
export const deleteProductionReport = (id) =>
  api.delete(`/production/production-reports/${id}/`);

// production-norm
export const getProductionNorm = (id) =>
  api.get(`/production/production-norm/?production_report=${id}`);
export const postProductionNorm = (data) =>
  api.post(`/production/production-norm/bulk-create/`, data);
export const patchProductionNorm = (id, data) =>
  api.patch(`/production/production-norm/${id}/`, data);
export const deleteProductionNorm = (id, data) =>
  api.delete(`/production/production-norm/${id}/`);
export const getCategoryNorm = (id) =>
  api.get(
    `/production/norm-category/?production_norm__production_report=${id}/`
  );
export const getCategoryNormReportId = (id) =>
  api.get(`/production/reports/${id}/norm-categories/`);
export const postCategoryNorm = (data) =>
  api.post(`/production/norm-category/`, data);
export const patchCategoryNorm = (id, data) =>
  api.patch(`/production/norm-category/${id}/`, data);
export const deleteCategoryNorm = (id) =>
  api.patch(`/production/norm-category/${id}/`);

export const getProductioncategory = () =>
  api.get(`/production/production-category/`);
// Bir kunlik ishlab chiqarish
// Kun
export const getDaily = (id) =>
  api.get(`/production/daily/?production_report=${id}`);
export const getDetailDaily = (id) => api.get(`/production/daily/${id}`);
export const postDaily = (data) => api.post(`/production/daily/`, data);
export const patchDaily = (id, data) =>
  api.patch(`/production/daily/${id}/`, data);
export const deleteDaily = (id) => api.delete(`/production/daily/${id}/`);

// kunga liniyani boglash
export const getProductionLine = () => api.get(`/production/line/`);
export const postProductionLine = (data) => api.post(`/production/line/`, data);
export const patchProductionLine = (id, data) =>
  api.patch(`/production/line/${id}/`, data);
export const deleteProductionLine = (id) =>
  api.delete(`/production/line/${id}/`);

// liniyada tikilgan ishlar kunlik
export const getLineOrders = () => api.get(`/production/line-orders/`);
export const postLineOrders = (data) =>
  api.post(`/production/line-orders/`, data);
export const patchLineOrders = (id, data) =>
  api.patch(`/production/line-orders/${id}/`, data);
export const deleteLineOrders = (id) =>
  api.delete(`/production/line-orders/${id}/`);

export const getMonthPlaning = (id, year, month) =>
  api.get(
    `/production/month-planing/?warehouse_id=${id}&year=${year}&month=${month}`
  );
export const getMonthPlaningDetail = (id) =>
  api.get(`/production/month-planing/${id}`);

export const exportPdfMonthPlaning = (id) =>
  api.get(`/production/month-planing/${id}/export-pdf/`, {
    responseType: "blob",
  });

export const getMonthPlaningOptions = () =>
  api.options(`/production/month-planing/`);

export const postMonthPlaning = (data) =>
  api.post(`/production/month-planing/`, data);
export const refreshMonthPlaningOrder = () =>
  api.post(`/production/refresh-stock/`);

export const patchMonthPlaning = (id, data) =>
  api.patch(`/production/month-planing/${id}/`, data);

export const deleteMonthPlaning = (id) =>
  api.delete(`/production/month-planing/${id}/`);

export const getMonthPlaningOrder = () =>
  api.get(`/production/month-planing-order/`);

export const postMonthPlaningOrder = (data) =>
  api.post(`/production/month-planing-order/`, data);

export const patchMonthPlaningOrder = (id, data) =>
  api.patch(`/production/month-planing-order/${id}/`, data);

export const deleteMonthPlaningOrder = (id) =>
  api.delete(`/production/month-planing-order/${id}/`);

export const getPackagingStockBrandList = (id) =>
  api.get(`/packaging/stock-packaging-brand/?warehouse_id=${id}`);
export const getPackagingStockCategoryList = (id) =>
  api.get(`/packaging/stock-packaging-category/?warehouse_id=${id}`);
export const getPackagingStock = (brand_id,catrgoty_id, warehouse_id) => {
  return api.get(`/packaging/packaging-stock/`, {
    params: {
      ...(brand_id ? { order__article__brand_id: brand_id } : {}),
      ...(catrgoty_id ? { order__article__packaging_category_id: catrgoty_id } : {}),
      warehouse_id,
    },
  });
};

export const getStockPackageExportPdf = (warehouseId) =>
  api.get(`/packaging/packaging-stock/export-pdf/?warehouse_id=${warehouseId}`, {
    responseType: "blob",
  });
export const getStockPackaBrandgeExportPdf = (warehouseId,branId) =>
  api.get(`/packaging/packaging-stock/export-brand-pdf/?warehouse_id=${warehouseId}&brand_id=${branId}`, {
    responseType: "blob",
  });


export const getChartProductionReportDaily = (warehouseId,year,month) =>
  api.get(`/production/chart-production-report-daily/?warehouse=${warehouseId}&year=${year}&month=${month}`, 
  );



export default api;
