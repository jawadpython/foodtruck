'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Message } from '@/types';

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Load real data from API
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        if (response.ok) {
          const result = await response.json();
          setMessages(result.data);
          setFilteredMessages(result.data);
        } else {
          throw new Error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        // Fallback to empty array if there's an error
        setMessages([]);
        setFilteredMessages([]);
      }
    };

    loadMessages();
  }, []);

  const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'unread', label: 'Non lu' },
    { value: 'read', label: 'Lu' },
    { value: 'replied', label: 'Répondu' }
  ];

  useEffect(() => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(message => message.status === selectedStatus);
    }

    setFilteredMessages(filtered);
  }, [messages, searchTerm, selectedStatus]);

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
      case 'unread':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'read':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'replied':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'unread':
        return 'Non lu';
      case 'read':
        return 'Lu';
      case 'replied':
        return 'Répondu';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread':
        return <Clock className="h-4 w-4" />;
      case 'read':
        return <CheckCircle className="h-4 w-4" />;
      case 'replied':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'read' }),
      });

      if (response.ok) {
        setMessages(messages.map(message => 
          message.id === id ? { ...message, status: 'read' as any } : message
        ));
        setFilteredMessages(filteredMessages.map(message => 
          message.id === id ? { ...message, status: 'read' as any } : message
        ));
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const markAsReplied = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'replied' }),
      });

      if (response.ok) {
        setMessages(messages.map(message => 
          message.id === id ? { ...message, status: 'replied' as any } : message
        ));
        setFilteredMessages(filteredMessages.map(message => 
          message.id === id ? { ...message, status: 'replied' as any } : message
        ));
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const stats = [
    {
      title: 'Total Messages',
      value: messages.length,
      icon: <MessageSquare className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Non Lus',
      value: messages.filter(m => m.status === 'unread').length,
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-red-500'
    },
    {
      title: 'Lus',
      value: messages.filter(m => m.status === 'read').length,
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Répondus',
      value: messages.filter(m => m.status === 'replied').length,
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
            Gestion des Messages
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Gérez les messages reçus via le formulaire de contact
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
                placeholder="Rechercher un message..."
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

      {/* Messages Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900 dark:text-white">
                  Expéditeur
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900 dark:text-white">
                  Sujet
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
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {message.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {message.email}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {message.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {message.subject}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-1">
                      {message.message}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(message.status)}`}>
                      {getStatusIcon(message.status)}
                      <span>{getStatusLabel(message.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {formatDate(message.createdAt)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMessage(message);
                          if (message.status === 'unread') {
                            markAsRead(message.id);
                          }
                        }}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.open(`mailto:${message.email}`)}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Envoyer un email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.open(`tel:${message.phone}`)}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Appeler"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Détails du Message
              </h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Sender Info */}
              <div>
                <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  Informations Expéditeur
                </h4>
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Nom:</span> {selectedMessage.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedMessage.email}</p>
                  <p><span className="font-medium">Téléphone:</span> {selectedMessage.phone}</p>
                </div>
              </div>

              {/* Message Info */}
              <div>
                <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  Détails du Message
                </h4>
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Sujet:</span> {selectedMessage.subject}</p>
                  <p><span className="font-medium">Statut:</span> 
                    <span className={`ml-2 inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMessage.status)}`}>
                      {getStatusIcon(selectedMessage.status)}
                      <span>{getStatusLabel(selectedMessage.status)}</span>
                    </span>
                  </p>
                  <p><span className="font-medium">Date:</span> {formatDate(selectedMessage.createdAt)}</p>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  Contenu du Message
                </h4>
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  Actions
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Répondre par Email
                  </button>
                  <button
                    onClick={() => window.open(`tel:${selectedMessage.phone}`)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Appeler
                  </button>
                  {selectedMessage.status !== 'replied' && (
                    <button
                      onClick={() => {
                        markAsReplied(selectedMessage.id);
                        setSelectedMessage(null);
                      }}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Marquer comme Répondu
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
