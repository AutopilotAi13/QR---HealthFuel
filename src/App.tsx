import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MenuPage from '@/pages/MenuPage';
import CategoryPage from '@/pages/CategoryPage';
import ItemDetailPage from '@/pages/ItemDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:category" element={<CategoryPage />} />
        <Route path="/menu/:category/:slug" element={<ItemDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
