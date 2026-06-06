import { useState, useEffect } from 'react';
import { GOOGLE_APPS_SCRIPT_CODE, DEFAULT_APPS_SCRIPT_URL, DEFAULT_SHEET_URL } from '../constants/crmConstants';

interface GoogleSheetsModalProps {
  sheetUrl: string; 
  setSheetUrl: (v: string) => void;
  appsScriptUrl: string; 
  setAppsScriptUrl: (v: string) => void;
  isSyncing: boolean;
  onFetch: () => void; 
  onSync: () => void;  
  onClose: () => void; 
}

export default function GoogleSheetsModal({ 
  sheetUrl, 
  setSheetUrl, 
  appsScriptUrl, 
  setAppsScriptUrl, 
  isSyncing, 
  onFetch, 
  onSync, 
  onClose 
}: GoogleSheetsModalProps) {
  
  const [copySuccess, setCopySuccess] = useState(false);

  // Tự động kiểm tra và điền dữ liệu mặc định lên State của Component cha nếu ban đầu đang trống
  useEffect(() => {
    if (!sheetUrl) {
      setSheetUrl(DEFAULT_SHEET_URL);
    }
    if (!appsScriptUrl) {
      setAppsScriptUrl(DEFAULT_APPS_SCRIPT_URL);
    }
  }, [sheetUrl, appsScriptUrl, setSheetUrl, setAppsScriptUrl]);

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden transform transition-all my-8">
        
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-base">Cấu Hình Kết Nối Google Sheets làm Database</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 p-1.5 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Khu vực Nhập Link & Đồng bộ */}
          <div className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Link Google Sheets của bạn:
              </label>
              <input 
                type="text"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="Nhập hoặc dán đè đường dẫn Google Sheets mới để cập nhật..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                URL Google Apps Script Web App (API Đồng Bộ):
              </label>
              <input 
                type="text"
                value={appsScriptUrl}
                onChange={(e) => setAppsScriptUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono text-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Ban đầu hệ thống sử dụng Link API Database mẫu. Bạn có thể dán đè link cá nhân của bạn vào đây để tự đồng bộ riêng tư.
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-1">
              <button
                onClick={onSync}
                disabled={isSyncing}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
              >
                {isSyncing ? (
                  <span>Đang đẩy dữ liệu...</span>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Đẩy dữ liệu hiện tại lên Sheet</span>
                  </>
                )}
              </button>

              <button
                onClick={onFetch}
                disabled={isSyncing}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
              >
                {isSyncing ? (
                  <span>Đang đồng bộ...</span>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    <span>Tải dữ liệu từ Sheet về Web</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Hướng dẫn cài đặt chi tiết */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wide">Hướng dẫn kích hoạt API Google Sheets để làm Database:</h4>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed bg-amber-50 p-4 rounded-xl border border-amber-100">
              <p className="font-bold text-amber-900">👉 Bước 1: Mở Google Sheet và mở trình biên tập mã</p>
              <p>Truy cập vào liên kết trang tính của bạn, tại thanh menu trên cùng chọn <strong className="text-slate-800">Tiện ích mở rộng (Extensions)</strong> &gt; <strong className="text-slate-800">Apps Script</strong>.</p>
              
              <p className="font-bold text-amber-900">👉 Bước 2: Dán đoạn mã bên dưới</p>
              <p>Xóa sạch mọi ký tự trong tệp mã mặc định, sau đó sao chép (copy) chính xác toàn bộ mã code phía dưới và dán vào đó.</p>

              <p className="font-bold text-amber-900">👉 Bước 3: Triển khai thành ứng dụng Web</p>
              <p>Nhấp vào nút <strong className="text-slate-800">Triển khai (Deploy)</strong> ở góc trên bên phải &gt; chọn <strong className="text-slate-800">Triển khai mới (New deployment)</strong>. Nhấp vào biểu tượng bánh răng bên cạnh loại triển khai và chọn <strong className="text-slate-800">Ứng dụng web (Web app)</strong>.</p>
              <p className="mt-1">Thiết lập các trường:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Mô tả:</strong> FB CRM API</li>
                <li><strong>Thực thi dưới danh nghĩa (Execute as):</strong> Chọn "Tôi" (tài khoản email của bạn)</li>
                <li><strong>Ai có quyền truy cập (Who has access):</strong> Chọn <strong className="text-indigo-700">Mọi người (Anyone)</strong> (Đây là điều kiện cần thiết để ứng dụng web của bạn có thể gửi dữ liệu trực tiếp về đây).</li>
              </ul>

              <p className="font-bold text-amber-900">👉 Bước 4: Chấp nhận quyền & dán Link vào CRM</p>
              <p>Bấm nút Triển khai, cấp quyền ủy quyền tài khoản cho tập lệnh (Nhấp Advanced &gt; Go to Untitled project). Sau khi thành công, copy lấy <strong className="text-indigo-700">URL Ứng dụng web</strong> kết thúc bằng chữ <strong className="font-mono">/exec</strong> và dán vào hộp nhập phía trên của Web CRM!</p>
            </div>

            {/* Khối copy Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-500 uppercase">Mã Apps Script (Vui lòng copy):</span>
                <button 
                  type="button"
                  onClick={handleCopyCode}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>{copySuccess ? "Đã copy!" : "Sao chép mã"}</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-300 text-[11px] p-4 rounded-xl font-mono max-h-60 overflow-y-auto border border-slate-800 leading-relaxed select-all">
                {GOOGLE_APPS_SCRIPT_CODE}
              </pre>
            </div>
          </div>

          {/* Nút đóng chân trang */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
            >
              Xác nhận & Đóng lại
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}