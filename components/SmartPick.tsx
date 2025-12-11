import React, { useState } from 'react';
import { Statistics, StrategyType } from '../types';
import { generateSmartPicks } from '../utils/lotteryLogic';
import { Ball } from './Ball';
import { Sparkles, Zap, ThermometerSnowflake, Scale, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  stats: Statistics;
}

export const SmartPick: React.FC<Props> = ({ stats }) => {
  const [count, setCount] = useState<number>(5);
  const [strategy, setStrategy] = useState<StrategyType>('random');
  const [results, setResults] = useState<{ red: number[], blue: number[] }[]>([]);

  const handleGenerate = () => {
    const picks = generateSmartPicks(stats, count, strategy);
    setResults(picks);
  };

  const strategies: { id: StrategyType; name: string; desc: string; icon: any; color: string }[] = [
    { 
      id: 'random', 
      name: '随机选号 (Random)', 
      desc: '完全随机生成，无任何规律约束',
      icon: Sparkles,
      color: 'bg-purple-100 text-purple-600 border-purple-200'
    },
    { 
      id: 'hot', 
      name: '追热号 (Hot Focus)', 
      desc: '优先选择近期出现频率较高的号码',
      icon: Zap,
      color: 'bg-red-100 text-red-600 border-red-200'
    },
    { 
      id: 'cold', 
      name: '博冷号 (Cold Focus)', 
      desc: '优先选择近期遗漏较多的冷门号码',
      icon: ThermometerSnowflake,
      color: 'bg-blue-100 text-blue-600 border-blue-200'
    },
    { 
      id: 'balanced', 
      name: '平衡组合 (Balanced)', 
      desc: '注重奇偶比和大小比的平衡 (3:2 或 2:3)',
      icon: Scale,
      color: 'bg-green-100 text-green-600 border-green-200'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-lottery-gold" />
          智能机选 (Smart Picks)
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Strategy Selection */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700">1. 选择策略 (Select Strategy)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {strategies.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStrategy(s.id)}
                  className={clsx(
                    "relative p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md",
                    strategy === s.id 
                      ? `${s.color} ring-2 ring-offset-2 ring-gray-200` 
                      : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center mb-2">
                    <s.icon className="w-5 h-5 mr-2" />
                    <span className="font-bold">{s.name}</span>
                  </div>
                  <p className="text-xs opacity-80">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration & Action */}
          <div className="space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-700 mb-4">2. 生成注数 (Count)</h3>
              <div className="flex items-center space-x-4">
                {[1, 5, 10, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCount(num)}
                    className={clsx(
                      "px-4 py-2 rounded-lg font-bold transition-all",
                      count === num
                        ? "bg-gray-800 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {num} 注
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full py-4 bg-gradient-to-r from-lottery-blue to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center text-lg"
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              立即生成号码 (Generate)
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in-up">
          {results.map((res, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                 <span className="text-gray-400 font-mono text-sm">#{String(index + 1).padStart(2, '0')}</span>
                 <div className="w-px h-8 bg-gray-100"></div>
              </div>
              
              <div className="flex-1 flex justify-center items-center space-x-4">
                <div className="flex gap-1">
                  {res.red.map((n, i) => (
                    <Ball key={`r-${i}`} number={n} type="red" size="sm" />
                  ))}
                </div>
                <div className="flex gap-1">
                  {res.blue.map((n, i) => (
                    <Ball key={`b-${i}`} number={n} type="blue" size="sm" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};