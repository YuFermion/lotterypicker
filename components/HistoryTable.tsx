import React, { useState, useEffect } from 'react';
import { LotteryDraw } from '../types';
import { Ball } from './Ball';
import { ChevronLeft, ChevronRight, Plus, Save, X } from 'lucide-react';

interface Props {
  data: LotteryDraw[];
  onAdd?: (draw: LotteryDraw) => void;
}

const ITEMS_PER_PAGE = 30;

export const HistoryTable: React.FC<Props> = ({ data, onAdd }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [newId, setNewId] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [redInputs, setRedInputs] = useState<string[]>(['', '', '', '', '']);
  const [blueInputs, setBlueInputs] = useState<string[]>(['', '']);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // Auto-fill ID when opening form
  useEffect(() => {
    if (isAdding && data.length > 0) {
      const lastId = data[0].id;
      // If numeric, increment. Otherwise leave empty.
      if (!isNaN(Number(lastId))) {
        setNewId(String(Number(lastId) + 1));
      }
    }
  }, [isAdding, data]);

  const handleRedChange = (index: number, value: string) => {
    const newReds = [...redInputs];
    newReds[index] = value;
    setRedInputs(newReds);
  };

  const handleBlueChange = (index: number, value: string) => {
    const newBlues = [...blueInputs];
    newBlues[index] = value;
    setBlueInputs(newBlues);
  };

  const handleSubmit = () => {
    if (!newId || !newDate) {
      alert('请填写期号和日期');
      return;
    }

    const reds = redInputs.map(n => parseInt(n));
    const blues = blueInputs.map(n => parseInt(n));

    // Validation
    if (reds.some(isNaN) || blues.some(isNaN)) {
      alert('所有号码必须为数字');
      return;
    }
    if (reds.some(n => n < 1 || n > 35) || blues.some(n => n < 1 || n > 12)) {
      alert('号码超出范围 (前区 1-35, 后区 1-12)');
      return;
    }
    if (new Set(reds).size !== 5) {
      alert('前区号码不能重复');
      return;
    }
    if (new Set(blues).size !== 2) {
      alert('后区号码不能重复');
      return;
    }

    const newDraw: LotteryDraw = {
      id: newId,
      date: newDate,
      redBalls: reds.sort((a, b) => a - b),
      blueBalls: blues.sort((a, b) => a - b)
    };

    if (onAdd) {
      onAdd(newDraw);
      setIsAdding(false);
      // Reset form fields
      setRedInputs(['', '', '', '', '']);
      setBlueInputs(['', '']);
    }
  };

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Add Button & Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {!isAdding ? (
          <div className="p-4 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-700">历史数据列表</h3>
            {onAdd && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center px-4 py-2 bg-lottery-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm text-sm font-bold"
              >
                <Plus className="w-4 h-4 mr-2" />
                手动添加 (Add Entry)
              </button>
            )}
          </div>
        ) : (
          <div className="p-6 bg-blue-50 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-blue-800">添加新开奖数据 (Add New Draw)</h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* ID & Date */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">期号 (ID)</label>
                <input
                  type="text"
                  value={newId}
                  onChange={e => setNewId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lottery-blue focus:border-transparent"
                  placeholder="25142"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">日期 (Date)</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lottery-blue focus:border-transparent"
                />
              </div>

              {/* Red Balls */}
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-lottery-red mb-1">前区 (Red 1-35)</label>
                <div className="flex gap-2">
                  {redInputs.map((val, i) => (
                    <input
                      key={`r-${i}`}
                      type="number"
                      min="1"
                      max="35"
                      value={val}
                      onChange={e => handleRedChange(i, e.target.value)}
                      className="w-full text-center px-1 py-2 border-2 border-red-200 rounded-md focus:border-lottery-red focus:outline-none text-lottery-red font-bold"
                    />
                  ))}
                </div>
              </div>

              {/* Blue Balls */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-lottery-blue mb-1">后区 (Blue 1-12)</label>
                <div className="flex gap-2">
                  {blueInputs.map((val, i) => (
                    <input
                      key={`b-${i}`}
                      type="number"
                      min="1"
                      max="12"
                      value={val}
                      onChange={e => handleBlueChange(i, e.target.value)}
                      className="w-full text-center px-1 py-2 border-2 border-blue-200 rounded-md focus:border-lottery-blue focus:outline-none text-lottery-blue font-bold"
                    />
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="md:col-span-2">
                <button
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-all font-bold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存 (Save)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {data.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 text-gray-500">
             <p className="text-lg mb-2">暂无数据 (No Data)</p>
             <p className="text-sm">请导入数据或手动添加</p>
           </div>
        ) : (
          <>
            <div className="overflow-x-auto custom-scrollbar border-t border-gray-100">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                  <tr>
                    <th className="px-6 py-4 whitespace-nowrap">期号 (Issue)</th>
                    <th className="px-6 py-4 whitespace-nowrap">日期 (Date)</th>
                    <th className="px-6 py-4 text-center whitespace-nowrap">前区号码 (Red)</th>
                    <th className="px-6 py-4 text-center whitespace-nowrap">后区号码 (Blue)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentData.map((draw) => (
                    <tr key={draw.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{draw.id}</td>
                      <td className="px-6 py-4 text-gray-500">{draw.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2 min-w-[200px]">
                          {draw.redBalls.map((num, i) => (
                            <Ball key={i} number={num} type="red" size="sm" />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2 min-w-[100px]">
                          {draw.blueBalls.map((num, i) => (
                            <Ball key={i} number={num} type="blue" size="sm" />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div className="text-sm text-gray-500">
                  显示 {startIndex + 1} 到 {Math.min(startIndex + ITEMS_PER_PAGE, data.length)} 条，共 {data.length} 条
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-medium text-gray-700 min-w-[80px] text-center">
                    第 {currentPage} / {totalPages} 页
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
                    title="Next Page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};