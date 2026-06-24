import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser, adminProfile } = useAuth();
  const notificationsRef = useRef([]);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    let q;
    // Admins see all administrative alerts, customers see their own alerts
    if (adminProfile && adminProfile.active) {
      q = query(
        collection(db, 'notifications'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
    } else {
      q = query(
        collection(db, 'notifications'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      let unread = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        list.push({ id: doc.id, ...data });
        if (!data.read) {
          unread++;
        }
      });
      
      // Fire visual toast if new notification arrives
      const prevNotifications = notificationsRef.current;
      if (list.length > 0 && prevNotifications.length > 0) {
        const latestNew = list[0];
        const latestOld = prevNotifications[0];
        if (latestNew.id !== latestOld.id && !latestNew.read) {
          toast.success(latestNew.title + ": " + latestNew.message, {
            duration: 5000,
            position: 'top-right'
          });
        }
      }

      setNotifications(list);
      setUnreadCount(unread);
    }, (error) => {
      console.error("Notifications realtime listener error:", error);
    });

    return unsubscribe;
  }, [currentUser, adminProfile]);

  const markAsRead = async (notificationId) => {
    try {
      const ref = doc(db, 'notifications', notificationId);
      await updateDoc(ref, { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadList = notifications.filter(n => !n.read);
      const promises = unreadList.map(n => updateDoc(doc(db, 'notifications', n.id), { read: true }));
      await Promise.all(promises);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
