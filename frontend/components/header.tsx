'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { cartAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut } from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
  onCartClick: () => void;
  cartUpdateTrigger?: number;
}

export default function Header({ onLoginClick, onCartClick, cartUpdateTrigger }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!isAuthenticated) {
        setCartItemCount(0);
        return;
      }

      try {
        const cartData = await cartAPI.get();
        setCartItemCount(cartData.itemCount || 0);
      } catch (error) {
        console.error('Failed to fetch cart count:', error);
      }
    };

    fetchCartCount();
  }, [isAuthenticated, cartUpdateTrigger]);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">S</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Store</h1>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Products</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Contact</a>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Cart */}
            <Button
              variant="outline"
              size="sm"
              onClick={onCartClick}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">{user?.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={onLoginClick} size="sm" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
