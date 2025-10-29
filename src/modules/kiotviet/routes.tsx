import { Routes, Route } from 'react-router-dom';
import { ProductsPage } from './pages/ProductsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { InventoryPage } from './pages/InventoryPage';

export function KiotVietRoutes() {
  return (
    <Routes>
      <Route path="products" element={<ProductsPage />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="inventory" element={<InventoryPage />} />
    </Routes>
  );
}
