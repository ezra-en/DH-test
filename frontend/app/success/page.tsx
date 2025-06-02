'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home } from 'lucide-react';
import { cartAPI } from '@/lib/api';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    // Clear the cart after successful payment
    const clearCart = async () => {
      if (sessionId) {
        setClearing(true);
        try {
          await cartAPI.clear();
          console.log('✅ Cart cleared after successful payment');
        } catch (error) {
          console.error('❌ Failed to clear cart:', error);
        } finally {
          setClearing(false);
        }
      }
    };

    clearCart();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Thank you for your purchase! Your order has been confirmed and you'll receive an email receipt shortly.
          </p>
          
          {sessionId && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Session ID:</p>
              <p className="text-xs font-mono text-gray-700 break-all">{sessionId}</p>
            </div>
          )}

          <div className="space-y-3 pt-4">
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>

          {clearing && (
            <p className="text-sm text-gray-500">Updating your cart...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
