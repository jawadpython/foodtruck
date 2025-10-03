'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Save, 
  Plus, 
  Trash2,
  AlertCircle,
  CheckCircle,
  Check,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { FoodTruck } from '@/types';

interface TruckFormProps {
  isOpen: boolean;
  onClose: () => void;
  truck?: FoodTruck | null;
  onSave: (truck: Omit<FoodTruck, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isLoading?: boolean;
}

export default function TruckForm({ isOpen, onClose, truck, onSave, isLoading = false }: TruckFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: 'vintage' as string,
    featured: false,
    images: [] as string[],
    specifications: {
      dimensions: '',
      capacity: '',
      equipment: [] as string[],
      features: [] as string[]
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Available static images for each category
  const getAvailableImages = (category: string) => {
    const imageMap: Record<string, string[]> = {
      'vintage': ['/images/foodtrucks/vintage.svg'],
      'food-trucks': ['/images/foodtrucks/food-trucks.svg'],
      'kiosque': ['/images/foodtrucks/kiosque.svg'],
      'conteneur': ['/images/foodtrucks/conteneur.svg'],
      'remorque': ['/images/foodtrucks/remorque.svg'],
      'modulaire': ['/images/foodtrucks/modulaire.svg'],
      'mobile-chef': ['/images/foodtrucks/mobile-chef.svg'],
      'charrette': ['/images/foodtrucks/charrette.svg']
    };
    return imageMap[category] || [];
  };

  const categories = [
    { value: 'vintage', label: 'Vintage Food-Trucks' },
    { value: 'food-trucks', label: 'Food Trucks' },
    { value: 'kiosque', label: 'Kiosque' },
    { value: 'conteneur', label: 'Conteneur' },
    { value: 'remorque', label: 'Remorque' },
    { value: 'modulaire', label: 'Modulaire' },
    { value: 'mobile-chef', label: 'Mobile chef' },
    { value: 'charrette', label: 'Charrette' }
  ];

  useEffect(() => {
    if (truck) {
      setFormData({
        name: truck.name || '',
        description: truck.description || '',
        shortDescription: truck.shortDescription || '',
        category: truck.category || 'vintage',
        featured: truck.featured || false,
        images: Array.isArray(truck.images) ? truck.images : [],
        specifications: truck.specifications || {
          dimensions: '',
          capacity: '',
          equipment: [],
          features: []
        }
      });
    } else {
      // Reset form for new truck
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        category: 'vintage',
        featured: false,
        images: [],
        specifications: {
          dimensions: '',
          capacity: '',
          equipment: [],
          features: []
        }
      });
    }
    setErrors({});
  }, [truck, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Ensure formData properties exist and are strings
    const name = formData.name || '';
    const description = formData.description || '';
    const shortDescription = formData.shortDescription || '';

    if (!name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!shortDescription.trim()) {
      newErrors.shortDescription = 'La description courte est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving truck:', error);
    }
  };


  const removeImage = (index: number) => {
    const currentImages = formData.images || [];
    setFormData({
      ...formData,
      images: currentImages.filter((_, i) => i !== index)
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, upload: 'Type de fichier non supporté. Utilisez JPEG, PNG, WebP ou SVG.' });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrors({ ...errors, upload: 'Fichier trop volumineux. Taille maximale: 5MB.' });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrors({ ...errors, upload: '' });

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        // Add the uploaded image to the form data
        setFormData(prevFormData => ({
          ...prevFormData,
          images: [...(prevFormData.images || []), result.data.url]
        }));
        setUploadProgress(100);
      } else {
        console.error('Upload failed:', result);
        setErrors({ ...errors, upload: result.error || 'Erreur lors du téléchargement' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du téléchargement du fichier';
      setErrors({ ...errors, upload: errorMessage });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeUploadedImage = async (imageUrl: string, index: number) => {
    try {
      // Extract filename from URL
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await fetch(`/api/upload?fileName=${fileName}`, {
          method: 'DELETE',
        });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    // Remove from form data
    removeImage(index);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="truck-form-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 id="truck-form-title" className="text-2xl font-bold text-gray-900 dark:text-white">
            {truck ? 'Modifier le Food Truck' : 'Ajouter un Food Truck'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Fermer le formulaire"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du Food Truck *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Ex: Food Truck Moderne Premium"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category || 'vintage'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description courte *
            </label>
            <input
              type="text"
              value={formData.shortDescription || ''}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.shortDescription ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Description courte pour les cartes"
            />
            {errors.shortDescription && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.shortDescription}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description complète *
            </label>
            <textarea
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Description détaillée du food truck..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>


          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Images
            </label>
            
            {/* File Upload Section */}
            <div className="mb-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={isUploading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex flex-col items-center space-y-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Téléchargement en cours...</span>
                      {uploadProgress > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8" />
                      <div>
                        <span className="text-sm font-medium">Cliquez pour télécharger</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ou glissez-déposez une image ici
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          PNG, JPG, WebP, SVG jusqu'à 5MB
                        </p>
                      </div>
                    </>
                  )}
                </button>
              </div>
              {errors.upload && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.upload}
                </p>
              )}
            </div>

            {/* Image Selection */}
            <div className="mb-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Images prédéfinies pour {categories.find(c => c.value === formData.category)?.label}:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {getAvailableImages(formData.category).map((imagePath) => (
                    <button
                      key={imagePath}
                      type="button"
                      onClick={() => {
                        const currentImages = formData.images || [];
                        if (!currentImages.includes(imagePath)) {
                          setFormData({
                            ...formData,
                            images: [...currentImages, imagePath]
                          });
                        }
                      }}
                      disabled={(formData.images || []).includes(imagePath)}
                      className={`relative p-2 border rounded-lg transition-colors ${
                        (formData.images || []).includes(imagePath)
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                      }`}
                    >
                      <img
                        src={imagePath}
                        alt="Food truck"
                        className="w-full h-16 object-cover rounded"
                      />
                      {(formData.images || []).includes(imagePath) && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Images */}
            {(formData.images || []).length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Images sélectionnées ({(formData.images || []).length}):
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {(formData.images || []).map((image, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-shrink-0">
                        <img
                          src={image}
                          alt={`Food truck ${index + 1}`}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {image.split('/').pop()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {image.startsWith('/uploads/') ? 'Image téléchargée' : 'Image prédéfinie'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (image.startsWith('/uploads/')) {
                            removeUploadedImage(image, index);
                          } else {
                            removeImage(index);
                          }
                        }}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Supprimer cette image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Featured checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured || false}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mettre en vedette
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{truck ? 'Mettre à jour' : 'Créer'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}