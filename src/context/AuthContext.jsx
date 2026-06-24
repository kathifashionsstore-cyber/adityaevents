import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext(null);
const DEFAULT_ADMIN_EMAIL = 'admin@adithyaevents.com';

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const buildAdminProfile = (data, user) => {
  const email = normalizeEmail(data.email || user.email);

  return {
    ...data,
    uid: data.uid || user.uid,
    email,
    name: data.name || 'Adithya Admin',
    role: data.role || (email === DEFAULT_ADMIN_EMAIL ? 'superadmin' : 'staff'),
    active: data.active !== false
  };
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [adminAccessError, setAdminAccessError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setCurrentUser(user);
      setAdminProfile(null);
      setAdminAccessError('');

      if (user) {
        const userEmail = normalizeEmail(user.email);
        console.log(`[Adithya Auth] User logged in: ${userEmail} (UID: ${user.uid})`);

        try {
          const adminDocRef = doc(db, 'admins', user.uid);
          const adminDoc = await getDoc(adminDocRef);
          
          if (adminDoc.exists()) {
            console.log('[Adithya Auth] Admin profile found by UID.');
            setAdminProfile(buildAdminProfile(adminDoc.data(), user));
          } else if (userEmail === DEFAULT_ADMIN_EMAIL) {
            console.log('[Adithya Auth] Auto-seeding default superadmin profile for admin@adithyaevents.com...');
            const defaultAdmin = {
              uid: user.uid,
              name: 'Adithya Admin',
              email: userEmail,
              role: 'superadmin',
              active: true,
              createdAt: new Date().toISOString()
            };

            try {
              await setDoc(doc(db, 'admins', user.uid), defaultAdmin);
              console.log('[Adithya Auth] Successfully created default superadmin profile in Firestore.');
            } catch (writeErr) {
              console.warn('[Adithya Auth] Could not write seeded admin doc to Firestore. Using in-memory profile:', writeErr);
            }

            setAdminProfile(defaultAdmin);
          } else {
            console.log('[Adithya Auth] Admin profile not found by UID. Running self-healing checks...');
            // Check if there is an admin document with the matching email (e.g. created manually without UID as document ID)
            const q = query(collection(db, 'admins'), where('email', '==', userEmail));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const adminData = buildAdminProfile(querySnapshot.docs[0].data(), user);
              console.log('[Adithya Auth] Admin profile matched by email. Migrating to UID document ID...');
              const migratedData = {
                ...adminData,
                uid: user.uid,
                active: adminData.active !== false
              };
              try {
                await setDoc(doc(db, 'admins', user.uid), migratedData);
                console.log('[Adithya Auth] Successfully migrated admin document to UID.');
              } catch (writeErr) {
                console.warn('[Adithya Auth] Could not write migrated admin doc to Firestore (rules restriction). Using in-memory profile:', writeErr);
              }
              setAdminProfile(migratedData);
            } else {
              const message = `No active admin profile exists for ${userEmail}. Create admins/${user.uid} in Firestore or register this email from Settings.`;
              console.error(`[Adithya Auth] ${message}`);
              setAdminAccessError(message);
              setAdminProfile(null);
            }
          }
        } catch (error) {
          console.error("[Adithya Auth] Error loading admin profile:", error);
          setAdminAccessError(
            error?.code === 'permission-denied'
              ? 'Signed in, but Firestore blocked the admin profile lookup. Deploy the updated Firestore rules or create an admins document with this user UID.'
              : 'Signed in, but the admin profile could not be loaded. Please try again.'
          );
          setAdminProfile(null);
        }
      } else {
        setAdminProfile(null);
        setAdminAccessError('');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const registerAdmin = async (email, password, name, role = 'staff') => {
    if (!adminProfile || adminProfile.role !== 'superadmin') {
      throw new Error("Unauthorized: Only superadmins can create new administrators.");
    }
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const newAdmin = {
      uid: credential.user.uid,
      name,
      email,
      role,
      active: true,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'admins', credential.user.uid), newAdmin);
    return credential.user;
  };

  const value = {
    currentUser,
    adminProfile,
    adminAccessError,
    loading,
    login,
    logout,
    registerAdmin,
    isAdmin: !!adminProfile && adminProfile.active,
    isSuperAdmin: !!adminProfile && adminProfile.active && adminProfile.role === 'superadmin',
    isManager: !!adminProfile && adminProfile.active && ['superadmin', 'manager'].includes(adminProfile.role)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
