import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Statistics } from '../types';

interface Props {
  stats: Statistics;
}

export const FrequencyChart: React.FC<Props> = ({ stats }) => {
  const redData = Object.entries(stats.redFrequency).map(([num, count]) => ({
    name: num.padStart(2, '0'),
    count,
    type: 'red'
  }));

  const blueData = Object.entries(stats.blueFrequency).map(([num, count]) => ({
    name: num.padStart(2, '0'),
    count,
    type: 'blue'
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-6 bg-lottery-red rounded mr-2"></span>
          前区频率 (Red Ball Frequency)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={redData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={10} tickLine={false} />
              <YAxis fontSize={10} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#fee2e2', opacity: 0.4 }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {redData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={(entry.count as number) > 5 ? '#e53e3e' : '#feb2b2'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-6 bg-lottery-blue rounded mr-2"></span>
          后区频率 (Blue Ball Frequency)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={blueData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} />
              <YAxis fontSize={12} tickLine={false} />
              <Tooltip 
                 cursor={{ fill: '#ebf8ff', opacity: 0.4 }}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                 {blueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={(entry.count as number) > 3 ? '#3182ce' : '#90cdf4'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};