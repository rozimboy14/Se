import DashboardIcon from "@mui/icons-material/Dashboard";
import MuseumIcon from "@mui/icons-material/Museum";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddIcon from "@mui/icons-material/Add";
import SettingsInputCompositeIcon from "@mui/icons-material/SettingsInputComposite";
import LayersIcon from "@mui/icons-material/Layers";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AnchorIcon from '@mui/icons-material/Anchor';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import ShieldIcon from '@mui/icons-material/Shield';
import CategoryIcon from '@mui/icons-material/Category';
import AbcIcon from '@mui/icons-material/Abc';

import GradeIcon from '@mui/icons-material/Grade';
export const breadcrumbTree = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: <DashboardIcon fontSize="small" />,
  },
  {
    path: "/sewing/brand",
    title: "Заказчик",
    icon: <AnchorIcon fontSize="small" />,
  },
  {
    path: "/sewing/specification",
    title: "Спецификация",
    icon: <ShieldIcon fontSize="small" />,
  },
  {
    path: "/sewing/accessory",
    title: "Аксессуары",
    icon: <WorkspacesIcon fontSize="small" />,
  },
  {
    path: "/sewing/packaging-category",
    title: " Категория упаковки",
    icon: <CategoryIcon fontSize="small" />,
  },
  {
    path: "/sewing/sewing-category",
    title: "Категория шитья",
    icon: <AbcIcon fontSize="small" />,
  },
  {
    path: "/sewing/article",
    title: "Модель",
    icon: <SettingsInputCompositeIcon fontSize="small" />,
  },
  {
    path: "/sewing/orders",
    title: "Заказь",
    icon: <GradeIcon fontSize="small" />,
  },
  {
    path: "/stock/stock",
    title: "Складь крои",
    icon: <GradeIcon fontSize="small" />,
    children: [
      {
        path: "/stock/stock/entry/:totalEntryId/", // to‘liq path
        getTitle: (_, q) => {
          const created_date = q.get("created_date");
          const order = q.get("order");
          if (created_date && order && created_date === order) return null;
          return created_date || "Reja";
        },
        icon: <MuseumIcon fontSize="small" />,
      },
      {
        path: "/stock/stock/brand/:brand_Id/:warehouseId/", 
        getTitle: (_, q) => {
          const warehouse_name = q.get("warehouse_name");
          const brand_name = q.get("brand_name");
          return `${warehouse_name} - ${brand_name} ` || "";
        },
        icon: <MuseumIcon fontSize="small" />,
      },
      {
        path: "/stock/stock/stock-all/:warehouseId", 
        getTitle: (_, q) => {
          const warehouse_name = q.get("warehouse_name");
        
          return `${warehouse_name} ` || "";
        },
        icon: <MuseumIcon fontSize="small" />,
      },
      {
        path: "/stock/stock/category-detail/:warehouseId/:category_id/", 
        getTitle: (_, q) => {
          const warehouse_name = q.get("warehouse_name");
         const category_name = q.get("category_name");
          return `${warehouse_name} - ${category_name} ` || "";
        },
        icon: <MuseumIcon fontSize="small" />,
      },
    ],
  },
  {
    path: "/stock/accessory-stock/",
    title: "Складь аксессуарь",
    icon: <GradeIcon fontSize="small" />,
    children: [
      {
        path: "/stock/accessory-stock/accessory-all/:warehouseId", // to‘liq path
        getTitle: (_, q) => {
          const warehouse_name = q.get("warehouse_name");
          return `${warehouse_name} - все аксессуарь` || "Reja";
        },
        icon: <MuseumIcon fontSize="small" />,
      },
      {
        path: "/stock/accessory-stock/:brand_Id/:warehouseId", // to‘liq path
        getTitle: (_, q) => {
          const warehouse_name = q.get("warehouse_name");
          const brand_name = q.get("brand_name");
          return `${warehouse_name} - ${brand_name} ` || "";
        },
        icon: <MuseumIcon fontSize="small" />,
      },
 {
  path: "/stock/accessory-stock/accessory-type/:warehouseId",
  getTitle: (_, q) => {
    const type_name = q.get("type_name") || "";
    const warehouse_name = q.get("warehouse_name") || "";
    if (!warehouse_name && !type_name) return "Складь крои";
    return `${warehouse_name}${type_name ? " - " + type_name : ""}`;
  },
  icon: <MuseumIcon fontSize="small" />,
}
    ],
  },



  {
    path: "/stock/stock_total_entry",
    title: "Приход",
    icon: <LayersIcon fontSize="small" />,
    children: [
      {
        path: "/stock/stock_total_entry/:totalEntryId/", // to‘liq path
        getTitle: (_, q) => {
          const created_date = q.get("created_date");
          const order = q.get("order");
          if (created_date && order && created_date === order) return null; // Takrorlamaslik uchun
          return created_date || "Reja";
        },
        icon: <MuseumIcon fontSize="small" />,
      },
    ],
  },
  // {
  //   path: "/order-details/customer",
  //   title: "Заказчик",
  //   icon: <WorkIcon fontSize="small" />,
  // },
  {
    path: "/order-details/needle",
    title: "Тип машины",
    icon: <AccountTreeIcon fontSize="small" />,
  },
  {
    path: "/orders-list",
    title: "Заказь Листь",
    icon: <InventoryIcon fontSize="small" />,
    children: [
      {
        path: "/production/production-report",
        title: "Reja",

        icon: <AssessmentIcon fontSize="small" />,
        children: [
          {
            path: "/production/production-report/:reportId",
            getTitle: (_, q) => {
              const daily = q.get("daily");
              const order = q.get("order");
              if (daily && order && daily === order) return null; // Takrorlamaslik uchun
              return daily || "Reja";
            },
            icon: <MuseumIcon fontSize="small" />,
          },
          {
            path: "/production/production-report/:reportId",
            title: "Kunlik",
            icon: <AddIcon fontSize="small" />,
          },
          {
            path: "/orders-list/orders/:orderId/detail-order/:detailId",
            getTitle: (_, q) => {
              const order = q.get("order");
              return order || "Детали";
            },
            icon: <MuseumIcon fontSize="small" />,
          },
        ],
      },

 
    ],
  },

];

export const flattenBreadcrumbTree = (tree, result = []) => {
  for (const item of tree) {
    result.push(item);
    if (item.children) {
      flattenBreadcrumbTree(item.children, result);
    }
  }
  return result;
};
