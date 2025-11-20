import React from 'react';
import { Sparkles, X, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';
import { AIAnalysisResult } from '../types';

interface AIInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AIAnalysisResult | null;
  isLoading: boolean;
}

export const AIInsightModal: React.FC<AIInsightModalProps> = ({ isOpen, onClose, analysis, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="animate-pulse" size={24} />
            <h2 className="text-xl font-bold">Trợ Lý Tài Chính AI</h2>
          </div>
          <button 
            onClick={onClose} 
            title="Đóng cửa sổ phân tích"
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">AI đang phân tích dữ liệu sổ quỹ...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Summary Section */}
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <h3 className="text-indigo-900 font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp size={18} /> Tổng Quan
                </h3>
                <p className="text-indigo-800 leading-relaxed text-sm">{analysis.summary}</p>
              </div>

              {/* Insights Grid */}
              <div>
                <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb size={18} className="text-amber-500" /> Điểm Nổi Bật
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {analysis.insights.map((insight, idx) => (
                    <li key={idx} className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm text-sm text-gray-600 hover:border-amber-300 transition-colors">
                      • {insight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-emerald-500" /> Đề Xuất Tối Ưu
                </h3>
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không có dữ liệu phân tích.
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            title="Đóng"
            className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};