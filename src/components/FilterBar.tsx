import { STATUS_OPTIONS } from '../constants/crmConstants';

interface FilterBarProps {
  searchQuery: string; setSearchQuery: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
  warningFilter: boolean; setWarningFilter: (v: boolean) => void;
}

export default function FilterBar({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, warningFilter, setWarningFilter }: FilterBarProps) {
  return (
    /* THAY ĐỔI NỀN: Sử dụng màu `bg-indigo-950` (Tông xanh dạ tối/xanh mực đậm) kết hợp viền `border-indigo-800`.
       Màu này cực kỳ đậm đà, tạo hiệu ứng "bọc khối" mạnh mẽ cho khu vực bộ lọc mà không bị xám xịt buồn tẻ.
    */
    <section className="bg-indigo-950 p-5 rounded-2xl border border-indigo-900 shadow-md mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      
      {/* Ô tìm kiếm: Nền TRẮNG hoàn toàn nổi bật rực rỡ trên khối nền indigo-950 */}
      <div className="relative flex-1 max-w-xl group">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-indigo-400 group-focus-within:text-indigo-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input 
          type="text" 
          placeholder="Tìm nhanh theo tên công việc, SĐT, cửa hàng, địa chỉ..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-2.5 bg-white border border-transparent rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 shadow-sm transition-all"
        />
      </div>

      {/* Khu vực các nút bộ lọc */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Dropdown Trạng thái: Thiết kế nền TRẮNG chữ đậm tương phản rõ rệt */}
        <div className="flex items-center space-x-2 bg-white border border-transparent rounded-xl px-3.5 py-2 shadow-sm focus-within:ring-4 focus-within:ring-indigo-500/30">
          <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">🏷️ Trạng thái:</span>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none rounded-lg text-xs font-bold text-slate-700 pr-2 focus:outline-none focus:ring-0 cursor-pointer"
          >
            <option value="All">Tất cả trạng thái</option>
            {STATUS_OPTIONS.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
          </select>
        </div>

        {/* Nút lọc trùng lặp: Bình thường nền trắng tinh viền nổi, khi BẬT lên sẽ chuyển sang màu Vàng Cam Cháy cực gắt để báo động */}
        <button 
          onClick={() => setWarningFilter(!warningFilter)}
          className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm border transition-all ${
            warningFilter 
              ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20 scale-[1.02]' 
              : 'bg-white text-slate-700 border-transparent hover:bg-slate-50 hover:text-indigo-600'
          }`}
        >
          <span>⚠️</span>
          <span>Xem bài trùng lặp</span>
        </button>

        {/* Nút xóa nhanh tất cả bộ lọc: Chữ màu cam neon/vàng sáng tương phản mạnh trên nền tối */}
        {(searchQuery || statusFilter !== 'All' || warningFilter) && (
          <button 
            onClick={() => { setSearchQuery(''); setStatusFilter('All'); setWarningFilter(false); }} 
            className="text-xs text-amber-400 hover:text-white hover:bg-white/10 font-bold px-3 py-2.5 rounded-xl border border-indigo-800 transition-all shadow-sm"
          >
            ✨ Xóa bộ lọc
          </button>
        )}
      </div>
    </section>
  );
}