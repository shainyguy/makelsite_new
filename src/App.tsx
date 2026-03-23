import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Lazy load pages
const Layout = lazy(() => import('./components/Layout.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const Catalog = lazy(() => import('./pages/Catalog.jsx'));
const Constructor = lazy(() => import('./pages/Constructor.jsx'));
const Downloads = lazy(() => import('./pages/Downloads.jsx'));
const Partners = lazy(() => import('./pages/Partners.jsx'));
const Support = lazy(() => import('./pages/Support.jsx'));
const Contacts = lazy(() => import('./pages/Contacts.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));

// Loading fallback
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full"></div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/catalog" element={<Layout><Catalog /></Layout>} />
          <Route path="/catalog/:categoryId" element={<Layout><Catalog /></Layout>} />
          <Route path="/constructor" element={<Layout><Constructor /></Layout>} />
          <Route path="/downloads" element={<Layout><Downloads /></Layout>} />
          <Route path="/partners" element={<Layout><Partners /></Layout>} />
          <Route path="/support" element={<Layout><Support /></Layout>} />
          <Route path="/contacts" element={<Layout><Contacts /></Layout>} />
          <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
