import { useState, useEffect, useMemo } from 'react';
import { INITIAL_JOBS, DEFAULT_APPS_SCRIPT_URL, DEFAULT_SHEET_URL } from '../constants/crmConstants';

export function useCrmJobs() {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('fb_crm_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  // SỬA: Khởi tạo kèm cơ chế Fallback về link mặc định
  const [sheetUrl, setSheetUrl] = useState(() => {
    const saved = localStorage.getItem('fb_crm_sheet_url');
    return saved !== null ? saved : DEFAULT_SHEET_URL;
  });

  const [appsScriptUrl, setAppsScriptUrl] = useState(() => {
    const saved = localStorage.getItem('fb_crm_script_url');
    return saved !== null ? saved : DEFAULT_APPS_SCRIPT_URL;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [warningFilter, setWarningFilter] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  useEffect(() => { localStorage.setItem('fb_crm_jobs', JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem('fb_crm_sheet_url', sheetUrl); }, [sheetUrl]);
  useEffect(() => { localStorage.setItem('fb_crm_script_url', appsScriptUrl); }, [appsScriptUrl]);

  const showToast = (message: string, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // Tính toán trước bản đồ trùng lặp O(N)
  const duplicateMaps = useMemo(() => {
    const phoneMap: Record<string, number> = {};
    const addressMap: Record<string, number> = {};

    jobs.forEach((job: any) => {
      const cleanPhone = job.phone ? job.phone.trim().replace(/\s+/g, '') : '';
      const cleanAddr = job.address ? job.address.trim().toLowerCase().replace(/\s+/g, '') : '';
      if (cleanPhone && cleanPhone.length > 4) phoneMap[cleanPhone] = (phoneMap[cleanPhone] || 0) + 1;
      if (cleanAddr && cleanAddr.length > 8) addressMap[cleanAddr] = (addressMap[cleanAddr] || 0) + 1;
    });
    return { phoneMap, addressMap };
  }, [jobs]);

  const checkDuplicate = (job: any) => {
    const cleanPhone = job.phone ? job.phone.trim().replace(/\s+/g, '') : '';
    const cleanAddr = job.address ? job.address.trim().toLowerCase().replace(/\s+/g, '') : '';
    const isPhoneDup = cleanPhone && duplicateMaps.phoneMap[cleanPhone] > 1;
    const isAddrDup = cleanAddr && duplicateMaps.addressMap[cleanAddr] > 1;
    return { isPhoneDup, isAddrDup, isAnyDup: isPhoneDup || isAddrDup };
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job: any) => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.phone.includes(searchQuery) ||
        job.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
      const matchesWarning = !warningFilter || checkDuplicate(job).isAnyDup;
      return matchesSearch && matchesStatus && matchesWarning;
    });
  }, [jobs, searchQuery, statusFilter, warningFilter, duplicateMaps]);

  const stats = useMemo(() => {
    const total = jobs.length;
    const pending = jobs.filter((j: any) => j.status === "Chờ phản hồi").length;
    const interviewed = jobs.filter((j: any) => j.status === "Đã phỏng vấn").length;
    const passed = jobs.filter((j: any) => j.status === "Trúng tuyển").length;
    const rejected = jobs.filter((j: any) => j.status === "Từ chối").length;
    const suspicious = jobs.filter((j: any) => checkDuplicate(j).isAnyDup).length;
    return { total, pending, interviewed, passed, rejected, suspicious };
  }, [jobs, duplicateMaps]);

  const saveJob = (jobData: any) => {
    let updatedJobs;
    if (jobs.some((j: any) => j.id === jobData.id)) {
      updatedJobs = jobs.map((j: any) => j.id === jobData.id ? jobData : j);
      showToast("Cập nhật tin tuyển dụng thành công!");
    } else {
      updatedJobs = [jobData, ...jobs];
      showToast("Đã lưu tin tuyển dụng mới!");
    }
    setJobs(updatedJobs);
    if (appsScriptUrl) syncWithGoogleSheets(updatedJobs);
  };

  const deleteJob = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết tuyển dụng này không?")) {
      const updatedJobs = jobs.filter((j: any) => j.id !== id);
      setJobs(updatedJobs);
      showToast("Đã xóa tin tuyển dụng thành công!", "info");
      if (appsScriptUrl) syncWithGoogleSheets(updatedJobs);
    }
  };

  const quickUpdateStatus = (id: string, newStatus: string) => {
    const updatedJobs = jobs.map((j: any) => j.id === id ? { ...j, status: newStatus } : j);
    setJobs(updatedJobs);
    showToast(`Đã chuyển trạng thái thành "${newStatus}"!`);
    if (appsScriptUrl) syncWithGoogleSheets(updatedJobs);
  };

const syncWithGoogleSheets = async (jobsToSync: any[] = jobs) => {
  setIsSyncing(true);
  try {
    const response = await fetch(appsScriptUrl, {
      method: "POST",
      // ❌ KHÔNG dùng 'application/json' vì sẽ kích hoạt Preflight CORS
      // ✅ BẮT BUỘC dùng 'text/plain' để trình duyệt gửi "Simple Request" bypass CORS
      headers: {
        "Content-Type": "text/plain;charset=utf-8", 
      },
      body: JSON.stringify({
        action: "sync_all",
        data: jobsToSync, // Hoặc tên state danh sách job trong hook của bạn
      }),
    });

    // Google Web App khi thành công/chuyển hướng có thể không trả về trực tiếp JSON qua fetch chuẩn
    // Bạn nên check block try/catch này để nhận thông báo thành công
    const result = await response.json();
    if (result.status === "success") {
      // Gọi hàm showToast hoặc hiển thị thành công tại đây
    }
  } catch (error) {
    console.error("Lỗi kết nối:", error);
    // Nếu dữ liệu vẫn ăn vào Sheet thành công mà nhảy vào catch, đó là do cơ chế redirect 302 của Google.
  } finally {
    setIsSyncing(false);
  }
};

  const fetchFromSheets = async () => {
    if (!appsScriptUrl) return showToast("Vui lòng cấu hình URL Apps Script trước!", "error");
    setIsSyncing(true);
    try {
      const response = await fetch(`${appsScriptUrl}?action=get_all`);
      const result = await response.json();
      if (Array.isArray(result) && result.length > 0) {
        setJobs(result);
        showToast(`Đồng bộ thành công! Đã tải về ${result.length} dòng dữ liệu.`);
      } else {
        showToast("Không tìm thấy dữ liệu phù hợp.", "warning");
      }
    } catch (error) {
      showToast("Lỗi tải dữ liệu từ Google Sheets!", "error");
    } finally { setIsSyncing(false); }
  };

  return {
    jobs, filteredJobs, stats, sheetUrl, setSheetUrl, appsScriptUrl, setAppsScriptUrl,
    searchQuery, setSearchQuery, statusFilter, setStatusFilter, warningFilter, setWarningFilter,
    isSyncing, toasts, checkDuplicate, saveJob, deleteJob, quickUpdateStatus, fetchFromSheets, syncWithGoogleSheets
  };
}