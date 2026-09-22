import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import MenuPage from '@/pages/MenuPage';
import CategoryPage from '@/pages/CategoryPage';
import ItemDetailPage from '@/pages/ItemDetailPage';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminItems from '@/pages/admin/AdminItems';
import AdminItemEditor from '@/pages/admin/AdminItemEditor';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminSettings from '@/pages/admin/AdminSettings';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminErrorBoundary } from '@/components/admin/AdminErrorBoundary';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer routes */}
          <Route path="/" element={<Navigate to="/menu" replace />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:category" element={<CategoryPage />} />
          <Route path="/menu/:category/:slug" element={<ItemDetailPage />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminErrorBoundary><AdminLogin /></AdminErrorBoundary>} />
          <Route path="/admin" element={<AdminErrorBoundary><ProtectedRoute><AdminDashboard /></ProtectedRoute></AdminErrorBoundary>} />
          <Route path="/admin/items" element={<AdminErrorBoundary><ProtectedRoute><AdminItems /></ProtectedRoute></AdminErrorBoundary>} />
          <Route path="/admin/items/:id" element={<AdminErrorBoundary><ProtectedRoute><AdminItemEditor /></ProtectedRoute></AdminErrorBoundary>} />
          <Route path="/admin/categories" element={<AdminErrorBoundary><ProtectedRoute><AdminCategories /></ProtectedRoute></AdminErrorBoundary>} />
          <Route path="/admin/settings" element={<AdminErrorBoundary><ProtectedRoute><AdminSettings /></ProtectedRoute></AdminErrorBoundary>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
