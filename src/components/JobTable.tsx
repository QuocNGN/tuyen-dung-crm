import { STATUS_OPTIONS } from '../constants/crmConstants';

interface JobTableProps {
  jobs: any[];
  checkDuplicate: (job: any) => { isPhoneDup: boolean; isAddrDup: boolean; isAnyDup: boolean };
  onEdit: (job: any) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function JobTable({ jobs, checkDuplicate, onEdit, onDelete, onStatusChange }: JobTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-slate-600 font-bold">Không tìm thấy dữ liệu</h3>
      </div>
    );
  }

  return (
    <section className="bg-transparent md:bg-white md:rounded-2xl md:border md:border-slate-200 md:shadow-md md:overflow-hidden">
      
      {/* --- PHIÊN BẢN MOBILE: HIỂN THỊ DẠNG CARD LIST --- */}
      <div className="block md:hidden space-y-4">
        {jobs.map((job) => {
          const dupInfo = checkDuplicate(job);
          const statusObj = STATUS_OPTIONS.find(opt => opt.name === job.status) || STATUS_OPTIONS[0];

          return (
            <div 
              key={job.id} 
              className={`bg-white p-4 rounded-xl border shadow-sm transition ${
                dupInfo.isAnyDup ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-base leading-tight">{job.title}</h4>
                  <span className="text-xs text-slate-500 font-medium">{job.shopName}</span>
                </div>
                <select
                  value={job.status} 
                  onChange={(e) => onStatusChange(job.id, e.target.value)}
                  className={`text-xs font-bold border rounded-lg px-2 py-1 ${statusObj.color} shrink-0`}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.name} value={opt.name} className="bg-white text-slate-800">{opt.name}</option>
                  ))}
                </select>
              </div>

              <p className="text-[11px] text-slate-400 mb-3">Ngày thêm: {job.dateAdded}</p>

              <div className="space-y-2 border-t border-b border-slate-100 py-3 my-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Số điện thoại:</span>
                  <span className={`font-mono font-semibold px-2 py-0.5 rounded ${
                    dupInfo.isPhoneDup ? 'bg-rose-100 text-rose-800 border border-rose-200 font-bold' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {job.phone || 'N/A'} {dupInfo.isPhoneDup && '⚠️'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Mức lương:</span>
                  <span className="font-bold text-indigo-700">{job.salary || 'Thỏa thuận'}</span>
                </div>

                <div className="flex flex-col gap-1 pt-1">
                  <span className="text-slate-400">Địa chỉ làm việc:</span>
                  <p className={`font-medium ${dupInfo.isAddrDup ? 'text-rose-700 font-bold' : 'text-slate-600'}`}>
                    {job.address || 'N/A'} {dupInfo.isAddrDup && '⚠️'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-2">
                <button onClick={() => onEdit(job)} className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:text-indigo-600">
                  <span>📝 Sửa</span>
                </button>
                <button onClick={() => onDelete(job.id)} className="flex items-center space-x-1 px-3 py-1.5 bg-rose-50 text-rose-500 rounded-lg text-xs font-semibold hover:bg-rose-100">
                  <span>🗑️ Xóa</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- PHIÊN BẢN DESKTOP: ĐÃ THAY ĐỔI TÔNG MÀU HEADING SANG SLATE-800 SANG TRỌNG --- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {/* THAY ĐỔI TẠI ĐÂY: Sử dụng màu nền tối bg-slate-800 và chữ trắng sáng để tạo tương phản mạnh */}
            <tr className="bg-slate-800 border-b border-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider">
              <th className="py-4 px-6 rounded-tl-2xl">Thông tin công việc</th>
              <th className="py-4 px-4">Số điện thoại</th>
              <th className="py-4 px-4">Địa chỉ làm việc</th>
              <th className="py-4 px-4">Mức lương</th>
              <th className="py-4 px-4 text-center">Trạng thái</th>
              <th className="py-4 px-6 text-right rounded-tr-2xl">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 text-sm bg-white">
            {jobs.map((job) => {
              const dupInfo = checkDuplicate(job);
              const statusObj = STATUS_OPTIONS.find(opt => opt.name === job.status) || STATUS_OPTIONS[0];

              return (
                <tr key={job.id} className={`hover:bg-slate-50/80 transition-colors ${dupInfo.isAnyDup ? 'bg-rose-50/30' : ''}`}>
                  <td className="py-4 px-6 max-w-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{job.title}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{job.shopName}</span>
                      <span className="text-[11px] text-slate-400 mt-1">Ngày thêm: {job.dateAdded}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-mono text-xs font-semibold px-2 py-1.5 rounded-lg ${dupInfo.isPhoneDup ? 'bg-rose-100 text-rose-800 border border-rose-300 font-bold' : 'bg-slate-100 text-slate-700'}`}>
                      {job.phone || 'N/A'} {dupInfo.isPhoneDup && '⚠️'}
                    </span>
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <p className={`text-xs leading-relaxed line-clamp-2 ${dupInfo.isAddrDup ? 'text-rose-700 font-semibold' : 'text-slate-600'}`}>
                      {job.address || 'N/A'} {dupInfo.isAddrDup && '⚠️'}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-bold text-indigo-700">{job.salary || 'Thỏa thuận'}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <select
                      value={job.status} onChange={(e) => onStatusChange(job.id, e.target.value)}
                      className={`text-xs font-bold border rounded-lg px-2.5 py-1.5 ${statusObj.color}`}
                    >
                      {STATUS_OPTIONS.map(opt => <option key={opt.name} value={opt.name} className="bg-white text-slate-800">{opt.name}</option>)}
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => onEdit(job)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:text-indigo-600 hover:bg-indigo-50 transition-colors">📝</button>
                      <button onClick={() => onDelete(job.id)} className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors">🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}