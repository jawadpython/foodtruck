'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Star,
  MoreHorizontal,
  X,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { FoodTruck } from '@/types';
import TruckForm from '@/components/admin/TruckForm';
import Notification from '@/components/admin/Notification';
import { useFoodTrucks } from '@/hooks/useFoodTrucks';

export default function AdminProducts() {
  const { trucks, loading, error, createTruck, updateTruck, deleteTruck } = useFoodTrucks();
  const [filteredTrucks, setFilteredTrucks] = useState<FoodTruck[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTruck, setEditingTruck] = useState<FoodTruck | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    isVisible: boolean;
  }>({
    type: 'success',
    message: '',
    isVisible: false
  });

  // Show error notification if there's an error loading trucks
  useEffect(() => {
    if (error) {
      showNotification('error', error);
    }
  }, [error]);

  // Filter trucks based on search and category
  useEffect(() => {
    let filtered = trucks;

    if (searchTerm) {
      filtered = filtered.filter(truck =>
        truck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        truck.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(truck => truck.category === selectedCategory);
    }

    setFilteredTrucks(filtered);
  }, [trucks, searchTerm, selectedCategory]);

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'vintage', label: 'Vintage Food-Trucks' },
    { value: 'food-trucks', label: 'Food Trucks' },
    { value: 'kiosque', label: 'Kiosque' },
    { value: 'conteneur', label: 'Conteneur' },
    { value: 'remorque', label: 'Remorque' },
    { value: 'modulaire', label: 'Modulaire' },
    { value: 'mobile-chef', label: 'Mobile chef' },
    { value: 'charrette', label: 'Charrette' }
  ];

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message, isVisible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 5000);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingTruck(null);
  };

  const handleEditTruck = (truck: FoodTruck) => {
    setEditingTruck(truck);
    setShowAddModal(true);
  };

  const handleSaveTruck = async (truckData: Omit<FoodTruck, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      if (editingTruck) {
        // Update existing truck
        await updateTruck(editingTruck.id, truckData);
        showNotification('success', 'Food truck mis à jour avec succès !');
      } else {
        // Create new truck
        await createTruck(truckData);
        showNotification('success', 'Food truck créé avec succès !');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving truck:', error);
      showNotification('error', 'Erreur lors de la sauvegarde du food truck');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTruck = async (truckId: string) => {
    setIsSubmitting(true);
    try {
      await deleteTruck(truckId);
      showNotification('success', 'Food truck supprimé avec succès !');
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error deleting truck:', error);
      showNotification('error', 'Erreur lors de la suppression du food truck');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFeatured = async (truck: FoodTruck) => {
    try {
      await updateTruck(truck.id, { isFeatured: !truck.isFeatured });
      showNotification('success', `Food truck ${!truck.isFeatured ? 'mis en avant' : 'retiré des favoris'} !`);
    } catch (error) {
      console.error('Error toggling featured:', error);
      showNotification('error', 'Erreur lors de la mise à jour');
    }
  };

  const getStatusColor = (truck: FoodTruck) => {
    if (!truck.isActive) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    if (truck.isFeatured) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
  };

  const getStatusLabel = (truck: FoodTruck) => {
    if (!truck.isActive) return 'Inactif';
    if (truck.isFeatured) return 'En vedette';
    return 'Actif';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-300">Chargement des food trucks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestion des Food Trucks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez votre catalogue de food trucks
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Ajouter un Food Truck</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{trucks.length}</p>
            </div>
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">En vedette</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {trucks.filter(t => t.isFeatured).length}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Actifs</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {trucks.filter(t => t.isActive).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Catégories</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {new Set(trucks.map(t => t.category)).size}
              </p>
            </div>
            <Filter className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un food truck..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Trucks Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Food Truck
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Créé le
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTrucks.map((truck) => (
                <tr key={truck.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {truck.images && truck.images.length > 0 ? (
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={truck.images[0]}
                            alt={truck.name}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <Truck className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {truck.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {truck.description.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {truck.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(truck)}`}>
                      {getStatusLabel(truck)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {(() => {
                      const date = new Date(truck.createdAt);
                      return isNaN(date.getTime()) ? 'Date invalide' : date.toLocaleDateString('fr-FR');
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          const url = `/marketplace/${truck.id}`;
                          const newWindow = window.open(url, '_blank');
                          if (!newWindow) {
                            alert('Impossible d\'ouvrir la page. Veuillez vérifier que les pop-ups ne sont pas bloqués.');
                          }
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Voir Détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(truck)}
                        className={`p-2 rounded-lg transition-colors ${
                          truck.isFeatured
                            ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                            : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        title={truck.isFeatured ? 'Retirer des favoris' : 'Mettre en vedette'}
                      >
                        <Star className={`h-4 w-4 ${truck.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleEditTruck(truck)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(truck.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTrucks.length === 0 && (
          <div className="text-center py-12">
            <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun food truck trouvé
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || selectedCategory !== 'all'
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Commencez par ajouter votre premier food truck.'}
            </p>
            {(!searchTerm && selectedCategory === 'all') && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un Food Truck
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {/* Restore original TruckForm */}
      <TruckForm
        isOpen={showAddModal}
        onClose={handleCloseModal}
        truck={editingTruck}
        onSave={handleSaveTruck}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirmer la suppression
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer ce food truck ? Cette action est irréversible.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteTruck(showDeleteModal)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Suppression...
                  </>
                ) : (
                  'Supprimer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
      />
    </div>
  );
}