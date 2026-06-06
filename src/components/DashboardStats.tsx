import React from 'react';

interface StatsProps {
  stats: { total: number; pending: number; interviewed: number; passed: number; rejected: number; suspicious: number };
}

export default function DashboardStats({ stats }: StatsProps) {
  const cards = [
    { label: "TỔNG THU THẬP", value: `${stats.total} tin`, color: "bg-indigo-50 text-indigo-600", text: "text-slate-800" },
    { label: "CHỜ PHẢN HỒI", value: `${stats.pending} tin`, color: "bg-amber-50 text-amber-500", text: "text-amber-600" },
    { label: "ĐÃ PHỎNG VẤN", value: `${stats.interviewed} tin`, color: "bg-blue-50 text-blue-500", text: "text-blue-600" },
    { label: "TRÚNG TUYỂN", value: `${stats.passed} tin`, color: "bg-emerald-50 text-emerald-500", text: "text-emerald-600" },
    { label: "TỪ CHỐI / BLOCK", value: `${stats.rejected} tin`, color: "bg-rose-50 text-rose-500", text: "text-rose-600" },
    { 
      label: "ĐÁNG NGỜ (TRÙNG)", 
      value: `${stats.suspicious} tin`, 
      color: stats.suspicious > 0 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-50 text-slate-400', 
      text: stats.suspicious > 0 ? 'text-red-600' : 'text-slate-600' 
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className={`p-2 rounded-lg ${card.color}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">{card.label}</p>
            <h4 className={`text-xl font-black ${card.text}`}>{card.value}</h4>
          </div>
        </div>
      ))}
    </section>
  );
}