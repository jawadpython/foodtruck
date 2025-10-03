export interface FoodTruck {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  images: string[];
  specifications: {
    dimensions: string;
    capacity: string;
    equipment: string[];
    features: string[];
  };
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  truckId: string;
  truckName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Devis {
  id: string;
  truckId: string;
  truckName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected';
  quoteAmount?: number;
  quoteMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  subject: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}
