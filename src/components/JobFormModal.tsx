import React, { useState, useEffect } from 'react';
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '../constants/crmConstants';

interface JobFormModalProps {
  job: any | null;
  onClose: () => void;
  onSave: (jobData: any) => void;
}

export default function JobFormModal({ job, onClose, onSave }: JobFormModalProps) {
  const [formData, setFormData] = useState({
    id: '', title: '', shopName: '', phone: '', address: '',
    category: 'Others',
    link: '', salary: '', requirements: '', benefits: '', status: 'Chờ phản hồi', notes: '', dateAdded: ''
  });

  useEffect(() => {
    if (job) {
      setFormData({ ...job });
    } else {
      setFormData({
        id: '',
        title: '', shopName: '', phone: '', address: '',
        category: 'Others',
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
    if (!formData.title.trim()) return alert('Vui lòng nhập tiêu đề công việc!');
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <div>
            <h2 className="text-base font-black text-slate-900 uppercase">
              {job ? '📝 Cập nhật tin tuyển dụng' : '✨ Thêm bài tuyển dụng mới'}
            </h2>
            <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">Giới hạn tối đa văn bản 500 ký tự</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg p-1">✕</button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-700 text-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Tiêu đề công việc <span className="text-rose-500">*</span></label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Ví dụ: Nhân viên phục vụ bàn" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-semibold text-slate-800" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Tên cửa hàng / Shop</label>
              <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} placeholder="Ví dụ: Highlands Coffee Quận 1" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-semibold text-slate-800" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Số điện thoại liên hệ</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Nhập SĐT hoặc link liên hệ phụ" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Trạng thái xử lý</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-bold bg-white">
                {STATUS_OPTIONS.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Ngành nghề</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-bold bg-white">
                {CATEGORY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Địa chỉ làm việc</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Số nhà, tên đường, quận huyện, TP..." className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Mức lương</label>
              <input type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="Ví dụ: 25k/h hoặc 7-9 triệu" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-semibold text-emerald-600" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Link bài đăng nguồn (Facebook/Nhóm)</label>
              <input type="url" name="link" value={formData.link} onChange={handleChange} placeholder="https://facebook.com/..." className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-indigo-600" />
            </div>
          </div>

          {/* Ô nhập Yêu cầu - Giới hạn 500 từ */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Yêu cầu tuyển dụng công việc</label>
              <span className={`text-[10px] font-bold ${formData.requirements.length >= 480 ? 'text-rose-500' : 'text-slate-400'}`}>
                {formData.requirements.length} / 500
              </span>
            </div>
            <textarea name="requirements" rows={3} maxLength={500} value={formData.requirements} onChange={handleChange} placeholder="Các kỹ năng cần có, độ tuổi, ca làm việc..." className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 resize-none leading-relaxed" />
          </div>

          {/* Ô nhập Quyền lợi - Giới hạn 500 từ */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quyền lợi & Chế độ đãi ngộ</label>
              <span className={`text-[10px] font-bold ${formData.benefits.length >= 480 ? 'text-rose-500' : 'text-slate-400'}`}>
                {formData.benefits.length} / 500
              </span>
            </div>
            <textarea name="benefits" rows={3} maxLength={500} value={formData.benefits} onChange={handleChange} placeholder="Lương thưởng, phụ cấp cơm trưa, bảo hiểm, ngày nghỉ..." className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 resize-none leading-relaxed" />
          </div>

          {/* Ô nhập Ghi chú - Giới hạn 500 từ */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-wider">Ghi chú tiến trình cá nhân</label>
              <span className={`text-[10px] font-bold ${formData.notes.length >= 480 ? 'text-rose-500' : 'text-amber-500'}`}>
                {formData.notes.length} / 500
              </span>
            </div>
            <textarea name="notes" rows={2} maxLength={500} value={formData.notes} onChange={handleChange} placeholder="Ghi chú lịch hẹn, trạng thái kết nối với chủ shop..." className="w-full px-3.5 py-2.5 border border-amber-200 bg-amber-50/40 rounded-xl focus:outline-none focus:border-amber-500 text-amber-950 resize-none leading-relaxed" />
          </div>

          {/* Footer nút bấm */}
          <div className="pt-4 border-t flex justify-end space-x-3 bg-white sticky bottom-0">
            <button type="button" onClick={onClose} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors">
              Hủy bỏ
            </button>
            <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10 transition-colors">
              {job ? 'Cập nhật ngay' : 'Lưu dữ liệu'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}