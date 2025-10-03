'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Filter, 
  Search, 
  Star,
  ArrowRight,
  SlidersHorizontal,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { FoodTruck } from '@/types';
import QuoteForm from '@/components/QuoteForm';
import { useFoodTrucks } from '@/hooks/useFoodTrucks';

export default function Marketplace() {
  const { trucks, loading, error } = useFoodTrucks();
  const [filteredTrucks, setFilteredTrucks] = useState<FoodTruck[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<FoodTruck | null>(null);

  const categories = [
    { value: 'all', label: 'Tous' },
    { value: 'vintage', label: 'Vintage Food-Trucks' },
    { value: 'food-trucks', label: 'Food Trucks' },
    { value: 'kiosque', label: 'Kiosque' },
    { value: 'conteneur', label: 'Conteneur' },
    { value: 'remorque', label: 'Remorque' },
    { value: 'modulaire', label: 'Modulaire' },
    { value: 'mobile-chef', label: 'Mobile chef' },
    { value: 'charrette', label: 'Charrette' }
  ];

  // Filter trucks based on search and filters
  useEffect(() => {
    if (!trucks) return;
    
    let filtered = trucks; // Show all trucks (no active field in FoodTruck type)

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(truck =>
        truck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        truck.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(truck => truck.category === selectedCategory);
    }

    setFilteredTrucks(filtered);
  }, [trucks, searchTerm, selectedCategory]);

  const handleRequestQuote = (truck: FoodTruck) => {
    setSelectedTruck(truck);
    setShowQuoteForm(true);
  };

  const getCategoryLabel = (category: string) => {
    const categoryObj = categories.find(cat => cat.value === category);
    return categoryObj ? categoryObj.label : category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-teal-600" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Chargement des Food Trucks...
            </h2>
            <p className="text-slate-600 dark:text-gray-300">
              Veuillez patienter pendant que nous récupérons nos modèles.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Erreur de chargement
            </h2>
            <p className="text-slate-600 dark:text-gray-300 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nos Food Trucks
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-teal-100 max-w-3xl mx-auto">
              Découvrez notre collection de food trucks sur mesure, conçus pour répondre à tous vos besoins culinaires.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#trucks"
                className="inline-flex items-center px-8 py-4 bg-white text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
              >
                Voir les Modèles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors"
              >
                Demander un Devis
                <FileText className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un food truck..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 lg:hidden"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Trucks Grid */}
      <div id="trucks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredTrucks.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Aucun food truck trouvé
            </h3>
            <p className="text-slate-600 dark:text-gray-300 mb-6">
              {searchTerm || selectedCategory !== 'all'
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Aucun food truck disponible pour le moment.'}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <FileText className="h-5 w-5 mr-2" />
              Demander un Devis Personnalisé
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrucks.map((truck, index) => (
              <motion.div
                key={truck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-48 bg-slate-200 dark:bg-slate-700">
                  {truck.images && truck.images.length > 0 ? (
                    <img
                      src={truck.images[0]}
                      alt={truck.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Truck className="h-16 w-16 text-slate-400" />
                    </div>
                  )}
                  {truck.isFeatured && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        En vedette
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-teal-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {getCategoryLabel(truck.category)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {truck.name}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {truck.description}
                  </p>

                  {/* Specifications */}
                  {truck.specifications && (
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {truck.specifications.dimensions && (
                          <div>
                            <span className="font-medium text-slate-900 dark:text-white">Dimensions:</span>
                            <p className="text-slate-600 dark:text-gray-300">{truck.specifications.dimensions}</p>
                          </div>
                        )}
                        {truck.specifications.capacity && (
                          <div>
                            <span className="font-medium text-slate-900 dark:text-white">Capacité:</span>
                            <p className="text-slate-600 dark:text-gray-300">{truck.specifications.capacity}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Equipment */}
                  {truck.equipment && truck.equipment.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Équipements:</h4>
                      <div className="flex flex-wrap gap-1">
                        {truck.equipment.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                          >
                            {item}
                          </span>
                        ))}
                        {truck.equipment.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            +{truck.equipment.length - 3} autres
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Link
                      href={`/marketplace/${truck.id}`}
                      className="flex-1 text-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Voir Détails
                    </Link>
                    <button
                      onClick={() => handleRequestQuote(truck)}
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Demander Devis
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Vous ne trouvez pas votre bonheur ?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Nous créons des food trucks sur mesure selon vos besoins spécifiques. Contactez-nous pour discuter de votre projet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
              >
                <FileText className="mr-2 h-5 w-5" />
                Demander un Devis Personnalisé
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors"
              >
                En Savoir Plus
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quote Form Modal */}
      <QuoteForm
        isOpen={showQuoteForm}
        onClose={() => {
          setShowQuoteForm(false);
          setSelectedTruck(null);
        }}
        truck={selectedTruck}
      />
    </div>
  );
}