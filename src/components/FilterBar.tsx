import { STATUS_OPTIONS } from '../constants/crmConstants';

interface FilterBarProps {
  searchQuery: string; setSearchQuery: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
  warningFilter: boolean; setWarningFilter: (v: boolean) => void;
}

export default function FilterBar({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, warningFilter, setWarningFilter }: FilterBarProps) {
  return (
    <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </span>
        <input 
          type="text" placeholder="Tìm theo tên công việc, SĐT, cửa hàng, địa chỉ..." 
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trạng thái:</span>
          <select 
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">Tất cả trạng thái</option>
            {STATUS_OPTIONS.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
          </select>
        </div>

        <button 
          onClick={() => setWarningFilter(!warningFilter)}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${warningFilter ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
        >
          <span>⚠️ Xem bài trùng lặp</span>
        </button>

        {(searchQuery || statusFilter !== 'All' || warningFilter) && (
          <button onClick={() => { setSearchQuery(''); setStatusFilter('All'); setWarningFilter(false); }} className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1">Xóa lọc</button>
        )}
      </div>
    </section>
  );
}