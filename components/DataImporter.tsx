import React, { useState } from 'react';
import { parseLotteryHTML } from '../utils/parser';
import { LotteryDraw } from '../types';
import { Clipboard, AlertTriangle, CheckCircle, Search } from 'lucide-react';

interface Props {
  onImport: (data: LotteryDraw[]) => void;
}

export const DataImporter: React.FC<Props> = ({ onImport }) => {
  const [htmlInput, setHtmlInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [count, setCount] = useState(0);

  const handleParse = () => {
    if (!htmlInput.trim()) return;

    try {
      const data = parseLotteryHTML(htmlInput);
      if (data.length > 0) {
        onImport(data);
        setCount(data.length);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">数据智能导入 (Smart Import)</h2>
        <p className="text-gray-500 mt-2">由于浏览器安全限制，我们需要您协助获取官方数据。</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Guide */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="font-bold text-blue-800 flex items-center mb-4">
            <Search className="w-5 h-5 mr-2" />
            操作指南 (How to use)
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-sm text-blue-800">
            <li>
              访问大乐透官方开奖页面: <br/>
              <a 
                href="https://www.lottery.gov.cn/kj/kjlb.html?dlt" 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 underline hover:text-blue-800 break-all"
              >
                https://www.lottery.gov.cn/kj/kjlb.html?dlt
              </a>
            </li>
            <li>在该页面右键点击，选择 <strong>"查看网页源代码" (View Source)</strong> 或 <strong>"检查" (Inspect)</strong>.</li>
            <li>找到包含表格数据的代码 (通常在 <code>&lt;tbody id="historyData"&gt;</code> 附近).</li>
            <li>复制整个表格或页面的 HTML 代码.</li>
            <li>粘贴到右侧的输入框中并点击 "解析数据".</li>
          </ol>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <div className="relative">
            <textarea
              className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lottery-blue focus:border-transparent text-xs font-mono resize-none custom-scrollbar"
              placeholder="在此粘贴 HTML 代码... (Paste HTML code here)"
              value={htmlInput}
              onChange={(e) => {
                setHtmlInput(e.target.value);
                setStatus('idle');
              }}
            />
            <div className="absolute bottom-4 right-4 text-xs text-gray-400">
              支持直接粘贴网页源码
            </div>
          </div>

          <button
            onClick={handleParse}
            className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-bold shadow-md transition-all flex items-center justify-center"
          >
            <Clipboard className="w-5 h-5 mr-2" />
            解析并导入数据 (Parse & Import)
          </button>

          {status === 'success' && (
            <div className="flex items-center p-4 bg-green-50 text-green-700 rounded-lg animate-fade-in border border-green-200">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>成功导入 {count} 条开奖数据！请切换至"历史数据"查看。</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-lg animate-fade-in border border-red-200">
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>无法解析数据。请确保粘贴了正确的 HTML 代码。</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};