import React, { useState, useEffect } from 'react';
import { STATUS_OPTIONS } from '../constants/crmConstants';

interface JobFormModalProps {
  job: any | null;
  onClose: () => void;
  onSave: (jobData: any) => void;
}

export default function JobFormModal({ job, onClose, onSave }: JobFormModalProps) {
  // Tối ưu hóa: Gom 10 state đơn lẻ thành 1 Object Form State
  const [formData, setFormData] = useState({
    id: '', title: '', shopName: '', phone: '', address: '',
    link: '', salary: '', requirements: '', benefits: '', status: 'Chờ phản hồi', notes: '', dateAdded: ''
  });

  useEffect(() => {
    if (job) {
      setFormData({ ...job });
    } else {
      setFormData({
        id: Date.now().toString(), title: '', shopName: '', phone: '', address: '',
        link: '', salary: '', requirements: '', benefits: '', status: 'Chờ phản hồi', notes: '',
        dateAdded: new Date().toISOString().split('T')[0]
      });
    }
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden transform transition-all my-8">
        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
          <h3 className="font-bold text-lg">{job ? "Chỉnh Sửa Tin Tuyển Dụng" : "Thêm Bài Tuyển Dụng Mới"}</h3>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-1.5 rounded-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vị trí tuyển *</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên cửa hàng *</label>
              <input type="text" name="shopName" required value={formData.shopName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Số điện thoại</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Trạng thái xử lý</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white">
                {STATUS_OPTIONS.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Địa chỉ nơi làm việc</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mức lương</label>
              <input type="text" name="salary" value={formData.salary} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link Facebook bài đăng</label>
              <input type="url" name="link" value={formData.link} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ghi chú tiến trình cá nhân</label>
            <textarea name="notes" rows={2} value={formData.notes} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-amber-50/50" />
          </div>

          <div className="pt-4 border-t flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 rounded-lg">Hủy bỏ</button>
            <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg">Lưu tin</button>
          </div>
        </form>
      </div>
    </div>
  );
}