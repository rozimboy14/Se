// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  
} from "react-router-dom";
import './App.css';

import ErrorBoundary from "./ErrorBoundary";
import Layout from "./components/navbar/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Brand from "./components/sewing/Brand";
import Specification from "./components/sewing/Specification";
import PackagingCategory from "./components/sewing/PackagingCategory";
import SewingCategory from "./components/sewing/SewingCategory";
import Orders from "./components/sewing/Orders";
import Article from "./components/sewing/Article";
import Stock from "./components/stock/Stock";
import CategoryStock from "./components/stock/CategoryStock";
import ProductionLine from "./components/production/ProductionLine";
import ProductionReport from "./components/production/ProductionReport";
import ProductionNorm from "./components/production/ProductionNorm";
import NormCategory from "./components/production/NormCategory";
import Daily from "./components/production/Daily";
import Line from "./components/production/Line";
import LineOrders from "./components/production/LineOrders";
import { Dashboard } from "@mui/icons-material";
import StockTotalEntry from "./components/stock/StockTotalEntry";
import StockEntry from "./components/stock/StockEntry";
import StockDetail from "./components/stock/StockDetail";
import Accessory from "./components/sewing/Accessory";
import StockAccessory from "./components/stock/StockAccessory";
import AccessoryStockDetail from "./components/stock/AccessoryStockDetail";
import AccessoryStockTypeDetail from "./components/stock/AccessoryStockTypeDetail";
import StockDetailAll from "./components/stock/StockDetailAll";
import AccessoryStockDetailAll from "./components/stock/AccessoryStockDetailAll";
import StockDetailCategory from "./components/stock/StockDetailCategory";
import MonthPlaning from "./components/production/MonthPlaning";
import MonthPlaningOrder from "./components/production/MonthPlaningOrder";
import Barcode from "./components/production/Barcode";
import { breadcrumbTree, flattenBreadcrumbTree } from "./components/navbar/breadcrumbConfig";
import StockPackaging from "./components/packagingStock/StockPackaging";

import CategoryStockPackaging from "./components/packagingStock/CategoryStockPackaging";
import StockPackagingDetailAll from "./components/packagingStock/StockPackagingDetailAll";
import StockPackagingDetail from "./components/packagingStock/StockPackagingDetail";

console.log(flattenBreadcrumbTree(breadcrumbTree)); // 👈 bu ham ishlaydi
function App() {


  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sewing/brand" element={<Brand />} />
            <Route path="/sewing/specification" element={<Specification />} />
            <Route
              path="/sewing/packaging-category"
              element={<PackagingCategory />}
            />
            <Route
              path="/sewing/sewing-category"
              element={<SewingCategory />}
            />
          
            <Route path="/sewing/article" element={<Article />} />
            <Route path="/sewing/accessory" element={<Accessory />} />
            <Route path="/sewing/orders" element={<Orders />} />
            <Route path="/stock/stock" element={<Stock />} />
              <Route
              path="/stock/accessory-stock/"
              element={<StockAccessory />}
            />
            <Route path="/stock/stock/brand/:brand_Id/:warehouseId/" element={<StockDetail />} />
            <Route path="/stock/stock/category-detail/:warehouseId/:category_id/" element={<StockDetailCategory />} />
            <Route path="/stock/stock/stock-all/:warehouseId" element={<StockDetailAll />} />
            <Route path="/stock/accessory-stock/:brand_Id/:warehouseId" element={<AccessoryStockDetail />} />
            <Route path="/stock/accessory-stock/accessory-all/:warehouseId" element={<AccessoryStockDetailAll />} />
            <Route path="/stock/accessory-stock/accessory-type/:warehouseId" element={<AccessoryStockTypeDetail />} />
            <Route
              path="/stock/stock_total_entry"
              element={<StockTotalEntry />}
            />
            <Route path="/stock/stock_total_entry/:totalEntryId" element={<StockEntry />} />
            <Route path="/stock/category-stock" element={<CategoryStock />} />
            <Route path="/production/line" element={<Line />} />
            <Route
              path="/production/production-report"
              element={<ProductionReport />}
            />
            <Route
              path="/production/barcode"
              element={<Barcode />}
            />
            <Route
              path="/production/month-planing"
              element={<MonthPlaning />}
            />
            <Route
              path="/production/month-planing/:monthId/"
              element={<MonthPlaningOrder />}
            />
            <Route
              path="/production/production-norm"
              element={<ProductionNorm />}
            />
            <Route
              path="/production/norm-category"
              element={<NormCategory />}
            />
            <Route path="/production/production-report/:reportId" element={<Daily />} />
            <Route path="/production/production-line" element={<Line />} />
            <Route
              path="/production/production-order"
              element={<LineOrders />}
            />
            <Route
              path="/packaging/stock-packaging"
              element={<StockPackaging />}
            />
            <Route
              path="/packaging/stock-packaging/:brand_Id/:warehouseId/"
              element={<StockPackagingDetail/>}
            />
            <Route
              path="/packaging/stock-packaging/All/:warehouseId/"
              element={<StockPackagingDetailAll/>}
            />
            <Route
              path="/packaging/stock-packaging/category/:warehouseId/:category_id"
              element={<CategoryStockPackaging />}
            />
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
