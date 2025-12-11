import React, { useState, useMemo } from 'react';
import { Ball } from './Ball';
import { generateMatrix } from '../utils/lotteryLogic';
import { TOTAL_RED_BALLS, TOTAL_BLUE_BALLS } from '../types';

export const MatrixTool: React.FC = () => {
  const [selectedRed, setSelectedRed] = useState<number[]>([]);
  const [selectedBlue, setSelectedBlue] = useState<number[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [results, setResults] = useState<{ red: number[], blue: number[] }[]>([]);

  const toggleRed = (num: number) => {
    setIsGenerated(false);
    setSelectedRed(prev => 
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num].sort((a, b) => a - b)
    );
  };

  const toggleBlue = (num: number) => {
    setIsGenerated(false);
    setSelectedBlue(prev => 
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num].sort((a, b) => a - b)
    );
  };

  const handleGenerate = () => {
    const res = generateMatrix(selectedRed, selectedBlue);
    setResults(res);
    setIsGenerated(true);
  };

  const isValid = selectedRed.length >= 5 && selectedBlue.length >= 2;
  const combinationCount = useMemo(() => {
    // nCr formula approximate logic for display
    const factorial = (n: number): number => n <= 1 ? 1 : n * factorial(n - 1);
    const combination = (n: number, r: number) => factorial(n) / (factorial(r) * factorial(n - r));
    
    if (selectedRed.length < 5 || selectedBlue.length < 2) return 0;
    const redCombs = combination(selectedRed.length, 5);
    const blueCombs = combination(selectedBlue.length, 2);
    return Math.round(redCombs * blueCombs);
  }, [selectedRed.length, selectedBlue.length]);

  return (
    <div className="space-y-8">
      {/* Selection Area */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex justify-between items-center">
            <span>1. 选择号码 (Select Numbers)</span>
            <span className="text-sm font-normal text-gray-500">
              已选: <span className="text-lottery-red font-bold">{selectedRed.length}</span> 红 + <span className="text-lottery-blue font-bold">{selectedBlue.length}</span> 蓝
            </span>
          </h3>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">前区 (Red Balls) - 至少选 5 个</p>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: TOTAL_RED_BALLS }, (_, i) => i + 1).map(num => (
                <Ball 
                  key={`red-${num}`} 
                  number={num} 
                  type="red" 
                  selected={selectedRed.includes(num)} 
                  onClick={() => toggleRed(num)}
                  size="sm"
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">后区 (Blue Balls) - 至少选 2 个</p>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: TOTAL_BLUE_BALLS }, (_, i) => i + 1).map(num => (
                <Ball 
                  key={`blue-${num}`} 
                  number={num} 
                  type="blue" 
                  selected={selectedBlue.includes(num)} 
                  onClick={() => toggleBlue(num)}
                  size="sm"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <p className="text-gray-600">预计生成注数 (Combinations):</p>
            <p className="text-2xl font-bold text-gray-800">{combinationCount.toLocaleString()}</p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={!isValid}
            className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg transform transition-all 
              ${isValid 
                ? 'bg-gradient-to-r from-lottery-red to-red-600 hover:scale-105 hover:shadow-xl' 
                : 'bg-gray-300 cursor-not-allowed'}`}
          >
            生成旋转矩阵 (Generate)
          </button>
        </div>
      </div>

      {/* Results Area */}
      {isGenerated && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 animate-fade-in">
           <h3 className="text-lg font-bold text-gray-800 mb-4">
            生成结果 (Results)
            {results.length > 2000 && <span className="text-sm text-red-500 ml-2 font-normal">(仅显示前 2000 注)</span>}
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar p-2">
             {results.map((combo, idx) => (
               <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-lottery-blue hover:shadow-md transition-all">
                  <div className="flex gap-1 mr-2">
                    {combo.red.map(n => (
                      <span key={n} className="w-6 h-6 rounded-full bg-white text-lottery-red border border-red-200 flex items-center justify-center text-xs font-bold">
                        {n.toString().padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <div className="flex gap-1">
                    {combo.blue.map(n => (
                      <span key={n} className="w-6 h-6 rounded-full bg-white text-lottery-blue border border-blue-200 flex items-center justify-center text-xs font-bold">
                        {n.toString().padStart(2, '0')}
                      </span>
                    ))}
                  </div>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};