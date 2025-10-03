'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Users, 
  Award, 
  Target,
  Heart,
  Lightbulb,
  Shield,
  Clock
} from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Passion",
      description: "Nous sommes passionnés par la création de solutions culinaires mobiles qui transforment les rêves en réalité."
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Innovation",
      description: "Nous intégrons les dernières technologies et tendances pour créer des food trucks modernes et efficaces."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Qualité",
      description: "Chaque food truck est construit avec des matériaux de première qualité et une attention aux détails."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Ponctualité",
      description: "Nous respectons nos délais de livraison et nous engageons à vous livrer votre food truck dans les temps."
    }
  ];

  const team = [
    {
      name: "Ahmed Benali",
      role: "Fondateur & CEO",
      description: "Ingénieur mécanique avec 15 ans d'expérience dans l'industrie automobile et la construction mobile.",
      image: "/team/ahmed.jpg"
    },
    {
      name: "Fatima Zahra",
      role: "Directrice Technique",
      description: "Spécialiste en design industriel et optimisation d'espace, elle supervise tous nos projets de conception.",
      image: "/team/fatima.jpg"
    },
    {
      name: "Youssef Alami",
      role: "Responsable Production",
      description: "Maître artisan avec une expertise approfondie dans la construction de véhicules commerciaux.",
      image: "/team/youssef.jpg"
    },
    {
      name: "Aicha Mansouri",
      role: "Responsable Clientèle",
      description: "Experte en service client, elle accompagne nos clients tout au long de leur projet.",
      image: "/team/aicha.jpg"
    }
  ];

  const milestones = [
    {
      year: "2019",
      title: "Fondation de l'entreprise",
      description: "Création de Food Trucks Maroc avec une vision claire : démocratiser la restauration mobile au Maroc."
    },
    {
      year: "2020",
      title: "Premier food truck livré",
      description: "Livraison de notre premier food truck personnalisé, marquant le début de notre aventure."
    },
    {
      year: "2021",
      title: "Expansion de l'équipe",
      description: "Recrutement de spécialistes techniques et ouverture de notre atelier de production."
    },
    {
      year: "2022",
      title: "50 food trucks livrés",
      description: "Atteinte du cap des 50 food trucks livrés avec 100% de satisfaction client."
    },
    {
      year: "2023",
      title: "Innovation technologique",
      description: "Intégration de nouvelles technologies : panneaux solaires, systèmes de paiement électronique."
    },
    {
      year: "2024",
      title: "Leader du marché",
      description: "Devenu le leader incontesté de la construction de food trucks au Maroc."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-teal-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              À Propos de Nous
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Depuis 2019, nous transformons les rêves culinaires en réalité mobile. 
              Découvrez notre histoire, nos valeurs et l'équipe qui fait de Food Trucks Maroc 
              le leader de la construction de food trucks au Maroc.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Notre Histoire
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Tout a commencé en 2019 avec une vision simple : démocratiser la restauration mobile 
                  au Maroc en offrant des solutions de qualité accessibles à tous les entrepreneurs culinaires.
                </p>
                <p>
                  Fondée par Ahmed Benali, un ingénieur passionné par l'innovation mobile, notre entreprise 
                  s'est rapidement imposée comme la référence dans la construction de food trucks sur mesure.
                </p>
                <p>
                  Aujourd'hui, avec plus de 50 food trucks livrés et une équipe de 20 professionnels, 
                  nous continuons d'innover pour offrir des solutions toujours plus performantes et adaptées 
                  aux besoins de nos clients.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-800 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-center h-96">
                  <Truck className="h-32 w-32 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
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
              Nos Valeurs
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Les principes qui guident notre travail et notre relation avec nos clients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full text-teal-600 dark:text-teal-400 mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
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
              Notre Équipe
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Des professionnels passionnés qui partagent votre vision du succès
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-16 w-16 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-teal-600 dark:text-teal-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
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
              Notre Parcours
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Les étapes clés qui ont marqué notre croissance et notre succès
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-teal-200 dark:bg-teal-800"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg">
                      <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-8 h-8 bg-teal-600 dark:bg-teal-400 rounded-full border-4 border-white dark:border-slate-800 z-10"></div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-teal-600 dark:bg-teal-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-lg text-teal-100">Food Trucks Livrés</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
              <div className="text-lg text-teal-100">Satisfaction Client</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">5+</div>
              <div className="text-lg text-teal-100">Années d'Expérience</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">20+</div>
              <div className="text-lg text-teal-100">Professionnels</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Prêt à Rejoindre Notre Aventure ?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Découvrez comment nous pouvons transformer votre vision culinaire en réalité mobile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/marketplace"
                className="inline-flex items-center px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300 font-semibold"
              >
                <span>Voir Nos Modèles</span>
                <Truck className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 border-2 border-teal-600 text-teal-600 dark:text-teal-400 rounded-lg hover:bg-teal-600 hover:text-white transition-colors duration-300 font-semibold"
              >
                <span>Nous Contacter</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
