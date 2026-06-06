import React, { useState } from 'react';
import { useCrmJobs } from './hooks/useCrmJobs';
import DashboardStats from './components/DashboardStats';
import FilterBar from './components/FilterBar';
import JobTable from './components/JobTable';
import JobFormModal from './components/JobFormModal';
import GoogleSheetsModal from './components/GoogleSheetsModal';

export default function App() {
  const {
    filteredJobs, stats, sheetUrl, setSheetUrl, appsScriptUrl, setAppsScriptUrl,
    searchQuery, setSearchQuery, statusFilter, setStatusFilter, warningFilter, setWarningFilter,
    isSyncing, toasts, checkDuplicate, saveJob, deleteJob, quickUpdateStatus, fetchFromSheets, syncWithGoogleSheets
  } = useCrmJobs();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* SỬA HEADER: Thay đổi padding từ h-16 cố định sang linh hoạt tự co giãn py-3 trên mobile */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 min-h-[4rem] py-3 md:py-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col justify-center">
            <h1 className="font-bold text-lg md:text-xl text-indigo-600 leading-tight">FB RECRUIT CRM</h1>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-semibold tracking-wider">TRÌNH QUẢN LÝ TUYỂN DỤNG CÁ NHÂN v1.2</p>
          </div>
          {/* Nút bấm tự dàn hàng ngang đều nhau trên mobile */}
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
            <button 
              onClick={() => setIsSyncModalOpen(true)} 
              className="flex-1 sm:flex-initial text-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs md:text-sm font-bold rounded-lg transition"
            >
              <span className="inline sm:hidden">🔌 Sheets DB</span>
              <span className="hidden sm:inline">🔌 Kết nối Sheets Database</span>
            </button>
            <button 
              onClick={() => { setSelectedJob(null); setIsFormOpen(true); }} 
              className="flex-1 sm:flex-initial text-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold rounded-lg transition whitespace-nowrap"
            >
              ➕ <span className="inline sm:hidden">Thêm Tin</span>
              <span className="hidden sm:inline">Thêm Tin Tuyển Dụng</span>
            </button>
          </div>
        </div>
      </header>

      {/* SỬA MAIN CONTAINER: Giảm bớt padding ngang trên mobile (px-3) để có thêm diện tích */}
      <main className="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-8">
        {stats.suspicious > 0 && (
          <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg text-xs text-rose-900 flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
            <p>🚨 Đang có <span className="font-bold">{stats.suspicious}</span> bài viết bị trùng lặp SĐT hoặc Địa chỉ. Hãy rà soát kỹ!</p>
            <button 
              onClick={() => { setWarningFilter(true); setStatusFilter('All'); }} 
              className="bg-rose-100 font-bold px-3 py-1.5 rounded-md hover:bg-rose-200 self-start sm:self-auto text-[11px]"
            >
              Lọc trùng lặp
            </button>
          </div>
        )}

        <DashboardStats stats={stats} />
        
        <FilterBar 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          warningFilter={warningFilter} setWarningFilter={setWarningFilter}
        />

        <JobTable 
          jobs={filteredJobs} 
          checkDuplicate={checkDuplicate}
          onEdit={(job) => { setSelectedJob(job); setIsFormOpen(true); }}
          onDelete={deleteJob}
          onStatusChange={quickUpdateStatus}
        />
      </main>

      {isFormOpen && (
        <JobFormModal job={selectedJob} onClose={() => setIsFormOpen(false)} onSave={saveJob} />
      )}

      {isSyncModalOpen && (
        <GoogleSheetsModal 
          sheetUrl={sheetUrl} setSheetUrl={setSheetUrl}
          appsScriptUrl={appsScriptUrl} setAppsScriptUrl={setAppsScriptUrl}
          isSyncing={isSyncing} onFetch={fetchFromSheets} onSync={() => syncWithGoogleSheets()}
          onClose={() => setIsSyncModalOpen(false)}
        />
      )}

      {/* TOAST POPUPS: Thu nhỏ kích thước một chút trên mobile để đỡ chiếm chỗ */}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto space-y-2 z-50 max-w-sm">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xl ${t.type === 'error' ? 'bg-rose-600' : t.type === 'warning' ? 'bg-amber-500' : 'bg-slate-800'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}