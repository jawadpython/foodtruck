'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Truck,
  FileText,
  MessageSquare,
  TrendingUp,
  Users,
  Eye,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { FoodTruck, Devis, Message } from '@/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTrucks: 0,
    totalDevis: 0,
    totalMessages: 0,
    pendingDevis: 0,
    unreadMessages: 0
  });

  const [recentDevis, setRecentDevis] = useState<Devis[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);

  // Load real data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load all data in parallel from API endpoints
        const [trucksResponse, devisResponse, messagesResponse] = await Promise.all([
          fetch('/api/foodtrucks'),
          fetch('/api/devis'),
          fetch('/api/messages')
        ]);

        const [trucksResult, devisResult, messagesResult] = await Promise.all([
          trucksResponse.json(),
          devisResponse.json(),
          messagesResponse.json()
        ]);

        const trucks = trucksResult.data || [];
        const devis = devisResult.data || [];
        const messages = messagesResult.data || [];

        // Calculate stats
        const pendingDevis = devis.filter(d => d.status === 'pending').length;
        const unreadMessages = messages.filter(m => m.status === 'unread').length;

        setStats({
          totalTrucks: trucks.length,
          totalDevis: devis.length,
          totalMessages: messages.length,
          pendingDevis,
          unreadMessages
        });

        // Get recent devis (last 5)
        const recentDevisData = devis
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        setRecentDevis(recentDevisData);

        // Get recent messages (last 5)
        const recentMessagesData = messages
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        setRecentMessages(recentMessagesData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set default values on error
        setStats({
          totalTrucks: 0,
          totalDevis: 0,
          totalMessages: 0,
          pendingDevis: 0,
          unreadMessages: 0
        });
        setRecentDevis([]);
        setRecentMessages([]);
      }
    };

    loadDashboardData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(dateObj);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'delivered':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'unread':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'read':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmé';
      case 'delivered':
        return 'Livré';
      case 'cancelled':
        return 'Annulé';
      case 'unread':
        return 'Non lu';
      case 'read':
        return 'Lu';
      default:
        return status;
    }
  };

  const statCards = [
    {
      title: 'Food Trucks',
      value: stats.totalTrucks,
      icon: <Truck className="h-6 w-6" />,
      color: 'bg-blue-500',
      change: '+2 ce mois'
    },
    {
      title: 'Devis',
      value: stats.totalDevis,
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-yellow-500',
      change: '+3 aujourd\'hui'
    },
    {
      title: 'Messages',
      value: stats.totalMessages,
      icon: <MessageSquare className="h-6 w-6" />,
      color: 'bg-purple-500',
      change: '+8 cette semaine'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Tableau de Bord
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Vue d'ensemble de votre activité
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            <Eye className="h-4 w-4" />
            <span>Voir le site</span>
          </button>
          <Link
            href="/admin/products"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Food Truck</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const isClickable = stat.title === 'Food Trucks';
          const CardContent = () => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg ${
                isClickable ? 'cursor-pointer hover:shadow-xl transition-shadow duration-200' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          );

          return isClickable ? (
            <Link key={index} href="/admin/products">
              <CardContent />
            </Link>
          ) : (
            <CardContent key={index} />
          );
        })}
      </div>

      {/* Revenue and Pending Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Activité
            </h2>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300">Demandes de devis</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalDevis}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300">Ce mois</span>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                +{Math.floor(Math.random() * 10) + 5}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Actions Requises
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Devis en attente
                </span>
              </div>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {stats.pendingDevis}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Messages non lus
                </span>
              </div>
              <span className="text-lg font-bold text-red-600 dark:text-red-400">
                {stats.unreadMessages}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Devis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Devis Récents
            </h2>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            {recentDevis.map((devis) => (
              <div key={devis.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {devis.customerName}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {devis.truckName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(devis.createdAt)}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(devis.status)}`}>
                  {getStatusLabel(devis.status)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Messages Récents
            </h2>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            {recentMessages.map((message) => (
              <div key={message.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {message.name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {message.subject}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(message.createdAt)}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                  {getStatusLabel(message.status)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
