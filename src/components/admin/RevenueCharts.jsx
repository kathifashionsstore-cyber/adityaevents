// src/components/admin/RevenueCharts.jsx
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import Card from '../common/Card';

const RevenueCharts = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { name: 'Jan', revenue: 400000 },
    { name: 'Feb', revenue: 600000 },
    { name: 'Mar', revenue: 900000 },
    { name: 'Apr', revenue: 750000 },
    { name: 'May', revenue: 1200000 },
    { name: 'Jun', revenue: 1500000 }
  ];

  const formatYAxis = (tickItem) => {
    return `₹${tickItem / 1000}k`;
  };

  return (
    <Card className="p-6 w-full" hoverEffect={false}>
      <h3 className="font-display text-champagne text-sm font-semibold border-b border-white/5 pb-2 mb-6 text-left">
        Monthly Income Charts
      </h3>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="name" 
              stroke="rgba(247, 231, 206, 0.4)" 
              style={{ fontSize: '10px', fontFamily: 'Poppins' }} 
            />
            <YAxis 
              stroke="rgba(247, 231, 206, 0.4)" 
              style={{ fontSize: '10px', fontFamily: 'Poppins' }} 
              tickFormatter={formatYAxis} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A1A1A', 
                borderColor: 'rgba(212, 175, 55, 0.2)',
                borderRadius: '8px',
                color: '#F7E7CE',
                fontSize: '11px',
                fontFamily: 'Poppins'
              }}
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#D4AF37" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueCharts;
