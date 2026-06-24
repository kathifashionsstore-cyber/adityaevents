// src/components/admin/ActivityLog.jsx
import React from 'react';
import { formatDateString } from '../../utils/dateHelpers';
import Table from '../common/Table';
import EmptyState from '../common/EmptyState';

const ActivityLog = ({ logs = [] }) => {
  if (logs.length === 0) {
    return <EmptyState message="No system activity logged yet." />;
  }

  return (
    <div className="space-y-4 text-left animate-fadeIn">
      <h3 className="font-display text-champagne text-sm font-semibold tracking-wide">
        System Activity Log
      </h3>
      <Table headers={['Timestamp', 'Action Type', 'Details']}>
        {logs.map((log, index) => (
          <tr key={log.id || index}>
            <td className="text-xs text-champagne/50">
              {formatDateString(log.timestamp)}
            </td>
            <td>
              <span className="inline-flex px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-white/5 border border-white/10 text-gold">
                {log.action}
              </span>
            </td>
            <td className="text-xs text-champagne/85">{log.details}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default ActivityLog;
