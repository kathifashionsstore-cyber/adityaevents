// src/pages/admin/AdminNotificationsPage.jsx
import React from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import EmptyState from '../../components/common/EmptyState';
import Table from '../../components/common/Table';
import { useNotifications } from '../../context/NotificationContext';
import { formatDateString } from '../../utils/dateHelpers';

const AdminNotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const sortedNotifications = [...notifications].sort((a, b) => (
    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  ));

  return (
    <PageTransition>
      <div className="space-y-6 pb-12 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 text-gold flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-champagne text-sm font-semibold tracking-wide uppercase">
                Admin Notifications
              </h3>
              <p className="font-body text-[11px] text-champagne/50 mt-0.5">
                {unreadCount} unread alert{unreadCount === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-gold/20 text-gold hover:bg-gold/10 transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
          )}
        </div>

        {sortedNotifications.length === 0 ? (
          <EmptyState message="No notifications yet." subtext="System and booking alerts appear here." />
        ) : (
          <Table headers={['Date', 'Title', 'Message', 'Status', 'Actions']}>
            {sortedNotifications.map((notification) => (
              <tr key={notification.id}>
                <td className="text-xs text-champagne/60 whitespace-nowrap">
                  {formatDateString(notification.createdAt)}
                </td>
                <td className="text-xs font-semibold text-champagne">
                  {notification.title || 'Notification'}
                </td>
                <td className="text-xs text-champagne/70 max-w-md">
                  {notification.message || 'No message provided.'}
                </td>
                <td>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide border ${
                    notification.read
                      ? 'bg-white/5 text-champagne/60 border-white/10'
                      : 'bg-gold/10 text-gold border-gold/30'
                  }`}>
                    {notification.read ? 'Read' : 'Unread'}
                  </span>
                </td>
                <td>
                  {!notification.read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      className="p-1.5 bg-success/15 border border-success/35 text-success rounded-lg hover:bg-success hover:text-charcoal transition-all cursor-pointer"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminNotificationsPage;
