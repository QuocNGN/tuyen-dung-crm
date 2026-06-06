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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-indigo-600">FB RECRUIT CRM</h1>
            <p className="text-[10px] text-slate-400 font-semibold">TRÌNH QUẢN LÝ TUYỂN DỤNG CÁ NHÂN v1.2</p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSyncModalOpen(true)} className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition">
              🔌 Kết nối Sheets Database
            </button>
            <button onClick={() => { setSelectedJob(null); setIsFormOpen(true); }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition">
              ➕ Thêm Tin Tuyển Dụng
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {stats.suspicious > 0 && (
          <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg text-xs text-rose-900 flex justify-between items-center">
            <p>🚨 Đang có <span className="font-bold">{stats.suspicious}</span> bài viết bị trùng lặp SĐT hoặc Địa chỉ. Hãy rà soát kỹ!</p>
            <button onClick={() => { setWarningFilter(true); setStatusFilter('All'); }} className="bg-rose-100 font-bold px-3 py-1.5 rounded-md hover:bg-rose-200">Lọc trùng lặp</button>
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

      {/* RENDER TOAST POPUPS */}
      <div className="fixed bottom-5 right-5 space-y-2 z-50 max-w-sm w-full">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-2.5 rounded-lg text-xs font-bold text-white shadow-lg ${t.type === 'error' ? 'bg-rose-600' : t.type === 'warning' ? 'bg-amber-500' : 'bg-slate-800'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}