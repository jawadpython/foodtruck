import { useState, useEffect, useCallback } from 'react';
import { ErrorHandler } from '@/lib/errorHandler';

interface DataState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasData: boolean;
}

interface UseDataStateOptions {
  autoLoad?: boolean;
  onError?: (error: string) => void;
  onSuccess?: (data: unknown[]) => void;
}

export function useDataState<T>(
  service: {
    getAll: () => Promise<T[]>;
    create?: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => Promise<T>;
    update?: (id: string, updates: Partial<T>) => Promise<void>;
    delete?: (id: string) => Promise<void>;
  },
  options: UseDataStateOptions = {}
) {
  const { autoLoad = true, onError, onSuccess } = options;
  
  const [state, setState] = useState<DataState<T>>({
    data: [],
    loading: false,
    error: null,
    hasData: false,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
    if (error && onError) {
      onError(error);
    }
  }, [onError]);

  const setData = useCallback((data: T[]) => {
    setState(prev => ({ 
      ...prev, 
      data, 
      hasData: data.length > 0,
      error: null 
    }));
    if (onSuccess) {
      onSuccess(data as unknown[]);
    }
  }, [onSuccess]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await service.getAll();
      setData(data);
    } catch (error) {
      const errorMessage = ErrorHandler.getErrorMessage(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [service, setLoading, setError, setData]);

  const createItem = useCallback(async (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!service.create) {
      throw new Error('Create method not available');
    }

    setLoading(true);
    setError(null);
    
    try {
      const newItem = await service.create(item);
      setState(prev => ({
        ...prev,
        data: [...prev.data, newItem],
        hasData: true,
        error: null
      }));
      return newItem;
    } catch (error) {
      const errorMessage = ErrorHandler.getErrorMessage(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [service, setLoading, setError]);

  const updateItem = useCallback(async (id: string, updates: Partial<T>) => {
    if (!service.update) {
      throw new Error('Update method not available');
    }

    setLoading(true);
    setError(null);
    
    try {
      await service.update(id, updates);
      setState(prev => ({
        ...prev,
        data: prev.data.map(item => 
          (item as Record<string, unknown>).id === id 
            ? { ...item, ...updates, updatedAt: new Date() }
            : item
        ),
        error: null
      }));
    } catch (error) {
      const errorMessage = ErrorHandler.getErrorMessage(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [service, setLoading, setError]);

  const deleteItem = useCallback(async (id: string) => {
    if (!service.delete) {
      throw new Error('Delete method not available');
    }

    setLoading(true);
    setError(null);
    
    try {
      await service.delete(id);
      setState(prev => ({
        ...prev,
        data: prev.data.filter(item => (item as Record<string, unknown>).id !== id),
        hasData: prev.data.length > 1,
        error: null
      }));
    } catch (error) {
      const errorMessage = ErrorHandler.getErrorMessage(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [service, setLoading, setError]);

  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  // Auto-load data on mount
  useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, [autoLoad, loadData]);

  return {
    ...state,
    loadData,
    createItem,
    updateItem,
    deleteItem,
    refresh,
    clearError,
  };
}

// Specialized hooks for different data types
export function useFoodTrucks(options?: UseDataStateOptions) {
  return useDataState(
    {
      getAll: async () => {
        const { foodTruckService } = await import('@/lib/dataService');
        return foodTruckService.getAll();
      },
      create: async (item) => {
        const { foodTruckService } = await import('@/lib/dataService');
        return foodTruckService.create(item);
      },
      update: async (id, updates) => {
        const { foodTruckService } = await import('@/lib/dataService');
        return foodTruckService.update(id, updates);
      },
      delete: async (id) => {
        const { foodTruckService } = await import('@/lib/dataService');
        return foodTruckService.delete(id);
      },
    },
    options
  );
}

export function useOrders(options?: UseDataStateOptions) {
  return useDataState(
    {
      getAll: async () => {
        const { orderService } = await import('@/lib/dataService');
        return orderService.getAll();
      },
      update: async (id, updates) => {
        const { orderService } = await import('@/lib/dataService');
        if (updates.status) {
          return orderService.updateStatus(id, updates.status as any);
        }
      },
    },
    options
  );
}

export function useDevis(options?: UseDataStateOptions) {
  return useDataState(
    {
      getAll: async () => {
        const { devisService } = await import('@/lib/dataService');
        return devisService.getAll();
      },
      create: async (item) => {
        const { devisService } = await import('@/lib/dataService');
        return devisService.create(item);
      },
      update: async (id, updates) => {
        const { devisService } = await import('@/lib/dataService');
        return devisService.update(id, updates);
      },
    },
    options
  );
}

export function useMessages(options?: UseDataStateOptions) {
  return useDataState(
    {
      getAll: async () => {
        const { messageService } = await import('@/lib/dataService');
        return messageService.getAll();
      },
      create: async (item) => {
        const { messageService } = await import('@/lib/dataService');
        return messageService.create(item);
      },
      update: async (id, updates) => {
        const { messageService } = await import('@/lib/dataService');
        if (updates.status) {
          return messageService.updateStatus(id, updates.status as any);
        }
      },
    },
    options
  );
}
