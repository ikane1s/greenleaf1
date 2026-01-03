import './App.scss';
import Catalog from './pages/Catalog/Catalog';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import { Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import CallbackButton from './components/Callback/CallbackButton';
import CallbackModal from './components/Callback/CallbackModal';
import { useState } from 'react';
import Partners from './pages/Partners';

function App() {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  return (
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
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CallbackButton onClick={() => setOpen(true)} />
      {open && <CallbackModal onClose={() => setOpen(false)} />}
    </div>
  );
}

export default App;
