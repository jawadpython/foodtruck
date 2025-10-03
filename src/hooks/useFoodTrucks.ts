import { useState, useEffect, useCallback } from 'react';
import { FoodTruck } from '@/types';

interface UseFoodTrucksReturn {
  trucks: FoodTruck[];
  loading: boolean;
  error: string | null;
  createTruck: (truck: Omit<FoodTruck, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FoodTruck>;
  updateTruck: (id: string, truck: Partial<FoodTruck>) => Promise<FoodTruck>;
  deleteTruck: (id: string) => Promise<void>;
  refreshTrucks: () => Promise<void>;
}

export function useFoodTrucks(): UseFoodTrucksReturn {
  const [trucks, setTrucks] = useState<FoodTruck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrucks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/foodtrucks');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch food trucks');
      }
      
      setTrucks(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching food trucks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTruck = useCallback(async (truckData: Omit<FoodTruck, 'id' | 'createdAt' | 'updatedAt'>): Promise<FoodTruck> => {
    try {
      setError(null);
      
      const response = await fetch('/api/foodtrucks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(truckData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create food truck');
      }
      
      // Add the new truck to the list
      setTrucks(prev => [...prev, result.data]);
      
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create food truck';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateTruck = useCallback(async (id: string, truckData: Partial<FoodTruck>): Promise<FoodTruck> => {
    try {
      setError(null);
      
      const response = await fetch(`/api/foodtrucks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(truckData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update food truck');
      }
      
      // Update the truck in the list
      setTrucks(prev => prev.map(truck => 
        truck.id === id ? result.data : truck
      ));
      
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update food truck';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteTruck = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      
      const response = await fetch(`/api/foodtrucks/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete food truck');
      }
      
      // Remove the truck from the list
      setTrucks(prev => prev.filter(truck => truck.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete food truck';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const refreshTrucks = useCallback(async () => {
    await fetchTrucks();
  }, [fetchTrucks]);

  useEffect(() => {
    fetchTrucks();
  }, [fetchTrucks]);

  return {
    trucks,
    loading,
    error,
    createTruck,
    updateTruck,
    deleteTruck,
    refreshTrucks,
  };
}
