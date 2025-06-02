'use client';

import { useState, useEffect } from 'react';
import { Product, productsAPI, cartAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface ProductGridProps {
  onLoginRequired: () => void;
  onCartUpdate?: () => void;
}

export default function ProductGrid({ onLoginRequired, onCartUpdate }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await productsAPI.getAll();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }

    setAddingToCart(product.id);
    try {
      await cartAPI.add(product.id, 1);
      toast.success(`${product.name} added to cart!`, {
        description: `$${product.price.toFixed(2)} - View cart to checkout`,
      });
      onCartUpdate?.();
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Hero section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Premium Tech Collection
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Discover our carefully curated selection of high-quality tech products 
          designed to enhance your digital lifestyle.
        </p>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <CardContent className="p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h3 className="font-semibold text-lg sm:text-xl text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  High-quality {product.name.toLowerCase()} with premium features and reliable performance.
                </p>
              </div>
              
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs sm:text-sm text-green-600 font-medium">Free shipping</span>
                </div>
                
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={addingToCart === product.id}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 sm:px-4"
                  size="sm"
                >
                  {addingToCart === product.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Add to Cart</span>
                      <span className="sm:hidden">Add</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features section */}
      <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center max-w-4xl mx-auto px-4">
        <div className="p-4 sm:p-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Fast Checkout</h3>
          <p className="text-gray-600 text-sm sm:text-base">Secure and speedy checkout process with Stripe integration.</p>
        </div>
        <div className="p-4 sm:p-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Quality Products</h3>
          <p className="text-gray-600 text-sm sm:text-base">Curated selection of premium tech products for your needs.</p>
        </div>
        <div className="p-4 sm:p-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Simple Returns</h3>
          <p className="text-gray-600 text-sm sm:text-base">Easy return process if you're not completely satisfied.</p>
        </div>
      </div>
    </div>
  );
}
