'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Mail,
  Phone
} from 'lucide-react';
import { Devis } from '@/types';

export default function AdminDevis() {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [filteredDevis, setFilteredDevis] = useState<Devis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDevis, setSelectedDevis] = useState<Devis | null>(null);

  // Load real data from API
  useEffect(() => {
    const loadDevis = async () => {
      try {
        const response = await fetch('/api/devis');
        if (response.ok) {
          const result = await response.json();
          setDevis(result.data);
          setFilteredDevis(result.data);
        } else {
          throw new Error('Failed to fetch devis');
        }
      } catch (error) {
        console.error('Error loading devis:', error);
        // Fallback to empty array if there's an error
        setDevis([]);
        setFilteredDevis([]);
      }
    };

    loadDevis();
  }, []);

  const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'quoted', label: 'Devis envoyé' },
    { value: 'accepted', label: 'Accepté' },
    { value: 'rejected', label: 'Rejeté' }
  ];

  useEffect(() => {
    let filtered = devis;

    if (searchTerm) {
      filtered = filtered.filter(devis =>
        devis.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        devis.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        devis.truckName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(devis => devis.status === selectedStatus);
    }

    setFilteredDevis(filtered);
  }, [devis, searchTerm, selectedStatus]);

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'quoted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'quoted':
        return 'Devis envoyé';
      case 'accepted':
        return 'Accepté';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const stats = [
    {
      title: 'Total Devis',
      value: devis.length,
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'En Attente',
      value: devis.filter(d => d.status === 'pending').length,
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-yellow-500'
    },
    {
      title: 'Devis Envoyés',
      value: devis.filter(d => d.status === 'quoted').length,
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Acceptés',
      value: devis.filter(d => d.status === 'accepted').length,
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Gestion des Devis
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Gérez les demandes de devis et suivez leur progression
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un devis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-64">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Devis Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900 dark:text-white">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900 dark:text-white">
                  Food Truck
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900 dark:text-white">
                  Montant
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900 dark:text-white">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900 dark:text-white">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-slate-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredDevis.map((devis) => (
                <tr key={devis.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {devis.customerName}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {devis.customerEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {devis.truckName}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {devis.quoteAmount ? (
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {formatPrice(devis.quoteAmount)}
                      </p>
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400">-</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(devis.status)}`}>
                      {getStatusLabel(devis.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {formatDate(devis.createdAt)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedDevis(devis)}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.open(`mailto:${devis.customerEmail}`)}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Envoyer un email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Devis Details Modal */}
      {selectedDevis && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Détails du Devis
              </h3>
              <button
                onClick={() => setSelectedDevis(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  Informations Client
                </h4>
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Nom:</span> {selectedDevis.customerName}</p>
                  <p><span className="font-medium">Email:</span> {selectedDevis.customerEmail}</p>
                  <p><span className="font-medium">Téléphone:</span> {selectedDevis.customerPhone}</p>
                </div>
              </div>

              {/* Devis Info */}
              <div>
                <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  Détails du Devis
                </h4>
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Food Truck:</span> {selectedDevis.truckName}</p>
                  <p><span className="font-medium">Statut:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDevis.status)}`}>
                      {getStatusLabel(selectedDevis.status)}
                    </span>
                  </p>
                  {selectedDevis.quoteAmount && (
                    <p><span className="font-medium">Montant:</span> 
                      <span className="ml-2 font-bold text-green-600 dark:text-green-400">
                        {formatPrice(selectedDevis.quoteAmount)}
                      </span>
                    </p>
                  )}
                  <p><span className="font-medium">Date de création:</span> {formatDate(selectedDevis.createdAt)}</p>
                </div>
              </div>

              {/* Message */}
              <div>
                <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  Message du Client
                </h4>
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                  <p className="text-slate-700 dark:text-slate-300">{selectedDevis.message}</p>
                </div>
              </div>

              {/* Quote Message */}
              {selectedDevis.quoteMessage && (
                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                    Message du Devis
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                    <p className="text-slate-700 dark:text-slate-300">{selectedDevis.quoteMessage}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div>
                <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  Actions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDevis.status === 'pending' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Créer un Devis
                    </button>
                  )}
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Envoyer par Email
                  </button>
                  <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                    Télécharger PDF
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
