import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '../constants/crmConstants';

interface JobTableProps {
  jobs: any[];
  checkDuplicate: (job: any) => { isPhoneDup: boolean; isAddrDup: boolean; isAnyDup: boolean };
  onEdit: (job: any) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function JobTable({ jobs, checkDuplicate, onEdit, onDelete, onStatusChange }: JobTableProps) {
  
  // Hàm bổ trợ bóc tách và hiển thị nhiều chi nhánh/địa chỉ một cách trực quan
  const renderAddress = (addressStr: string, isAddrDup: boolean) => {
    if (!addressStr) return <span>---</span>;

    // Tách chuỗi bằng dấu chấm phẩy hoặc dấu xuống dòng
    const branches = addressStr.split(/[;\n]+/).map(b => b.trim()).filter(b => b.length > 0);

    return (
      <div className="space-y-1.5">
        {branches.map((branch, index) => (
          <div 
            key={index} 
            className={`flex items-start gap-1.5 leading-relaxed break-words ${
              isAddrDup ? 'text-rose-700 font-bold bg-rose-100 px-1.5 py-0.5 rounded' : 'text-slate-700 font-medium'
            }`}
          >
            <span className="mt-0.5 text-xs shrink-0">📍</span>
            <span>{branch}</span>
          </div>
        ))}
      </div>
    );
  };

  if (jobs.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <span className="text-4xl block mb-2">📁</span>
        <h3 className="text-slate-500 font-bold text-sm">Không tìm thấy dữ liệu tin tuyển dụng</h3>
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* --- PHIÊN BẢN MOBILE & TABLET --- */}
      <div className="block md:hidden space-y-4">
        {jobs.map((job) => {
          const dupInfo = checkDuplicate(job);
          const statusObj = STATUS_OPTIONS.find(opt => opt.name === job.status) || STATUS_OPTIONS[0];
          const categoryObj = CATEGORY_OPTIONS.find(opt => opt.value === job.category) || CATEGORY_OPTIONS[CATEGORY_OPTIONS.length - 1];

          return (
            <div 
              key={job.id} 
              className={`bg-white p-5 rounded-2xl border transition-all shadow-md relative overflow-hidden ${
                dupInfo.isAnyDup ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 shadow-slate-100'
              }`}
            >
              {dupInfo.isAnyDup && (
                <div className="absolute top-0 right-0 left-0 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider py-1 text-center">
                  ⚠️ Phát hiện trùng lặp dữ liệu
                </div>
              )}

              <div className={dupInfo.isAnyDup ? "pt-4" : ""}>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h4 className="font-bold text-slate-900 text-sm flex-1">{job.title}</h4>
                  <span className="text-[11px] text-slate-400 shrink-0 font-medium">{job.dateAdded}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${categoryObj.color}`}>
                    {job.category || 'Others'}
                  </span>
                  <p className="text-xs text-indigo-600 font-semibold">{job.shopName || 'Chưa cập nhật tên shop'}</p>
                </div>

                <div className="space-y-2.5 border-t border-b border-slate-100 py-3 my-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📞</span>
                    <span className={`font-mono font-semibold ${dupInfo.isPhoneDup ? 'text-rose-600 bg-rose-100 px-1 rounded' : ''}`}>
                      {job.phone || '---'}
                    </span>
                  </div>
                  
                  {/* Khu vực địa chỉ phiên bản Mobile */}
                  <div>
                    {renderAddress(job.address, dupInfo.isAddrDup)}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm">💰</span>
                    <span className="text-emerald-600 font-bold">{job.salary || 'Thỏa thuận'}</span>
                  </div>
                  {job.link && (
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-50">
                      <span className="text-sm">🔗</span>
                      <a href={job.link} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline font-bold">
                        Xem link bài đăng gốc
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-4 text-xs whitespace-pre-line text-slate-600">
                  {job.requirements && (
                    <div>
                      <strong className="text-slate-800 block mb-0.5">🔹 Yêu cầu công việc:</strong>
                      <p className="bg-slate-50 p-2.5 rounded-xl text-slate-600">{job.requirements}</p>
                    </div>
                  )}
                  {job.benefits && (
                    <div>
                      <strong className="text-indigo-800 block mb-0.5">🎁 Quyền lợi đãi ngộ:</strong>
                      <p className="bg-indigo-50/40 p-2.5 rounded-xl text-slate-600">{job.benefits}</p>
                    </div>
                  )}
                  {job.notes && (
                    <div>
                      <strong className="text-amber-800 block mb-0.5">📝 Ghi chú cá nhân:</strong>
                      <p className="bg-amber-50 text-amber-900 p-2.5 rounded-xl border border-amber-100">{job.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <select
                    value={job.status} 
                    onChange={(e) => onStatusChange(job.id, e.target.value)}
                    className={`text-[11px] font-bold border rounded-xl px-2 py-1.5 cursor-pointer shadow-sm focus:outline-none ${statusObj.color}`}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.name} value={opt.name} className="bg-white text-slate-800">{opt.name}</option>
                    ))}
                  </select>

                  <div className="flex items-center space-x-2">
                    <button onClick={() => onEdit(job)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-colors">📝</button>
                    <button onClick={() => onDelete(job.id)} className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors">🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- PHIÊN BẢN DESKTOP --- */}
      <div className="hidden md:block bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse table-fixed min-w-[1200px]">
            <thead>
              <tr className="bg-indigo-900 text-white text-[11px] font-black uppercase tracking-wider">
                <th className="py-4 px-4 w-[18%] border-r border-indigo-800/50">Vị trí / Cửa hàng</th>
                <th className="py-4 px-4 w-[15%] border-r border-indigo-800/50">Thông tin liên hệ</th>
                <th className="py-4 px-4 w-[17%] border-r border-indigo-800/50">Địa chỉ làm việc</th>
                <th className="py-4 px-4 w-[21%] border-r border-indigo-800/50">Chi tiết tuyển dụng</th>
                <th className="py-4 px-4 w-[17%] border-r border-indigo-800/50">Ghi chú tiến trình</th>
                <th className="py-4 px-4 w-[12%] text-center border-r border-indigo-800/50">Trạng thái</th>
                <th className="py-4 px-4 w-[10%] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-200 text-slate-700 text-xs">
              {jobs.map((job) => {
                const dupInfo = checkDuplicate(job);
                const statusObj = STATUS_OPTIONS.find(opt => opt.name === job.status) || STATUS_OPTIONS[0];
                const categoryObj = CATEGORY_OPTIONS.find(opt => opt.value === job.category) || CATEGORY_OPTIONS[CATEGORY_OPTIONS.length - 1];

                return (
                  <tr 
                    key={job.id} 
                    className={`
                      transition-all duration-150
                      odd:bg-white even:bg-slate-50/70 
                      hover:bg-indigo-50/60 hover:shadow-inner
                      ${dupInfo.isAnyDup ? '!bg-rose-100/50 border-l-4 border-l-rose-500' : 'border-l-4 border-l-transparent'}
                    `}
                  >
                    {/* Cột 1: Vị trí & Cửa hàng */}
                    <td className="py-5 px-4 align-top border-r border-slate-200/60">
                      <div className="font-bold text-slate-900 text-sm break-words">{job.title}</div>
                      <div className="text-slate-600 font-semibold mt-1.5 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${categoryObj.color}`}>
                            {job.category || 'Others'}
                          </span>
                          <span className="flex items-center gap-1 text-indigo-950 break-words">
                            <span>🏪</span> {job.shopName || '---'}
                          </span>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-3 font-mono bg-slate-200/50 px-2 py-0.5 rounded inline-block">📅 {job.dateAdded}</div>
                    </td>

                    {/* Cột 2: Liên hệ */}
                    <td className="py-5 px-4 align-top space-y-2.5 border-r border-slate-200/60">
                      <div className={`font-mono font-bold text-xs px-2 py-1 rounded-lg ${
                        dupInfo.isPhoneDup ? 'text-rose-700 bg-rose-200' : 'text-slate-800 bg-slate-200/60'
                      }`}>
                        📞 {job.phone || '---'}
                      </div>
                      <div className="pt-0.5">
                        {job.link ? (
                          <a 
                            href={job.link} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-1 text-indigo-700 hover:text-white font-bold bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 px-2.5 py-1 rounded-xl text-[11px] transition-all shadow-sm"
                          >
                            <span>Link bài đăng 🔗</span>
                          </a>
                        ) : (
                          <span className="text-slate-300 italic text-[10px]">Không có link</span>
                        )}
                      </div>
                    </td>

                    {/* Cột 3: Địa chỉ làm việc (Đã áp dụng render tách dòng thông minh) */}
                    <td className="py-5 px-4 align-top border-r border-slate-200/60">
                      {renderAddress(job.address, dupInfo.isAddrDup)}
                    </td>

                    {/* Cột 4: Chi tiết tuyển dụng */}
                    <td className="py-5 px-4 align-top space-y-3 border-r border-slate-200/60">
                      <div className="text-slate-700 flex items-center gap-1.5">
                        <span className="text-emerald-800 font-bold bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-lg text-[10px]">💰 LƯƠNG:</span>
                        <span className="font-extrabold text-emerald-700 text-sm">{job.salary || 'Thỏa thuận'}</span>
                      </div>
                      {job.requirements && (
                        <div className="text-slate-600 leading-relaxed whitespace-pre-line bg-white p-3 rounded-xl text-[11px] border border-slate-200/80 shadow-sm">
                          <strong className="text-slate-800 block border-b border-slate-200 pb-1 mb-1 font-bold">🔹 Yêu cầu:</strong>
                          {job.requirements}
                        </div>
                      )}
                      {job.benefits && (
                        <div className="text-slate-600 leading-relaxed whitespace-pre-line bg-indigo-50/50 p-3 rounded-xl text-[11px] border border-indigo-100/80 shadow-sm">
                          <strong className="text-indigo-900 block border-b border-indigo-100 pb-1 mb-1 font-bold">🎁 Quyền lợi:</strong>
                          {job.benefits}
                        </div>
                      )}
                    </td>

                    {/* Cột 5: Ghi chú */}
                    <td className="py-5 px-4 align-top border-r border-slate-200/60">
                      <div className="bg-amber-50/80 text-amber-950 p-3 rounded-xl border-2 border-amber-200/60 text-[11px] whitespace-pre-line leading-relaxed shadow-sm">
                        <strong className="text-amber-900 block border-b border-amber-200 pb-1 mb-1 font-bold">📝 Nhật ký HR:</strong>
                        {job.notes || <span className="text-amber-400 italic font-normal">Chưa viết ghi chú...</span>}
                      </div>
                    </td>

                    {/* Cột 6: Trạng thái */}
                    <td className="py-5 px-4 align-top text-center border-r border-slate-200/60">
                      <div className="flex justify-center pt-1">
                        <select
                          value={job.status} 
                          onChange={(e) => onStatusChange(job.id, e.target.value)}
                          className={`text-[11px] font-black border-2 rounded-xl px-2.5 py-1.5 cursor-pointer shadow-md transition-all focus:outline-none ${statusObj.color}`}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt.name} value={opt.name} className="bg-white text-slate-800 font-bold">{opt.name}</option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Cột 7: Thao tác */}
                    <td className="py-5 px-4 align-top text-right">
                      <div className="flex items-center justify-end space-x-1.5 pt-1">
                        <button onClick={() => onEdit(job)} className="p-2 bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white rounded-xl transition-all border border-slate-200 shadow-sm" title="Sửa">📝</button>
                        <button onClick={() => onDelete(job.id)} className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl transition-all border border-rose-200 shadow-sm" title="Xóa">🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}