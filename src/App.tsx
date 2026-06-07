import { useState } from 'react';
import { useCrmJobs } from './hooks/useCrmJobs';
import DashboardStats from './components/DashboardStats';
import FilterBar from './components/FilterBar';
import JobTable from './components/JobTable';
import JobFormModal from './components/JobFormModal';

export default function App() {
  const {
    filteredJobs, stats, searchQuery, setSearchQuery, statusFilter, setStatusFilter,
    warningFilter, setWarningFilter, categoryFilter, setCategoryFilter, isLoading, toasts,
    checkDuplicate, saveJob, deleteJob, quickUpdateStatus, fetchJobs
  } = useCrmJobs();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 min-h-[4rem] py-3 md:py-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💼</span>
            <div>
              <h1 className="text-base font-black text-slate-900 tracking-tight uppercase">Buid Recruitment CRM</h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Supabase Cloud Database System</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 self-end sm:self-auto">
            {/* Nút Làm mới dữ liệu thủ công từ Supabase Cloud */}
            <button 
              onClick={fetchJobs}
              disabled={isLoading}
              className="p-2.5 bg-slate-100 text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-200 transition-all text-xs font-bold flex items-center space-x-1"
              title="Tải lại dữ liệu"
            >
              <span className={isLoading ? "animate-spin" : ""}>🔄</span>
            </button>

            {/* Nút thêm mới tin tuyển dụng */}
            <button 
              onClick={() => { setSelectedJob(null); setIsFormOpen(true); }}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-all transform hover:scale-[1.01]"
            >
              + Thêm bài đăng mới
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="fixed top-0 left-0 w-full h-1 bg-indigo-600 animate-pulse z-50" />
        )}

        <DashboardStats stats={stats} />
        
        <FilterBar 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          warningFilter={warningFilter} setWarningFilter={setWarningFilter}
          categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
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

      {/* TOAST SYSTEM POPUPS */}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto space-y-2 z-50 max-w-sm">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xl ${t.type === 'error' ? 'bg-rose-500 shadow-rose-500/10' : 'bg-slate-900 shadow-slate-900/10'} border border-white/10 animate-slide-up`}>
            {t.type === 'error' ? '❌ ' : '✨ '} {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}