const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Simple fetch wrapper
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

// Types
export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  createdAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string;
}

export interface User {
  id: number;
  email: string;
}

// API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiCall('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
  
  getStoredUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  getStoredToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  }
};

export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const data = await apiCall('/api/products');
    return data.products;
  }
};

export const cartAPI = {
  get: async () => {
    return apiCall('/api/cart');
  },
  
  add: async (productId: number, quantity: number = 1) => {
    return apiCall('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },
  
  update: async (productId: number, quantity: number) => {
    return apiCall('/api/cart/update', {
      method: 'PATCH',
      body: JSON.stringify({ productId, quantity }),
    });
  },
  
  remove: async (productId: number) => {
    return apiCall('/api/cart/remove', {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    });
  },
  
  clear: async () => {
    return apiCall('/api/cart/clear', {
      method: 'DELETE',
    });
  }
};
