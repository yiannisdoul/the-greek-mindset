'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export function AdminRouteGuard({ children, requiredPermission }: AdminRouteGuardProps) {
  const { isAuthenticated, hasPermission, isLoading, adminUser } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/admin/login');
        return;
      }

      if (requiredPermission && !hasPermission(requiredPermission)) {
        router.push('/admin?error=insufficient_permissions');
        return;
      }
    }
  }, [isAuthenticated, isLoading, hasPermission, requiredPermission, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-greek-gold to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Verifying Access</h2>
          <p className="text-gray-500">Please wait...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this area. Required permission: {requiredPermission}
          </p>
          <p className="text-sm text-gray-500">
            Logged in as: {adminUser?.email} ({adminUser?.role})
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}