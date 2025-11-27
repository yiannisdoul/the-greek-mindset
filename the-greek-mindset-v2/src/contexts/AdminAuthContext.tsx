'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db as firestore } from '@/lib/firebase';
import { AdminUser } from '@/types/admin';

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({} as AdminAuthContextType);

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

// Admin email addresses - users with these emails get admin privileges
const ADMIN_EMAILS = [
  'admin@greekmindset.com',
  'support@greekmindset.com',
  // Add your actual admin email here
  'test@example.com', // Replace with your Firebase admin account email
  'your-email@example.com'
];

// Default admin permissions based on role
const getDefaultPermissions = (email: string): string[] => {
  if (email === 'admin@greekmindset.com') {
    return ['history.crud', 'geography.crud', 'mythology.crud', 'philosophy.crud', 'users.manage', 'admin.full'];
  }
  // Content admin permissions
  return ['history.crud', 'geography.crud', 'mythology.crud', 'philosophy.crud'];
};

const getAdminRole = (email: string): 'super-admin' | 'admin' => {
  if (email === 'admin@greekmindset.com') {
    return 'super-admin';
  }
  return 'admin';
};

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up admin auth state listener');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email || 'No user');
      setFirebaseUser(user);
      
      if (user) {
        console.log('Checking if user is admin:', user.email, 'Admin emails:', ADMIN_EMAILS);
        
        // Check if this user is an admin
        if (ADMIN_EMAILS.includes(user.email || '')) {
          console.log('User is in admin whitelist, creating/loading admin profile');
          
          try {
            const userDocRef = doc(firestore, 'admin_users', user.uid);
            const userDoc = await getDoc(userDocRef);
            
            let userData: AdminUser;
            
            if (userDoc.exists()) {
              console.log('Existing admin user found in Firestore');
              userData = {
                ...userDoc.data() as AdminUser,
                lastLogin: new Date().toISOString()
              };
              
              // Update last login
              await updateDoc(userDocRef, {
                lastLogin: new Date().toISOString()
              });
            } else {
              console.log('Creating new admin user document');
              // Create admin user document for first-time login
              userData = {
                id: user.uid,
                name: user.displayName || user.email?.split('@')[0] || 'Admin',
                email: user.email || '',
                role: getAdminRole(user.email || ''),
                permissions: getDefaultPermissions(user.email || ''),
                lastLogin: new Date().toISOString()
              };
              
              await setDoc(userDocRef, userData);
              console.log('Created new admin user:', userData);
            }
            
            setAdminUser(userData);
            console.log('Admin user set successfully:', userData);
          } catch (error) {
            console.error('Error loading admin user data:', error);
            console.log('Creating fallback admin user in auth listener...');
            
            // Create fallback admin user if Firestore fails
            const fallbackUserData: AdminUser = {
              id: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'Admin',
              email: user.email || '',
              role: getAdminRole(user.email || ''),
              permissions: getDefaultPermissions(user.email || ''),
              lastLogin: new Date().toISOString()
            };
            
            setAdminUser(fallbackUserData);
            console.log('Set fallback admin user in auth listener:', fallbackUserData);
          }
        } else {
          console.log('User email not in admin whitelist:', user.email);
          setAdminUser(null);
        }
      } else {
        console.log('No authenticated user, clearing admin state');
        setAdminUser(null);
      }
      
      setIsLoading(false);
      console.log('Auth state processing complete, isLoading set to false');
    });

    return () => {
      console.log('Cleaning up admin auth state listener');
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Login attempt for email:', email);
    console.log('Checking admin whitelist:', ADMIN_EMAILS);
    
    if (!ADMIN_EMAILS.includes(email)) {
      console.log('Email not in admin whitelist');
      throw new Error('Access denied. Admin privileges required.');
    }
    
    try {
      setIsLoading(true);
      console.log('Attempting Firebase authentication...');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase authentication successful for:', email);
      console.log('User UID:', userCredential.user.uid);
      
      // Manually process admin user creation/loading since onAuthStateChanged might be delayed
      const user = userCredential.user;
      console.log('Manually processing admin user setup...');
      
      try {
        const userDocRef = doc(firestore, 'admin_users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        let userData: AdminUser;
        
        if (userDoc.exists()) {
          console.log('Existing admin user found in Firestore');
          userData = {
            ...userDoc.data() as AdminUser,
            lastLogin: new Date().toISOString()
          };
          
          // Update last login
          await updateDoc(userDocRef, {
            lastLogin: new Date().toISOString()
          });
        } else {
          console.log('Creating new admin user document');
          userData = {
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Admin',
            email: user.email || '',
            role: getAdminRole(user.email || ''),
            permissions: getDefaultPermissions(user.email || ''),
            lastLogin: new Date().toISOString()
          };
          
          await setDoc(userDocRef, userData);
          console.log('Created new admin user:', userData);
        }
        
        // Manually set the admin user state
        setAdminUser(userData);
        setFirebaseUser(user);
        console.log('Manually set admin user state:', userData);
        
      } catch (firestoreError) {
        console.error('Error setting up admin user in Firestore:', firestoreError);
        console.log('Creating fallback admin user without Firestore...');
        
        // Create a fallback admin user if Firestore fails
        const fallbackUserData: AdminUser = {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Admin',
          email: user.email || '',
          role: getAdminRole(user.email || ''),
          permissions: getDefaultPermissions(user.email || ''),
          lastLogin: new Date().toISOString()
        };
        
        // Set the admin user state even without Firestore
        setAdminUser(fallbackUserData);
        setFirebaseUser(user);
        console.log('Set fallback admin user state:', fallbackUserData);
      }
      
      return true;
    } catch (error: any) {
      console.error('Admin login error:', error);
      
      // Handle Firebase auth errors
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('Admin account not found. Please contact system administrator.');
        case 'auth/wrong-password':
          throw new Error('Invalid password.');
        case 'auth/invalid-email':
          throw new Error('Invalid email address.');
        case 'auth/user-disabled':
          throw new Error('Admin account has been disabled.');
        default:
          throw new Error('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!adminUser) return false;
    return adminUser.permissions.includes(permission) || adminUser.role === 'super-admin';
  };

  const value = {
    adminUser,
    firebaseUser,
    isLoading,
    login,
    logout,
    isAuthenticated: !!adminUser,
    isAdmin: !!adminUser,
    hasPermission,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}