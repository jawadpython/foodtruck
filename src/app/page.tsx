'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Star, 
  Shield, 
  Wrench, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { FoodTruck } from '@/types';

export default function Home() {
  const [featuredTrucks, setFeaturedTrucks] = useState<FoodTruck[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured food trucks
  useEffect(() => {
    const fetchFeaturedTrucks = async () => {
      try {
        const response = await fetch('/api/foodtrucks');
        const result = await response.json();
        
        if (result.success && result.data) {
          // Get up to 3 featured trucks, or all trucks if less than 3
          const trucks = result.data.slice(0, 3);
          setFeaturedTrucks(trucks);
        }
      } catch (error) {
        console.error('Error fetching featured trucks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTrucks();
  }, []);

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

  const features = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Abordable",
      description: "Des solutions économiques adaptées à votre budget"
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Personnalisable",
      description: "Conception sur mesure selon vos besoins spécifiques"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Fabriqué au Maroc",
      description: "Qualité locale avec un service client exceptionnel"
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Benali",
      role: "Propriétaire de restaurant",
      content: "Excellent service et qualité remarquable. Mon food truck a dépassé toutes mes attentes.",
      rating: 5
    },
    {
      name: "Fatima Zahra",
      role: "Entrepreneure",
      content: "Équipe professionnelle et délais respectés. Je recommande vivement leurs services.",
      rating: 5
    },
    {
      name: "Youssef Alami",
      role: "Chef cuisinier",
      content: "Design moderne et fonctionnel. Parfait pour mon concept de cuisine de rue.",
      rating: 5
    }
  ];

  const stats = [
    { number: "50+", label: "Food Trucks Livrés" },
    { number: "100%", label: "Clients Satisfaits" },
    { number: "5+", label: "Années d'Expérience" },
    { number: "24/7", label: "Support Client" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
              Constructeur de
              <span className="text-teal-600 dark:text-teal-400 block">
                Food Trucks
              </span>
              au Maroc
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Créez votre entreprise culinaire mobile avec nos solutions sur mesure. 
              Qualité, innovation et service client exceptionnel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/marketplace"
                className="group inline-flex items-center px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="text-lg font-semibold">Découvrir nos Food Trucks</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 border-2 border-teal-600 text-teal-600 dark:text-teal-400 rounded-lg hover:bg-teal-600 hover:text-white transition-all duration-300"
              >
                <span className="text-lg font-semibold">Demander un Devis</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Pourquoi Choisir Nos Food Trucks ?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Nous offrons des solutions complètes pour votre entreprise culinaire mobile
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full text-teal-600 dark:text-teal-400 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-teal-600 dark:bg-teal-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-white"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-teal-100">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trucks Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Nos Food Trucks Vedettes
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Découvrez nos modèles les plus populaires
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
              <span className="ml-2 text-slate-600 dark:text-slate-300">Chargement des food trucks...</span>
            </div>
          ) : featuredTrucks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredTrucks.map((truck, index) => (
                <motion.div
                  key={truck.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="h-64 relative">
                    {truck.images && truck.images.length > 0 ? (
                      <img
                        src={truck.images[0]}
                        alt={truck.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-800 flex items-center justify-center">
                        <Truck className="h-24 w-24 text-teal-600 dark:text-teal-400" />
                      </div>
                    )}
                    {truck.featured && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Vedette
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400">
                        {getCategoryLabel(truck.category)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      {truck.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                      {truck.shortDescription || truck.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                        Sur demande
                      </span>
                      <Link
                        href={`/marketplace/${truck.id}`}
                        className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold"
                      >
                        Voir détails →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Truck className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Aucun food truck disponible
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Nos food trucks seront bientôt disponibles.
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/marketplace"
              className="inline-flex items-center px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300"
            >
              <span className="text-lg font-semibold">Voir Tous les Modèles</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Ce Que Disent Nos Clients
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Des témoignages authentiques de nos clients satisfaits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-700 dark:to-teal-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Prêt à Lancer Votre Food Truck ?
            </h2>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto">
              Contactez-nous dès aujourd'hui pour discuter de votre projet et obtenir un devis personnalisé.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-teal-600 rounded-lg hover:bg-slate-100 transition-colors duration-300 font-semibold"
              >
                <span className="text-lg">Demander un Devis Gratuit</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-teal-600 transition-colors duration-300 font-semibold"
              >
                <span className="text-lg">Voir Nos Modèles</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
