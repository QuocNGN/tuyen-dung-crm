import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../utils/supabaseClient';

export function useCrmJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [warningFilter, setWarningFilter] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Hàm tạo thông báo nhanh trên màn hình
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // 1. Tải toàn bộ dữ liệu từ Supabase về
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('date_added', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      console.error("Lỗi lấy dữ liệu từ Supabase:", error);
      showToast(error.message || "Không thể tải dữ liệu từ cơ sở dữ liệu!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động fetch dữ liệu khi ứng dụng được khởi chạy lần đầu
  useEffect(() => {
    fetchJobs();
  }, []);

  // 2. Hàm Thêm mới hoặc Cập nhật bản ghi công việc
  const saveJob = async (jobData: any) => {
    setIsLoading(true);
    try {
      // Chuẩn hóa dữ liệu tương thích với Database từ Camel Case của Frontend
      const dbPayload: any = {
        title: jobData.title,
        category: jobData.category || 'Others',
        shop_name: jobData.shopName,
        phone: jobData.phone,
        address: jobData.address,
        link: jobData.link,
        salary: jobData.salary,
        requirements: jobData.requirements,
        benefits: jobData.benefits,
        status: jobData.status,
        notes: jobData.notes,
        date_added: jobData.dateAdded || new Date().toISOString().split('T')[0]
      };

      if (jobData.id && jobData.id.trim() !== '') {
        // TRƯỜNG HỢP 1: CẬP NHẬT (Đã có ID từ trước)
        const { error } = await supabase
          .from('jobs')
          .update(dbPayload)
          .eq('id', jobData.id);

        if (error) throw error;
        showToast("Cập nhật thông tin thành công!");
      } else {
        // TRƯỜNG HỢP 2: THÊM MỚI (Chưa có ID)
        // Tuyệt đối không đưa thuộc tính 'id' vào đây để tránh bị dính giá trị null gửi lên database
        const { error } = await supabase
          .from('jobs')
          .insert([dbPayload]);

        if (error) throw error;
        showToast("Thêm tin tuyển dụng thành công!");
      }

      fetchJobs(); // Tải lại danh sách mới nhất từ cơ sở dữ liệu
    } catch (error: any) {
      console.error("Lỗi lưu dữ liệu:", error);
      showToast(error.message || "Lỗi trong quá trình ghi dữ liệu!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Xóa một tin tuyển dụng
  const deleteJob = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showToast("Đã xóa tin tuyển dụng thành công!");
      fetchJobs();
    } catch (error: any) {
      console.error("Lỗi xóa bản ghi:", error);
      showToast(error.message || "Không thể xóa bản ghi này!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Cập nhật trạng thái nhanh trên Table hàng loạt
  const quickUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Cập nhật state trực tiếp tại client để UI mượt mà hơn
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: newStatus } : j));
      showToast("Đã cập nhật trạng thái tin tuyển dụng!");
    } catch (error: any) {
      console.error("Lỗi cập nhật trạng thái nhanh:", error);
      showToast("Không thể cập nhật trạng thái!", "error");
    }
  };

  // Mapping dữ liệu từ Database (snake_case) về State Component (camelCase)
  const mappedJobs = useMemo(() => {
    return jobs.map(j => ({
      id: j.id,
      title: j.title,
      category: j.category,
      shopName: j.shop_name,
      phone: j.phone,
      address: j.address,
      link: j.link,
      salary: j.salary,
      requirements: j.requirements,
      benefits: j.benefits,
      status: j.status,
      notes: j.notes,
      dateAdded: j.date_added
    }));
  }, [jobs]);

  // Kiểm tra trùng lặp dựa trên dữ liệu hiện tại
  const checkDuplicate = (currentJob: any) => {
    let isPhoneDup = false;
    let isAddrDup = false;

    mappedJobs.forEach(j => {
      if (j.id === currentJob.id) return;
      if (currentJob.phone && j.phone && j.phone.trim() === currentJob.phone.trim()) {
        isPhoneDup = true;
      }
      if (currentJob.address && j.address && j.address.trim().toLowerCase() === currentJob.address.trim().toLowerCase()) {
        isAddrDup = true;
      }
    });

    return { isPhoneDup, isAddrDup, isAnyDup: isPhoneDup || isAddrDup };
  };

  // Xử lý bộ lọc tìm kiếm và trạng thái trùng lặp
  const filteredJobs = useMemo(() => {
    return mappedJobs.filter(job => {
      const matchStatus = statusFilter === 'All' || job.status === statusFilter;
      const matchCategory = categoryFilter === 'All' || job.category === categoryFilter;
      const cleanQuery = searchQuery.toLowerCase().trim();
      const matchSearch = !cleanQuery || job.title.toLowerCase().includes(cleanQuery)
        job.title.toLowerCase().includes(cleanQuery) ||
        (job.shopName && job.shopName.toLowerCase().includes(cleanQuery)) ||
        (job.phone && job.phone.includes(cleanQuery)) ||
        (job.address && job.address.toLowerCase().includes(cleanQuery));

      if (warningFilter) {
        const dup = checkDuplicate(job);
        return matchStatus && matchCategory && matchSearch && dup.isAnyDup;
      }
      return matchStatus && matchCategory && matchSearch;
    });
  }, [mappedJobs, searchQuery, statusFilter, categoryFilter, warningFilter]);

  // Tính toán thống kê dữ liệu cho Dashboard DashboardStats
  const stats = useMemo(() => {
    const summary = { total: mappedJobs.length, pending: 0, interviewed: 0, passed: 0, rejected: 0, suspicious: 0 };
    mappedJobs.forEach(j => {
      if (j.status === 'Chờ phản hồi') summary.pending++;
      else if (j.status === 'Đã liên hệ' || j.status === 'Hẹn phỏng vấn') summary.interviewed++;
      else if (j.status === 'Trúng tuyển') summary.passed++;
      else if (j.status === 'Từ chối / Block') summary.rejected++;

      if (checkDuplicate(j).isAnyDup) {
        summary.suspicious++;
      }
    });
    return summary;
  }, [mappedJobs]);

  return {
    filteredJobs, stats, searchQuery, setSearchQuery, statusFilter, setStatusFilter,
    warningFilter, setWarningFilter, categoryFilter, setCategoryFilter, isLoading, toasts,
    checkDuplicate, saveJob, deleteJob, quickUpdateStatus, fetchJobs
  };
}

// import { useState, useEffect, useMemo } from 'react';
// import { INITIAL_JOBS, DEFAULT_APPS_SCRIPT_URL, DEFAULT_SHEET_URL } from '../constants/crmConstants';

// export function useCrmJobs() {
//   const [jobs, setJobs] = useState(() => {
//     const saved = localStorage.getItem('fb_crm_jobs');
//     return saved ? JSON.parse(saved) : INITIAL_JOBS;
//   });

//   // Khởi tạo kèm cơ chế Fallback về link mặc định[cite: 7]
//   const [sheetUrl, setSheetUrl] = useState(() => {
//     const saved = localStorage.getItem('fb_crm_sheet_url');
//     return saved !== null ? saved : DEFAULT_SHEET_URL;
//   });

//   const [appsScriptUrl, setAppsScriptUrl] = useState(() => {
//     const saved = localStorage.getItem('fb_crm_script_url');
//     return saved !== null ? saved : DEFAULT_APPS_SCRIPT_URL;
//   });

//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [warningFilter, setWarningFilter] = useState(false);
//   const [isSyncing, setIsSyncing] = useState(false);
//   const [toasts, setToasts] = useState<any[]>([]);

//   useEffect(() => { localStorage.setItem('fb_crm_jobs', JSON.stringify(jobs)); }, [jobs]);
//   useEffect(() => { localStorage.setItem('fb_crm_sheet_url', sheetUrl); }, [sheetUrl]);
//   useEffect(() => { localStorage.setItem('fb_crm_script_url', appsScriptUrl); }, [appsScriptUrl]);

//   const showToast = (message: string, type = 'success') => {
//     const id = Date.now();
//     setToasts(prev => [...prev, { id, message, type }]);
//     setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
//   };

//   // Tính toán trước bản đồ trùng lặp O(N)[cite: 7]
//   const duplicateMaps = useMemo(() => {
//     const phoneMap: Record<string, number> = {};
//     const addressMap: Record<string, number> = {};

//     jobs.forEach((job: any) => {
//       const cleanPhone = job.phone ? job.phone.trim().replace(/\s+/g, '') : '';
//       const cleanAddr = job.address ? job.address.trim().toLowerCase().replace(/\s+/g, '') : '';
//       if (cleanPhone && cleanPhone.length > 4) phoneMap[cleanPhone] = (phoneMap[cleanPhone] || 0) + 1;
//       if (cleanAddr && cleanAddr.length > 8) addressMap[cleanAddr] = (addressMap[cleanAddr] || 0) + 1;
//     });
//     return { phoneMap, addressMap };
//   }, [jobs]);

//   const checkDuplicate = (job: any) => {
//     const cleanPhone = job.phone ? job.phone.trim().replace(/\s+/g, '') : '';
//     const cleanAddr = job.address ? job.address.trim().toLowerCase().replace(/\s+/g, '') : '';
//     const isPhoneDup = cleanPhone && duplicateMaps.phoneMap[cleanPhone] > 1;
//     const isAddrDup = cleanAddr && duplicateMaps.addressMap[cleanAddr] > 1;
//     return { isPhoneDup, isAddrDup, isAnyDup: isPhoneDup || isAddrDup };
//   };

//   const filteredJobs = useMemo(() => {
//     return jobs.filter((job: any) => {
//       const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         job.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         job.phone.includes(searchQuery) ||
//         job.address.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
//       const matchesWarning = !warningFilter || checkDuplicate(job).isAnyDup;
//       return matchesSearch && matchesStatus && matchesWarning;
//     });
//   }, [jobs, searchQuery, statusFilter, warningFilter, duplicateMaps]);

//   const stats = useMemo(() => {
//     const total = jobs.length;
//     const pending = jobs.filter((j: any) => j.status === "Chờ phản hồi").length;
//     const interviewed = jobs.filter((j: any) => j.status === "Đã phỏng vấn").length;
//     const passed = jobs.filter((j: any) => j.status === "Trúng tuyển").length;
//     const rejected = jobs.filter((j: any) => j.status === "Từ chối").length;
//     const suspicious = jobs.filter((j: any) => checkDuplicate(j).isAnyDup).length;
//     return { total, pending, interviewed, passed, rejected, suspicious };
//   }, [jobs, duplicateMaps]);

//   const saveJob = (jobData: any) => {
//     let updatedJobs;
//     if (jobs.some((j: any) => j.id === jobData.id)) {
//       updatedJobs = jobs.map((j: any) => j.id === jobData.id ? jobData : j);
//       showToast("Cập nhật tin tuyển dụng thành công!");
//     } else {
//       updatedJobs = [jobData, ...jobs];
//       showToast("Đã lưu tin tuyển dụng mới!");
//     }
//     setJobs(updatedJobs);
//     if (appsScriptUrl) syncWithGoogleSheets(updatedJobs);
//   };

//   const deleteJob = (id: string) => {
//     if (window.confirm("Bạn có chắc chắn muốn xóa bài viết tuyển dụng này không?")) {
//       const updatedJobs = jobs.filter((j: any) => j.id !== id);
//       setJobs(updatedJobs);
//       showToast("Đã xóa tin tuyển dụng thành công!", "info");
//       if (appsScriptUrl) syncWithGoogleSheets(updatedJobs);
//     }
//   };

//   const quickUpdateStatus = (id: string, newStatus: string) => {
//     const updatedJobs = jobs.map((j: any) => j.id === id ? { ...j, status: newStatus } : j);
//     setJobs(updatedJobs);
//     showToast(`Đã chuyển trạng thái thành "${newStatus}"!`);
//     if (appsScriptUrl) syncWithGoogleSheets(updatedJobs);
//   };

//   // ✅ ĐÃ SỬA CHUẨN: Hàm đẩy dữ liệu lên Google Sheets[cite: 7]
//   const syncWithGoogleSheets = async (jobsToSync: any[] = jobs) => {
//     if (!appsScriptUrl) return showToast("Vui lòng cấu hình URL Apps Script trước!", "error");
//     setIsSyncing(true);
//     try {
//       const response = await fetch(appsScriptUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "text/plain;charset=utf-8", // Bắt buộc text/plain để loại bỏ Preflight OPTIONS request tránh lỗi CORS
//         },
//         body: JSON.stringify({
//           action: "sync_all",
//           data: jobsToSync,
//         }),
//       });

//       const result = await response.json();
//       if (result && result.status === "success") {
//         showToast("Đẩy dữ liệu lên Google Sheets thành công!");
//       } else {
//         showToast(result.message || "Đồng bộ thất bại!", "error");
//       }
//     } catch (error) {
//       console.error("Lỗi kết nối:", error);
//       // Fallback cho trường hợp dữ liệu vẫn vào Sheet nhưng Google chặn nhận phản hồi JSON trực tiếp
//       showToast("Đã gửi lệnh đồng bộ lên Google Sheets!", "warning");
//     } finally {
//       setIsSyncing(false);
//     }
//   };

//   // ✅ ĐÃ SỬA CHUẨN: Hàm tải dữ liệu từ Google Sheets về Web[cite: 7]
//   const fetchFromSheets = async () => {
//     if (!appsScriptUrl) return showToast("Vui lòng cấu hình URL Apps Script trước!", "error");
//     setIsSyncing(true);
//     try {
//       const uniqueUrl = `${appsScriptUrl}?action=get_all&_t=${Date.now()}`;

//       const response = await fetch(uniqueUrl, {
//         method: "GET",
//         mode: "cors",
//         redirect: "follow" // Không thêm bất cứ thuộc tính headers: {} nào ở đây
//       });

//       const result = await response.json();

//       if (Array.isArray(result)) {
//         setJobs(result);
//         showToast(`Đồng bộ thành công! Đã tải về ${result.length} dòng dữ liệu.`);
//       } else if (result && result.status === "error") {
//         showToast(`Lỗi hệ thống: ${result.message}`, "error");
//       } else {
//         showToast("Định dạng dữ liệu trả về không hợp lệ.", "error");
//       }
//     } catch (error) {
//       console.error("Lỗi fetch dữ liệu:", error);
//       showToast("Lỗi kết nối hoặc chặn CORS khi tải dữ liệu!", "error");
//     } finally {
//       setIsSyncing(false);
//     }
//   };

//   return {
//     jobs, filteredJobs, stats, sheetUrl, setSheetUrl, appsScriptUrl, setAppsScriptUrl,
//     searchQuery, setSearchQuery, statusFilter, setStatusFilter, warningFilter, setWarningFilter,
//     isSyncing, toasts, checkDuplicate, saveJob, deleteJob, quickUpdateStatus, fetchFromSheets, syncWithGoogleSheets
//   };
// }