'use client';

import { useState } from 'react';
import Header from '@/components/header';
import ProductGrid from '@/components/product-grid';
import LoginModal from '@/components/login-modal';
import CartSidebar from '@/components/cart-sidebar';
import { Toaster } from 'sonner';

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);

  const handleLoginRequired = () => {
    setShowLoginModal(true);
  };

  const handleCartUpdate = () => {
    setCartUpdateTrigger(prev => prev + 1);
  };

  const handleCartClick = () => {
    setShowCartSidebar(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onLoginClick={() => setShowLoginModal(true)}
        onCartClick={handleCartClick}
        cartUpdateTrigger={cartUpdateTrigger}
      />
      
      <main>
        <ProductGrid 
          onLoginRequired={handleLoginRequired} 
          onCartUpdate={handleCartUpdate}
        />
      </main>

      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal} 
      />

      <CartSidebar 
        open={showCartSidebar} 
        onOpenChange={setShowCartSidebar}
        onCartUpdate={handleCartUpdate}
      />

      <Toaster 
        position="top-right"
        richColors
        closeButton
      />
    </div>
  );
}
