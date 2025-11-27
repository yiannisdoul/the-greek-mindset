'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AdminRouteGuard } from '@/components/admin/AdminRouteGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useHistoryData } from '@/hooks/use-history-data';
import { useGeographyData } from '@/hooks/use-geography-data';
import { useMythologyData } from '@/hooks/use-mythology-data';
import { usePhilosophyData } from '@/hooks/use-philosophy-data';
import { HistoryItem, GeographyItem, MythologyItem, PhilosophyItem } from '@/types/admin';
import { 
  History,
  MapPin,
  Star,
  BookOpen,
  TrendingUp,
  Users,
  Eye,
  Edit3,
  Loader2
} from 'lucide-react';





export default function AdminDashboard() {
  const { adminUser } = useAdminAuth();
  
  // Fetch live data from all services
  const { data: historyItems, loading: historyLoading } = useHistoryData();
  const { items: geographyItems, loading: geographyLoading } = useGeographyData();
  const { items: mythologyItems, loading: mythologyLoading } = useMythologyData();
  const { items: philosophyItems, loading: philosophyLoading } = usePhilosophyData();

  const isLoading = historyLoading || geographyLoading || mythologyLoading || philosophyLoading;

  // Calculate live stats
  const stats = [
    {
      name: 'History Items',
      value: historyItems.length.toString(),
      change: `${historyItems.filter((item: HistoryItem) => item.featured).length} featured`,
      changeType: 'info' as const,
      icon: History,
      href: '/admin/history'
    },
    {
      name: 'Geography Locations',
      value: geographyItems.length.toString(),
      change: `${geographyItems.filter((item: GeographyItem) => item.featured).length} featured`,
      changeType: 'info' as const,
      icon: MapPin,
      href: '/admin/geography'
    },
    {
      name: 'Mythology Entries',
      value: mythologyItems.length.toString(),
      change: `${mythologyItems.filter((item: MythologyItem) => item.featured).length} featured`,
      changeType: 'info' as const,
      icon: Star,
      href: '/admin/mythology'
    },
    {
      name: 'Philosophy Concepts',
      value: philosophyItems.length.toString(),
      change: `${philosophyItems.filter((item: PhilosophyItem) => item.featured).length} featured`,
      changeType: 'info' as const,
      icon: BookOpen,
      href: '/admin/philosophy'
    },
  ];

  // Generate recent activity from the latest items
  const getItemTitle = (item: any, type: string) => {
    switch (type) {
      case 'history': return item.title;
      case 'geography': return item.name;
      case 'mythology': return item.name;
      case 'philosophy': return item.philosopher;
      default: return 'Unknown';
    }
  };

  const allItems = [
    ...historyItems.map((item: HistoryItem) => ({ ...item, type: 'history' as const, icon: History })),
    ...geographyItems.map((item: GeographyItem) => ({ ...item, type: 'geography' as const, icon: MapPin })),
    ...mythologyItems.map((item: MythologyItem) => ({ ...item, type: 'mythology' as const, icon: Star })),
    ...philosophyItems.map((item: PhilosophyItem) => ({ ...item, type: 'philosophy' as const, icon: BookOpen })),
  ]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
    .map((item, index) => ({
      id: index + 1,
      type: 'update',
      content: `Updated ${item.type}: "${getItemTitle(item, item.type)}"`,
      time: new Date(item.updatedAt).toLocaleDateString(),
      icon: item.icon
    }));

  return (
    <AdminRouteGuard>
      <AdminLayout>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {adminUser?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-600">
              Manage your Greek Mindset content from this dashboard.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all"
                onClick={() => window.location.href = stat.href}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center
                    ${index === 0 ? 'bg-red-100 text-red-600' :
                      index === 1 ? 'bg-blue-100 text-blue-600' :
                      index === 2 ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'}
                  `}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium text-gray-700">{stat.change}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  onClick={() => window.location.href = '/admin/history'}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                      <Edit3 className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-700">Add History Item</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </motion.button>

                <motion.button
                  whileHover={{ x: 5 }}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  onClick={() => window.location.href = '/admin/geography'}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <Edit3 className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-700">Add Geography Location</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </motion.button>

                <motion.button
                  whileHover={{ x: 5 }}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  onClick={() => window.location.href = '/admin/mythology'}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                      <Edit3 className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-700">Add Mythology Entry</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </motion.button>

                <motion.button
                  whileHover={{ x: 5 }}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  onClick={() => window.location.href = '/admin/philosophy'}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                      <Edit3 className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-700">Add Philosophy Concept</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </motion.button>

                <motion.button
                  whileHover={{ x: 5 }}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  onClick={() => window.location.href = '/admin/faq'}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                      <Edit3 className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-700">Manage FAQ Items</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {allItems.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      ${activity.type === 'create' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}
                    `}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.content}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </AdminLayout>
    </AdminRouteGuard>
  );
}