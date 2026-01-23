import './App.scss';
import Catalog from './pages/Catalog/Catalog';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import { Route, Routes, useLocation } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import CallbackButton from './components/Callback/CallbackButton';
import CallbackModal from './components/Callback/CallbackModal';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { useState, useEffect } from 'react';
import Partners from './pages/Partners';
import AboutUs from './pages/AboutUs';
import Footer from './components/Footer/Footer';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();

  // Скролл наверх при изменении маршрута
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <HelmetProvider>
      <div className="App">
        <Header setCurrentPage={setCurrentPage} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/catalog/:category"
            element={<Catalog currentPage={currentPage} setCurrentPage={setCurrentPage} />}
          />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/become-a-partners" element={<Partners />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <ScrollToTop />
        <CallbackButton onClick={() => setOpen(true)} />
        {open && <CallbackModal onClose={() => setOpen(false)} />}
      </div>
    </HelmetProvider>
  );
}

export default App;
