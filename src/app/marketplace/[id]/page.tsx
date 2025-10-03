'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Truck, 
  ArrowLeft,
  Star,
  CheckCircle,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { FoodTruck } from '@/types';
import QuoteForm from '@/components/QuoteForm';

export default function ProductDetail() {
  const params = useParams();
  const [truck, setTruck] = useState<FoodTruck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  // Fetch truck data from API
  useEffect(() => {
    const fetchTruck = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/foodtrucks/${params.id}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch food truck');
        }
        
        // Check if truck exists and is available
        if (!result.data) {
          throw new Error('Food Truck introuvable');
        }
        
        setTruck(result.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching truck:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTruck();
    }
  }, [params.id]);

  const handleRequestQuote = () => {
    setShowQuoteForm(true);
  };

  const nextImage = () => {
    if (truck?.images && truck.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === truck.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (truck?.images && truck.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? truck.images!.length - 1 : prev - 1
      );
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'vintage': 'Vintage Food-Trucks',
      'food-trucks': 'Food Trucks',
      'kiosque': 'Kiosque',
      'conteneur': 'Conteneur',
      'remorque': 'Remorque',
      'modulaire': 'Modulaire',
      'mobile-chef': 'Mobile chef',
      'charrette': 'Charrette'
    };
    return categories[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-teal-600" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Chargement du Food Truck...
            </h2>
            <p className="text-slate-600 dark:text-gray-300">
              Veuillez patienter pendant que nous récupérons les détails.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !truck) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Food Truck introuvable
            </h2>
            <p className="text-slate-600 dark:text-gray-300 mb-6">
              {error || 'Ce food truck n\'existe pas ou n\'est plus disponible.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/marketplace"
                className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour aux Food Trucks
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <FileText className="h-5 w-5 mr-2" />
                Demander un Devis Personnalisé
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/marketplace"
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-gray-200"
            >
              Food Trucks
            </Link>
            <ArrowRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-medium">
              {truck.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg"
            >
              {truck.images && truck.images.length > 0 ? (
                <>
                  <img
                    src={truck.images[currentImageIndex]}
                    alt={truck.name}
                    className="w-full h-96 object-cover"
                  />
                  {truck.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {truck.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                              index === currentImageIndex
                                ? 'bg-white'
                                : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-96 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <Truck className="h-24 w-24 text-slate-400" />
                </div>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            {truck.images && truck.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {truck.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-blue-600'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${truck.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-teal-100 dark:bg-teal-900/20 text-teal-800 dark:text-teal-400 px-3 py-1 rounded-full text-sm font-semibold">
                  {getCategoryLabel(truck.category)}
                </span>
                {truck.isFeatured && (
                  <div className="flex items-center text-yellow-600">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="ml-1 text-sm font-medium">En vedette</span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                {truck.name}
              </h1>
              <p className="text-lg text-slate-600 dark:text-gray-300 leading-relaxed">
                {truck.description}
              </p>
            </div>

            {/* Specifications */}
            {truck.specifications && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Spécifications
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {truck.specifications.dimensions && (
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Dimensions</h3>
                      <p className="text-slate-600 dark:text-gray-300">{truck.specifications.dimensions}</p>
                    </div>
                  )}
                  {truck.specifications.capacity && (
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Capacité</h3>
                      <p className="text-slate-600 dark:text-gray-300">{truck.specifications.capacity}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Equipment */}
            {truck.equipment && truck.equipment.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Équipements Inclus
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {truck.equipment.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {truck.features && truck.features.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Fonctionnalités
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {truck.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <h2 className="text-xl font-semibold mb-2">Intéressé par ce modèle ?</h2>
              <p className="text-teal-100 mb-6">
                Contactez-nous pour obtenir un devis personnalisé et discuter de vos besoins spécifiques.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRequestQuote}
                  className="flex-1 bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors flex items-center justify-center"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Demander un Devis
                </button>
                <a
                  href="tel:+212XXXXXXXXX"
                  className="flex-1 bg-teal-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-900 transition-colors flex items-center justify-center"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Appeler
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Contact
              </h2>
              <div className="space-y-3">
                <a
                  href="mailto:contact@foodtrucks.ma"
                  className="flex items-center text-slate-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <Mail className="h-5 w-5 mr-3" />
                  contact@foodtrucks.ma
                </a>
                <a
                  href="tel:+212XXXXXXXXX"
                  className="flex items-center text-slate-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <Phone className="h-5 w-5 mr-3" />
                  +212 XXX XXX XXX
                </a>
                <a
                  href="https://wa.me/212XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-slate-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <MessageCircle className="h-5 w-5 mr-3" />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quote Form Modal */}
      <QuoteForm
        isOpen={showQuoteForm}
        onClose={() => setShowQuoteForm(false)}
        truck={truck}
      />
    </div>
  );
}