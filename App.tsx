import React, { useState, useMemo, useEffect } from 'react';
import { LayoutDashboard, Grid3X3, Database, UploadCloud, Ticket, Wand2 } from 'lucide-react';
import { HistoryTable } from './components/HistoryTable';
import { FrequencyChart } from './components/Charts';
import { MatrixTool } from './components/MatrixTool';
import { DataImporter } from './components/DataImporter';
import { SmartPick } from './components/SmartPick';
import { calculateStatistics } from './utils/lotteryLogic';
import { LotteryDraw, TabType } from './types';
import { clsx } from 'clsx';

// Initial dummy data to show UI before import
const INITIAL_DATA: LotteryDraw[] = [
  { id: '25141', date: '2025-12-10', redBalls: [4, 9, 24, 28, 29], blueBalls: [2, 10] },
  { id: '25140', date: '2025-12-08', redBalls: [1, 12, 15, 20, 33], blueBalls: [5, 12] },
  { id: '25139', date: '2025-12-06', redBalls: [7, 8, 11, 25, 30], blueBalls: [3, 9] },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [data, setData] = useState<LotteryDraw[]>(INITIAL_DATA);

  // Memoize stats calculation
  const stats = useMemo(() => calculateStatistics(data), [data]);

  const handleImport = (newData: LotteryDraw[]) => {
    // Merge unique
    const existingIds = new Set(data.map(d => d.id));
    const uniqueNew = newData.filter(d => !existingIds.has(d.id));
    const merged = [...uniqueNew, ...data].sort((a, b) => b.id.localeCompare(a.id));
    setData(merged);
  };

  const handleAdd = (newDraw: LotteryDraw) => {
    if (data.some(d => d.id === newDraw.id)) {
      alert(`期号 ${newDraw.id} 已存在，无法添加重复期号 (Issue ID exists)`);
      return;
    }
    setData(prev => [newDraw, ...prev].sort((a, b) => b.id.localeCompare(a.id)));
  };

  const TabButton = ({ id, label, icon: Icon }: { id: TabType, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={clsx(
        "flex items-center px-4 sm:px-6 py-3 font-medium transition-all duration-200 rounded-lg whitespace-nowrap",
        activeTab === id 
          ? "bg-white text-lottery-blue shadow-sm ring-1 ring-gray-200" 
          : "text-gray-500 hover:bg-white/50 hover:text-gray-700"
      )}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-10">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-lottery-red to-orange-500 text-white p-2 rounded-lg shadow-lg">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                大乐透 Pro
              </h1>
              <p className="text-xs text-gray-400">智能分析与选号系统</p>
            </div>
          </div>
          
          <div className="hidden md:flex text-sm text-gray-500">
             <span className="bg-gray-100 px-3 py-1 rounded-full">
               已收录 {data.length} 期数据
             </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex flex-nowrap gap-2 mb-8 p-1 bg-gray-100/50 rounded-xl w-fit min-w-min">
            <TabButton id="dashboard" label="数据概览" icon={LayoutDashboard} />
            <TabButton id="pick" label="智能选号" icon={Wand2} />
            <TabButton id="matrix" label="旋转矩阵" icon={Grid3X3} />
            <TabButton id="history" label="历史数据" icon={Database} />
            <TabButton id="import" label="数据导入" icon={UploadCloud} />
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="animate-fade-in-up">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Key Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500">前区热号 (Hot Red)</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {stats.hotRed.slice(0, 3).map(n => (
                      <span key={n} className="w-8 h-8 rounded-full bg-red-100 text-lottery-red flex items-center justify-center text-xs font-bold">{n}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <p className="text-sm text-gray-500">后区热号 (Hot Blue)</p>
                   <div className="flex gap-1 mt-2 flex-wrap">
                    {stats.hotBlue.slice(0, 3).map(n => (
                      <span key={n} className="w-8 h-8 rounded-full bg-blue-100 text-lottery-blue flex items-center justify-center text-xs font-bold">{n}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <p className="text-sm text-gray-500">奇偶比 (Odd/Even)</p>
                   <div className="mt-2 text-lg font-bold text-gray-800">
                     Red: {stats.oddEvenRed.odd}:{stats.oddEvenRed.even}
                   </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <p className="text-sm text-gray-500">最新开奖 (Latest)</p>
                   <div className="mt-2 text-lg font-bold text-gray-800">
                     {data[0]?.date || '--'}
                   </div>
                </div>
              </div>

              {/* Charts */}
              <FrequencyChart stats={stats} />
            </div>
          )}

          {activeTab === 'pick' && <SmartPick stats={stats} />}
          
          {activeTab === 'matrix' && <MatrixTool />}
          
          {activeTab === 'history' && <HistoryTable data={data} onAdd={handleAdd} />}
          
          {activeTab === 'import' && <DataImporter onImport={handleImport} />}
        </div>
      </main>
    </div>
  );
};

export default App;