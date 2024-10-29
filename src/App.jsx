import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './ui-components/Navbar';
import Slider from './ui-components/slider';
import ProductCard from './ui-components/productcard';
import Product from './ui-components/product';

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
