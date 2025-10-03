import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { FoodTruck, Order, Devis, Message } from '@/types';

// Check if Firebase is available
const isFirebaseAvailable = () => {
  return db !== null && db !== undefined;
};

// Local storage fallback functions
const getLocalStorageData = (key: string): unknown[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

const setLocalStorageData = (key: string, data: unknown) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

// Food Trucks Service
export const foodTruckService = {
  async getAll(): Promise<FoodTruck[]> {
    if (isFirebaseAvailable()) {
      try {
        const querySnapshot = await getDocs(collection(db, 'foodTrucks'));
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as FoodTruck[];
      } catch (error) {
        console.error('Error fetching food trucks from Firebase:', error);
        return getLocalStorageData('foodTrucks');
      }
    }
    return getLocalStorageData('foodTrucks');
  },

  async getById(id: string): Promise<FoodTruck | null> {
    if (isFirebaseAvailable()) {
      try {
        const docRef = doc(db, 'foodTrucks', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as FoodTruck;
        }
        return null;
      } catch (error) {
        console.error('Error fetching food truck from Firebase:', error);
        const trucks = getLocalStorageData('foodTrucks');
        return trucks.find((truck: FoodTruck) => truck.id === id) || null;
      }
    }
    const trucks = getLocalStorageData('foodTrucks');
    return trucks.find((truck: FoodTruck) => truck.id === id) || null;
  },

  async create(truck: Omit<FoodTruck, 'id' | 'createdAt' | 'updatedAt'>): Promise<FoodTruck> {
    const newTruck = {
      ...truck,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isFirebaseAvailable()) {
      try {
        const docRef = await addDoc(collection(db, 'foodTrucks'), {
          ...newTruck,
          createdAt: Timestamp.fromDate(newTruck.createdAt),
          updatedAt: Timestamp.fromDate(newTruck.updatedAt),
        });
        return { id: docRef.id, ...newTruck };
      } catch (error) {
        console.error('Error creating food truck in Firebase:', error);
        // Fallback to localStorage
      }
    }

    // localStorage fallback
    const trucks = getLocalStorageData('foodTrucks');
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const createdTruck = { id, ...newTruck };
    trucks.push(createdTruck);
    setLocalStorageData('foodTrucks', trucks);
    return createdTruck;
  },

  async update(id: string, updates: Partial<FoodTruck>): Promise<void> {
    const updatedData = {
      ...updates,
      updatedAt: new Date(),
    };

    if (isFirebaseAvailable()) {
      try {
        const docRef = doc(db, 'foodTrucks', id);
        await updateDoc(docRef, {
          ...updatedData,
          updatedAt: Timestamp.fromDate(updatedData.updatedAt),
        });
        return;
      } catch (error) {
        console.error('Error updating food truck in Firebase:', error);
        // Fallback to localStorage
      }
    }

    // localStorage fallback
    const trucks = getLocalStorageData('foodTrucks');
    const index = trucks.findIndex((truck: FoodTruck) => truck.id === id);
    if (index !== -1) {
      trucks[index] = { ...trucks[index], ...updatedData };
      setLocalStorageData('foodTrucks', trucks);
    }
  },

  async delete(id: string): Promise<void> {
    if (isFirebaseAvailable()) {
      try {
        await deleteDoc(doc(db, 'foodTrucks', id));
        return;
      } catch (error) {
        console.error('Error deleting food truck from Firebase:', error);
        // Fallback to localStorage
      }
    }

    // localStorage fallback
    const trucks = getLocalStorageData('foodTrucks');
    const filteredTrucks = trucks.filter((truck: FoodTruck) => truck.id !== id);
    setLocalStorageData('foodTrucks', filteredTrucks);
  }
};

// Orders Service
export const orderService = {
  async getAll(): Promise<Order[]> {
    if (isFirebaseAvailable()) {
      try {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Order[];
      } catch (error) {
        console.error('Error fetching orders from Firebase:', error);
        return getLocalStorageData('orders');
      }
    }
    return getLocalStorageData('orders');
  },

  async create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const newOrder = {
      ...order,
      status: 'pending' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isFirebaseAvailable()) {
      try {
        const docRef = await addDoc(collection(db, 'orders'), {
          ...newOrder,
          createdAt: Timestamp.fromDate(newOrder.createdAt),
          updatedAt: Timestamp.fromDate(newOrder.updatedAt),
        });
        return { id: docRef.id, ...newOrder };
      } catch (error) {
        console.error('Error creating order in Firebase:', error);
        // Fallback to localStorage
      }
    }

    // localStorage fallback
    const orders = getLocalStorageData('orders');
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const createdOrder = { id, ...newOrder };
    orders.push(createdOrder);
    setLocalStorageData('orders', orders);
    return createdOrder;
  },

  async updateStatus(id: string, status: Order['status']): Promise<void> {
    const updatedData = {
      status,
      updatedAt: new Date(),
    };

    if (isFirebaseAvailable()) {
      try {
        const docRef = doc(db, 'orders', id);
        await updateDoc(docRef, {
          ...updatedData,
          updatedAt: Timestamp.fromDate(updatedData.updatedAt),
        });
        return;
      } catch (error) {
        console.error('Error updating order in Firebase:', error);
        // Fallback to localStorage
      }
    }

    // localStorage fallback
    const orders = getLocalStorageData('orders');
    const index = orders.findIndex((order: Order) => order.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updatedData };
      setLocalStorageData('orders', orders);
    }
  }
};

// Devis Service
export const devisService = {
  async getAll(): Promise<Devis[]> {
    if (isFirebaseAvailable()) {
      try {
        const querySnapshot = await getDocs(collection(db, 'devis'));
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Devis[];
      } catch (error) {
        console.error('Error fetching devis from Firebase:', error);
        return getLocalStorageData('devis');
      }
    }
    return getLocalStorageData('devis');
  },

  async create(devis: Omit<Devis, 'id' | 'createdAt' | 'updatedAt'>): Promise<Devis> {
    const newDevis = {
      ...devis,
      status: 'pending' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isFirebaseAvailable()) {
      try {
        const docRef = await addDoc(collection(db, 'devis'), {
          ...newDevis,
          createdAt: Timestamp.fromDate(newDevis.createdAt),
          updatedAt: Timestamp.fromDate(newDevis.updatedAt),
        });
        return { id: docRef.id, ...newDevis };
      } catch (error) {
        console.error('Error creating devis in Firebase:', error);
        // Fallback to localStorage
      }
    }

    // localStorage fallback
    const devisList = getLocalStorageData('devis');
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const createdDevis = { id, ...newDevis };
    devisList.push(createdDevis);
    setLocalStorageData('devis', devisList);
    return createdDevis;
  },

  async update(id: string, updates: Partial<Devis>): Promise<void> {
    const updatedData = {
      ...updates,
      updatedAt: new Date(),
    };

    if (isFirebaseAvailable()) {
      try {
        const docRef = doc(db, 'devis', id);
        await updateDoc(docRef, {
          ...updatedData,
          updatedAt: Timestamp.fromDate(updatedData.updatedAt),
        });
        return;
      } catch (error) {
        console.error('Error updating devis in Firebase:', error);
        // Fallback to localStorage
      }
    }

    // localStorage fallback
    const devisList = getLocalStorageData('devis');
    const index = devisList.findIndex((devis: Devis) => devis.id === id);
    if (index !== -1) {
      devisList[index] = { ...devisList[index], ...updatedData };
      setLocalStorageData('devis', devisList);
    }
  }
};

// Messages Service
export const messageService = {
  async getAll(): Promise<Message[]> {
    if (isFirebaseAvailable()) {
      try {
        const querySnapshot = await getDocs(collection(db, 'messages'));
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Message[];
      } catch (error) {
        console.error('Error fetching messages from Firebase:', error);
        return getLocalStorageData('messages');
      }
    }
    return getLocalStorageData('messages');
  },

  async create(message: Omit<Message, 'id' | 'createdAt'>): Promise<Message> {
    const newMessage = {
      ...message,
      status: 'unread' as const,
      createdAt: new Date(),
    };

    if (isFirebaseAvailable()) {
      try {
        const docRef = await addDoc(collection(db, 'messages'), {
          ...newMessage,
          createdAt: Timestamp.fromDate(newMessage.createdAt),
        });
        return { id: docRef.id, ...newMessage };
      } catch (error) {
        console.error('Error creating message in Firebase:', error);
        // Fallback to localStorage
      }
    }

    // localStorage fallback
    const messages = getLocalStorageData('messages');
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const createdMessage = { id, ...newMessage };
    messages.push(createdMessage);
    setLocalStorageData('messages', messages);
    return createdMessage;
  },

  async updateStatus(id: string, status: Message['status']): Promise<void> {
    if (isFirebaseAvailable()) {
      try {
        const docRef = doc(db, 'messages', id);
        await updateDoc(docRef, { status });
        return;
      } catch (error) {
        console.error('Error updating message in Firebase:', error);
        // Fallback to localStorage
      }
    }

    // localStorage fallback
    const messages = getLocalStorageData('messages');
    const index = messages.findIndex((message: Message) => message.id === id);
    if (index !== -1) {
      messages[index].status = status;
      setLocalStorageData('messages', messages);
    }
  }
};
