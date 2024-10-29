import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './ui-components/Navbar';
import Slider from './ui-components/Slider';
import ProductCard from './ui-components/ProductCard';
import Product from './ui-components/Product';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Slider />
              <ProductCard />
            </>
          }
        />
        <Route path="/product/:productId" element={<Product />} />
      </Routes>
    </Router>
  );
}
