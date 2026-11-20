import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import ExploreIndia from './pages/ExploreIndia';
import StatePage from './pages/StatePage';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import ArtisanProfile from './pages/ArtisanProfile';
import ArtisansDirectory from './pages/ArtisansDirectory';
import CraftPassport from './pages/CraftPassport';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import MyOrders from './pages/MyOrders';
// import OurImpact from './pages/OurImpact';
import Collections from './pages/Collections';
import PublicCollection from './pages/PublicCollection';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-cream-50 text-earth-900 font-sans selection:bg-terracotta-200 selection:text-terracotta-700">
      <ScrollToTop />
      <Navbar />
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ExploreIndia />} />
          <Route path="/state/:stateId" element={<StatePage />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/artisans" element={<ArtisansDirectory />} />
          <Route path="/artisan/:sellerId" element={<ArtisanProfile />} />
          <Route path="/passport" element={<CraftPassport />} />
          {/* <Route path="/impact" element={<OurImpact />} /> */}
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/wishlist" element={<Collections />} />
          <Route path="/collection/:shareId" element={<PublicCollection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<SellerDashboard />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
