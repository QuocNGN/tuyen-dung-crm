import React from 'react';
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
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="py-4 px-6">Thông tin công việc</th>
              <th className="py-4 px-4">Số điện thoại</th>
              <th className="py-4 px-4">Địa chỉ làm việc</th>
              <th className="py-4 px-4">Mức lương</th>
              <th className="py-4 px-4 text-center">Trạng thái</th>
              <th className="py-4 px-6 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {jobs.map((job) => {
              const dupInfo = checkDuplicate(job);
              const statusObj = STATUS_OPTIONS.find(opt => opt.name === job.status) || STATUS_OPTIONS[0];

              return (
                <tr key={job.id} className={`hover:bg-slate-50 transition ${dupInfo.isAnyDup ? 'bg-red-50/20' : ''}`}>
                  <td className="py-4 px-6 max-w-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{job.title}</span>
                      <span className="text-xs text-slate-500">{job.shopName}</span>
                      <span className="text-[11px] text-slate-400 mt-1">Ngày thêm: {job.dateAdded}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-mono text-xs font-semibold px-2 py-1.5 rounded-lg ${dupInfo.isPhoneDup ? 'bg-rose-100 text-rose-800 border border-rose-300 font-bold' : 'bg-slate-100 text-slate-700'}`}>
                      {job.phone || 'N/A'} {dupInfo.isPhoneDup && '⚠️'}
                    </span>
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <p className={`text-xs line-clamp-2 ${dupInfo.isAddrDup ? 'text-rose-700 font-semibold' : 'text-slate-600'}`}>
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
                      <button onClick={() => onEdit(job)} className="p-1.5 bg-slate-100 text-slate-600 rounded-md hover:text-indigo-600">📝</button>
                      <button onClick={() => onDelete(job.id)} className="p-1.5 bg-rose-50 text-rose-500 rounded-md hover:bg-rose-100">🗑️</button>
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