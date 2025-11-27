'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  LogOut, 
  Menu, 
  X,
  History,
  MapPin,
  Star,
  BookOpen,
  Home,
  Users,
  Settings,
  Dumbbell,
  Music,
  ChefHat,
  FileText
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Content Manager', href: '/admin/content', icon: FileText },
  { name: 'History', href: '/admin/history', icon: History },
  { name: 'Geography', href: '/admin/geography', icon: MapPin },
  { name: 'Mythology', href: '/admin/mythology', icon: Star },
  { name: 'Philosophy', href: '/admin/philosophy', icon: BookOpen },
  { name: 'Exercises', href: '/admin/exercises', icon: Dumbbell },
  { name: 'Greek Dancing', href: '/admin/dances', icon: Music },
  { name: 'Greek Cooking', href: '/admin/recipes', icon: ChefHat },
];

const adminNavigation = [
  { name: 'Users', href: '/admin/users', icon: Users, permission: 'users.manage' },
  { name: 'Settings', href: '/admin/settings', icon: Settings, permission: 'settings.manage' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { adminUser, logout, hasPermission } = useAdminAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        className={`
          w-64 bg-white shadow-lg
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out
          lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-greek-blue to-blue-700">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-white" />
            <span className="text-white font-bold text-lg">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* Main Navigation */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Content Management
            </h3>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-greek-gold text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Admin Navigation */}
          {adminNavigation.some(item => hasPermission(item.permission)) && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Administration
              </h3>
              {adminNavigation.map((item) => {
                if (!hasPermission(item.permission)) return null;
                
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-greek-gold text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-greek-gold to-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {adminUser?.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {adminUser?.email}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {adminUser?.role}
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-col min-h-screen lg:ml-64">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-800"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-greek-blue transition-colors"
            >
              View Site
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}