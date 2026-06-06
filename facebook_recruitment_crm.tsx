import React, { useState, useEffect, useMemo } from 'react';

// === DỮ LIỆU MẪU BAN ĐẦU (Chứa cả thông tin trùng lặp để kiểm tra hệ thống cảnh báo) ===
const INITIAL_JOBS = [
  {
    id: "1",
    title: "Nhân viên phục vụ xoay ca",
    shopName: "The Coffee House - Chi nhánh Nguyễn Trãi",
    phone: "0901234567",
    address: "141 Nguyễn Trãi, Quận 1, TP.HCM",
    link: "https://facebook.com/groups/tuyendung/posts/112233",
    salary: "22,500đ - 25,000đ/giờ",
    requirements: "Nhanh nhẹn, trung thực, không cần kinh nghiệm, ưu tiên sinh viên.",
    benefits: "Phụ cấp gửi xe, giảm giá 50% nước uống, thưởng doanh số tháng.",
    status: "Chờ phản hồi",
    notes: "Đã nhắn tin qua Messenger cho chị quản lý.",
    dateAdded: "2026-06-01"
  },
  {
    id: "2",
    title: "Tuyển gấp Thu ngân & Pha chế",
    shopName: "Mây Tea & Coffee",
    phone: "0901234567", // TRÙNG SỐ ĐIỆN THOẠI VỚI ID 1 -> Sẽ cảnh báo!
    address: "320 Cách Mạng Tháng 8, Quận 3, TP.HCM",
    link: "https://facebook.com/groups/tuyendung/posts/445566",
    salary: "6,000,000đ - 8,000,000đ/tháng",
    requirements: "Có kinh nghiệm pha chế cơ bản là lợi thế, làm được lễ Tết.",
    benefits: "Thưởng chuyên cần 500k, nghỉ 2 ngày/tháng, bao ăn 1 bữa.",
    status: "Đã phỏng vấn",
    notes: "Hẹn phỏng vấn trực tiếp lúc 14:00 ngày mai mang theo CCCD.",
    dateAdded: "2026-06-03"
  },
  {
    id: "3",
    title: "Tuyển CTV Đóng gói bánh kẹo",
    shopName: "Tổng kho sỉ bánh kẹo An Bình",
    phone: "0988888888",
    address: "789 Đường Láng, Đống Đa, Hà Nội", // TRÙNG ĐỊA CHỈ VỚI ID 4 -> Sẽ cảnh báo!
    link: "https://facebook.com/groups/tuyendung/posts/778899",
    salary: "300,000đ/ngày (Nhận theo ngày)",
    requirements: "Cọc 200k tiền đồng phục và dụng cụ làm việc tại nhà.", // Yêu cầu khả nghi!
    benefits: "Làm việc tại nhà tự do thời gian.",
    status: "Từ chối",
    notes: "Yêu cầu chuyển khoản cọc trước -> Có dấu hiệu lừa đảo đa cấp!",
    dateAdded: "2026-06-04"
  },
  {
    id: "4",
    title: "Việc nhẹ lương cao đóng gói tại nhà",
    shopName: "Gia công mỹ nghệ Gia Bảo",
    phone: "0911223344",
    address: "789 Đường Láng, Đống Đa, Hà Nội", // TRÙNG ĐỊA CHỈ VỚI ID 3 -> Sẽ cảnh báo!
    link: "https://facebook.com/groups/tuyendung/posts/990011",
    salary: "10,000,000đ/tháng",
    requirements: "Chỉ cần điện thoại thông minh, không cần bằng cấp.",
    benefits: "Hỗ trợ nhận hàng tận nơi.",
    status: "Từ chối",
    notes: "Cùng địa chỉ với bên Kho An Bình, cực kỳ nghi vấn.",
    dateAdded: "2026-06-05"
  },
  {
    id: "5",
    title: "Nhân viên tư vấn bán hàng trực tiếp",
    shopName: "Cửa hàng Thời trang Routine",
    phone: "0977654321",
    address: "508 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    link: "https://facebook.com/groups/tuyendung/posts/223344",
    salary: "7,500,000đ + Doanh số",
    requirements: "Ngoại hình sáng, giao tiếp tốt, ca làm 8 tiếng linh hoạt.",
    benefits: "Đóng BHXH sau thử việc, thưởng nóng tuần, giảm giá mua đồ nội bộ.",
    status: "Trúng tuyển",
    notes: "Đã nhận việc, bắt đầu đi làm thử việc từ tuần sau.",
    dateAdded: "2026-06-05"
  }
];

// === ĐỊNH NGHĨA TRẠNG THÁI & MÀU SẮC ===
const STATUS_OPTIONS = [
  { name: "Chờ phản hồi", color: "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200" },
  { name: "Đã phỏng vấn", color: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200" },
  { name: "Trúng tuyển", color: "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200" },
  { name: "Từ chối", color: "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200" }
];

export default function App() {
  // --- STATE QUẢN LÝ ---
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('fb_crm_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [sheetUrl, setSheetUrl] = useState(() => {
    return localStorage.getItem('fb_crm_sheet_url') || 'https://docs.google.com/spreadsheets/d/1gu4FSNw0y8qqopd4tKbg3lcfB7eZ8seZ7UZSHDjZeVM/edit?usp=sharing';
  });

  const [appsScriptUrl, setAppsScriptUrl] = useState(() => {
    return localStorage.getItem('fb_crm_script_url') || '';
  });

  // Tìm kiếm & Lọc
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [warningFilter, setWarningFilter] = useState(false);

  // Form Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Trạng thái đồng bộ dữ liệu
  const [isSyncing, setIsSyncing] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formShop, setFormShop] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formSalary, setFormSalary] = useState('');
  const [formRequirements, setFormRequirements] = useState('');
  const [formBenefits, setFormBenefits] = useState('');
  const [formStatus, setFormStatus] = useState('Chờ phản hồi');
  const [formNotes, setFormNotes] = useState('');

  // Lưu trữ dữ liệu vào LocalStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('fb_crm_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('fb_crm_sheet_url', sheetUrl);
  }, [sheetUrl]);

  useEffect(() => {
    localStorage.setItem('fb_crm_script_url', appsScriptUrl);
  }, [appsScriptUrl]);

  // --- HÀM THÔNG BÁO TOAST ---
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // --- TÍNH TOÁN CẢNH BÁO TRÙNG LẶP ---
  // Đếm tần suất xuất hiện của SĐT và Địa chỉ để phát hiện trùng lặp
  const duplicateStats = useMemo(() => {
    const phoneMap = {};
    const addressMap = {};

    jobs.forEach(job => {
      const cleanPhone = job.phone ? job.phone.trim().replace(/\s+/g, '') : '';
      const cleanAddr = job.address ? job.address.trim().toLowerCase().replace(/\s+/g, '') : '';

      if (cleanPhone && cleanPhone.length > 4) {
        phoneMap[cleanPhone] = (phoneMap[cleanPhone] || 0) + 1;
      }
      if (cleanAddr && cleanAddr.length > 8) {
        addressMap[cleanAddr] = (addressMap[cleanAddr] || 0) + 1;
      }
    });

    return { phoneMap, addressMap };
  }, [jobs]);

  // Kiểm tra một công việc cụ thể có bị trùng thông tin hay không
  const checkDuplicate = (job) => {
    const cleanPhone = job.phone ? job.phone.trim().replace(/\s+/g, '') : '';
    const cleanAddr = job.address ? job.address.trim().toLowerCase().replace(/\s+/g, '') : '';
    
    const isPhoneDup = cleanPhone && duplicateStats.phoneMap[cleanPhone] > 1;
    const isAddrDup = cleanAddr && duplicateStats.addressMap[cleanAddr] > 1;

    return {
      isPhoneDup,
      isAddrDup,
      isAnyDup: isPhoneDup || isAddrDup
    };
  };

  // --- BỘ LỌC DANH SÁCH ---
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.phone.includes(searchQuery) ||
        job.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
      
      let matchesWarning = true;
      if (warningFilter) {
        const dupInfo = checkDuplicate(job);
        matchesWarning = dupInfo.isAnyDup;
      }

      return matchesSearch && matchesStatus && matchesWarning;
    });
  }, [jobs, searchQuery, statusFilter, warningFilter, duplicateStats]);

  // --- THỐNG KÊ DASHBOARD ---
  const stats = useMemo(() => {
    const total = jobs.length;
    const pending = jobs.filter(j => j.status === "Chờ phản hồi").length;
    const interviewed = jobs.filter(j => j.status === "Đã phỏng vấn").length;
    const passed = jobs.filter(j => j.status === "Trúng tuyển").length;
    const rejected = jobs.filter(j => j.status === "Từ chối").length;
    
    // Đếm số lượng tin bị trùng lặp thông tin nghi vấn
    const suspicious = jobs.filter(j => {
      const dup = checkDuplicate(j);
      return dup.isAnyDup;
    }).length;

    return { total, pending, interviewed, passed, rejected, suspicious };
  }, [jobs, duplicateStats]);

  // --- XỬ LÝ SỰ KIỆN CRUD ---
  const openForm = (job = null) => {
    if (job) {
      setCurrentJob(job);
      setFormTitle(job.title);
      setFormShop(job.shopName);
      setFormPhone(job.phone);
      setFormAddress(job.address);
      setFormLink(job.link);
      setFormSalary(job.salary);
      setFormRequirements(job.requirements);
      setFormBenefits(job.benefits);
      setFormStatus(job.status);
      setFormNotes(job.notes);
    } else {
      setCurrentJob(null);
      setFormTitle('');
      setFormShop('');
      setFormPhone('');
      setFormAddress('');
      setFormLink('');
      setFormSalary('');
      setFormRequirements('');
      setFormBenefits('');
      setFormStatus('Chờ phản hồi');
      setFormNotes('');
    }
    setIsFormOpen(true);
  };

  const handleSaveJob = (e) => {
    e.preventDefault();

    if (!formTitle || !formShop) {
      showToast("Vui lòng điền đủ Tên công việc và Tên cửa hàng!", "error");
      return;
    }

    const jobData = {
      id: currentJob ? currentJob.id : Date.now().toString(),
      title: formTitle,
      shopName: formShop,
      phone: formPhone,
      address: formAddress,
      link: formLink,
      salary: formSalary,
      requirements: formRequirements,
      benefits: formBenefits,
      status: formStatus,
      notes: formNotes,
      dateAdded: currentJob ? currentJob.dateAdded : new Date().toISOString().split('T')[0]
    };

    let updatedJobs;
    if (currentJob) {
      // Cập nhật
      updatedJobs = jobs.map(j => j.id === currentJob.id ? jobData : j);
      showToast("Cập nhật tin tuyển dụng thành công!");
    } else {
      // Thêm mới
      updatedJobs = [jobData, ...jobs];
      showToast("Đã lưu tin tuyển dụng mới!");
    }

    setJobs(updatedJobs);
    setIsFormOpen(false);

    // Kiểm tra trùng lặp ngay sau khi lưu để thông báo cảnh báo sớm
    setTimeout(() => {
      const freshDup = checkDuplicate(jobData);
      if (freshDup.isAnyDup) {
        showToast(
          `Cảnh báo: Phát hiện thông tin (${freshDup.isPhoneDup ? "SĐT" : ""}${freshDup.isPhoneDup && freshDup.isAddrDup ? " và " : ""}${freshDup.isAddrDup ? "Địa chỉ" : ""}) trùng lặp với tin khác!`, 
          'warning'
        );
      }
    }, 500);

    // Đồng bộ lên Google Sheets nếu có cài đặt API Script
    if (appsScriptUrl) {
      syncWithGoogleSheets(updatedJobs);
    }
  };

  const handleDeleteJob = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết tuyển dụng này không?")) {
      const updatedJobs = jobs.filter(j => j.id !== id);
      setJobs(updatedJobs);
      showToast("Đã xóa tin tuyển dụng thành công!", "info");
      
      if (appsScriptUrl) {
        syncWithGoogleSheets(updatedJobs);
      }
    }
  };

  const handleQuickStatusChange = (id, newStatus) => {
    const updatedJobs = jobs.map(j => {
      if (j.id === id) {
        return { ...j, status: newStatus };
      }
      return j;
    });
    setJobs(updatedJobs);
    showToast(`Đã chuyển trạng thái thành "${newStatus}"!`);

    if (appsScriptUrl) {
      syncWithGoogleSheets(updatedJobs);
    }
  };

  // --- ĐỒNG BỘ GOOGLE SHEETS QUA APPS SCRIPT ---
  const syncWithGoogleSheets = async (dataToSync = jobs) => {
    if (!appsScriptUrl) {
      showToast("Chưa cấu hình URL Google Apps Script. Dữ liệu chỉ lưu tạm ở trình duyệt.", "warning");
      return;
    }

    setIsSyncing(true);
    try {
      // Gửi toàn bộ danh sách để đồng bộ ghi đè lên Google Sheet
      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Dùng no-cors để tránh lỗi CORS từ phía client với Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sync_all',
          data: dataToSync
        })
      });

      showToast("Đã gửi lệnh đồng bộ lên Google Sheets!");
    } catch (error) {
      console.error("Lỗi đồng bộ:", error);
      showToast("Không thể kết nối đến Google Sheets Script!", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFetchFromSheets = async () => {
    if (!appsScriptUrl) {
      showToast("Vui lòng điền URL Google Apps Script Web App trước!", "error");
      return;
    }

    setIsSyncing(true);
    try {
      const response = await fetch(`${appsScriptUrl}?action=get_all`);
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      if (Array.isArray(result) && result.length > 0) {
        setJobs(result);
        showToast(`Đồng bộ thành công! Tải về ${result.length} dòng dữ liệu.`);
      } else {
        showToast("Không tìm thấy dữ liệu hoặc cấu trúc file Sheets không khớp.", "warning");
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      showToast("Lỗi tải dữ liệu! Hãy kiểm tra đã cấu hình Apps Script chuẩn xác chưa.", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  // --- MÃ APPS SCRIPT DÀNH CHO USER COPY ---
  const googleAppsScriptCode = `// 1. Vào Google Sheet của bạn (Mở link sheet)
// 2. Chọn Tiện ích mở rộng (Extensions) -> Apps Script
// 3. Xóa hết mã cũ và dán toàn bộ đoạn mã dưới đây vào:

function doGet(e) {
  var action = e.parameter.action;
  if (action === 'get_all') {
    return handleGetAll();
  }
  return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Invalid action"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    
    if (action === 'sync_all') {
      return handleSyncAll(postData.data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Invalid action"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleGetAll() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
  
  var headers = data[0];
  var jsonArray = [];
  
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    jsonArray.push(obj);
  }
  
  return ContentService.createTextOutput(JSON.stringify(jsonArray))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}

function handleSyncAll(jobsList) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear(); // Xóa sạch dữ liệu cũ để cập nhật mới nhất
  
  var headers = ["id", "title", "shopName", "phone", "address", "link", "salary", "requirements", "benefits", "status", "notes", "dateAdded"];
  sheet.appendRow(headers);
  
  for (var i = 0; i < jobsList.length; i++) {
    var job = jobsList[i];
    var row = [
      job.id || "",
      job.title || "",
      job.shopName || "",
      job.phone || "",
      job.address || "",
      job.link || "",
      job.salary || "",
      job.requirements || "",
      job.benefits || "",
      job.status || "Chờ phản hồi",
      job.notes || "",
      job.dateAdded || ""
    ];
    sheet.appendRow(row);
  }
  
  return ContentService.createTextOutput(JSON.stringify({status: "success", message: "Synced " + jobsList.length + " jobs"}))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}

// 4. Nhấn nút "Triển khai" (Deploy) -> "Triển khai mới" (New deployment)
// 5. Chọn loại triển khai là: "Ứng dụng web" (Web app)
// 6. Cấu hình: 
//    - Ai có quyền truy cập (Who has access): Chọn "Mọi người" (Anyone)
//    - Thực thi dưới danh nghĩa (Execute as): Chọn "Tôi" (Me)
// 7. Nhấn "Triển khai", Cấp quyền truy cập nếu được hỏi, rồi Copy lấy "URL ứng dụng web" dán vào ô cấu hình trên web CRM này!`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* HEADER BAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r bg-clip-text text-transparent from-indigo-600 to-violet-600">FB RECRUIT CRM</h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide">TRÌNH QUẢN LÝ TUYỂN DỤNG CÁ NHÂN v1.2</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsSyncModalOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Kết nối Sheets Database</span>
            </button>

            <button 
              onClick={() => openForm()}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-100 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Thêm Tin Tuyển Dụng</span>
            </button>
          </div>
        </div>
      </header>

      {/* CORE CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* BANNER CẢNH BÁO TRÙNG LẶP CHUNG */}
        {stats.suspicious > 0 && (
          <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg shadow-sm flex items-start justify-between">
            <div className="flex space-x-3">
              <div className="p-1 text-rose-500">
                <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-900">PHÁT HIỆN TIN TUYỂN DỤNG TRÙNG LẶP THÔNG TIN</h3>
                <p className="text-xs text-rose-700 mt-1">
                  Đang có <span className="font-bold">{stats.suspicious}</span> bài tuyển dụng có chung Số điện thoại hoặc Địa chỉ làm việc. Hãy rà soát kỹ để phòng tránh lừa đảo, trung gian đa cấp dụ dỗ đóng tiền cọc hoặc việc nhẹ lương cao không minh bạch!
                </p>
              </div>
            </div>
            <button 
              onClick={() => { setWarningFilter(true); setStatusFilter('All'); }}
              className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-3 py-1.5 rounded-md transition"
            >
              Lọc Ngay Bài Trùng Lặp ({stats.suspicious})
            </button>
          </div>
        )}

        {/* STATS DASHBOARD BAR */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          
          {/* Card 1: Tổng số */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">TỔNG THU THẬP</p>
              <h4 className="text-xl font-black text-slate-800">{stats.total} tin</h4>
            </div>
          </div>

          {/* Card 2: Chờ phản hồi */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
            <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">CHỜ PHẢN HỒI</p>
              <h4 className="text-xl font-black text-amber-600">{stats.pending} tin</h4>
            </div>
          </div>

          {/* Card 3: Đã phỏng vấn */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">ĐÃ PHỎNG VẤN</p>
              <h4 className="text-xl font-black text-blue-600">{stats.interviewed} tin</h4>
            </div>
          </div>

          {/* Card 4: Trúng tuyển */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">TRÚNG TUYỂN</p>
              <h4 className="text-xl font-black text-emerald-600">{stats.passed} tin</h4>
            </div>
          </div>

          {/* Card 5: Từ chối */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
            <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">TỪ CHỐI / BLOCK</p>
              <h4 className="text-xl font-black text-rose-600">{stats.rejected} tin</h4>
            </div>
          </div>

          {/* Card 6: Đáng ngờ */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
            <div className={`p-2 rounded-lg ${stats.suspicious > 0 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">ĐÁNG NGỜ (TRÙNG)</p>
              <h4 className={`text-xl font-black ${stats.suspicious > 0 ? 'text-red-600' : 'text-slate-600'}`}>{stats.suspicious} tin</h4>
            </div>
          </div>

        </section>

        {/* SEARCH, FILTER & ACTION BAR */}
        <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Thanh tìm kiếm */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Tìm theo tên công việc, SĐT, cửa hàng, địa chỉ..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Nhóm bộ lọc */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Lọc Trạng thái */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trạng thái:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="All">Tất cả trạng thái</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.name} value={opt.name}>{opt.name}</option>
                ))}
              </select>
            </div>

            {/* Lọc Trùng lặp (Warning) */}
            <button 
              onClick={() => setWarningFilter(!warningFilter)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                warningFilter 
                  ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <svg className={`w-4 h-4 ${warningFilter ? 'text-rose-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Xem bài trùng lặp</span>
            </button>

            {/* Chỉ Reset nhanh các bộ lọc */}
            {(searchQuery || statusFilter !== 'All' || warningFilter) && (
              <button 
                onClick={() => { setSearchQuery(''); setStatusFilter('All'); setWarningFilter(false); }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1"
              >
                Xóa lọc
              </button>
            )}

          </div>
        </section>

        {/* MAIN JOBS TABLE */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredJobs.length === 0 ? (
            <div className="py-16 text-center">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-slate-600 font-bold text-base">Không tìm thấy dữ liệu</h3>
              <p className="text-slate-400 text-xs mt-1">Không có tin tuyển dụng nào phù hợp với bộ lọc hiện tại của bạn.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Thông tin công việc</th>
                    <th className="py-4 px-4">Số điện thoại</th>
                    <th className="py-4 px-4">Địa chỉ làm việc</th>
                    <th className="py-4 px-4">Mức lương / Mô tả</th>
                    <th className="py-4 px-4 text-center">Trạng thái</th>
                    <th className="py-4 px-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredJobs.map((job) => {
                    const dupInfo = checkDuplicate(job);
                    const statusObj = STATUS_OPTIONS.find(opt => opt.name === job.status) || STATUS_OPTIONS[0];

                    return (
                      <tr 
                        key={job.id} 
                        className={`hover:bg-slate-50 transition ${dupInfo.isAnyDup ? 'bg-red-50/20' : ''}`}
                      >
                        {/* Cột 1: Thông tin chính */}
                        <td className="py-4 px-6 max-w-sm">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 line-clamp-1 hover:text-indigo-600 transition">
                              {job.title}
                            </span>
                            <span className="text-xs text-slate-500 font-medium mt-0.5">{job.shopName}</span>
                            <div className="flex items-center space-x-3 mt-2 text-xs">
                              <span className="text-slate-400">Thêm: {job.dateAdded}</span>
                              {job.link && (
                                <a 
                                  href={job.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-indigo-500 hover:text-indigo-700 font-semibold inline-flex items-center space-x-0.5"
                                >
                                  <span>Bài viết FB</span>
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Cột 2: SĐT + Cảnh báo */}
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-1.5">
                            <span className={`font-mono text-xs font-semibold px-2 py-1.5 rounded-lg ${
                              dupInfo.isPhoneDup 
                                ? 'bg-rose-100 text-rose-800 border border-rose-300 font-bold animate-pulse' 
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {job.phone || 'N/A'}
                            </span>
                            {dupInfo.isPhoneDup && (
                              <div className="relative group">
                                <span className="cursor-help text-rose-500">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </span>
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 hidden group-hover:block bg-rose-950 text-white text-[11px] p-2 rounded shadow-lg z-50">
                                  Cảnh báo: Số điện thoại này trùng lắp ở nhiều bài đăng tuyển dụng khác!
                                </div>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Cột 3: Địa chỉ + Cảnh báo */}
                        <td className="py-4 px-4 max-w-xs">
                          <div className="flex items-start space-x-1.5">
                            <div className="flex-1">
                              <p className={`text-xs line-clamp-2 ${dupInfo.isAddrDup ? 'text-rose-700 font-semibold' : 'text-slate-600'}`}>
                                {job.address || 'N/A'}
                              </p>
                            </div>
                            {dupInfo.isAddrDup && (
                              <div className="relative group flex-shrink-0 mt-0.5">
                                <span className="cursor-help text-rose-500">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </span>
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 hidden group-hover:block bg-rose-950 text-white text-[11px] p-2 rounded shadow-lg z-50">
                                  Cảnh báo: Địa điểm/Địa chỉ này đã xuất hiện ở bài viết tuyển dụng khác!
                                </div>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Cột 4: Lương & Mô tả nhanh */}
                        <td className="py-4 px-4 max-w-xs">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-indigo-700">{job.salary || 'Thỏa thuận'}</span>
                            {job.requirements && (
                              <span className="text-slate-500 text-[11px] line-clamp-1 mt-0.5 italic">Yêu cầu: {job.requirements}</span>
                            )}
                          </div>
                        </td>

                        {/* Cột 5: Trạng thái (Dropdown Tự Tô Màu) */}
                        <td className="py-4 px-4 text-center">
                          <div className="inline-block relative">
                            <select
                              value={job.status}
                              onChange={(e) => handleQuickStatusChange(job.id, e.target.value)}
                              className={`text-xs font-bold border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer transition ${statusObj.color}`}
                            >
                              {STATUS_OPTIONS.map(opt => (
                                <option key={opt.name} value={opt.name} className="bg-white text-slate-800 font-normal">
                                  {opt.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        {/* Cột 6: Thao tác */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => openForm(job)}
                              title="Sửa tin này"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-indigo-600 rounded-md transition"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              title="Xóa tin này"
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-md transition"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-100 border-t border-slate-200 py-8 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-500 mb-1">FB RECRUIT CRM - Hệ thống quản lý tuyển dụng hiệu quả bảo mật cá nhân</p>
          <p className="max-w-xl mx-auto leading-relaxed">
            Dữ liệu tuyển dụng tự động phân tích và chỉ ra các địa điểm và số điện thoại bị spam trùng lặp giúp bạn nhanh chóng loại bỏ tin rác, tin giả của môi giới đóng phí lừa đảo.
          </p>
        </div>
      </footer>

      {/* --- MODAL FORM: THÊM / CẬP NHẬT JOB --- */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden transform transition-all my-8">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between text-white">
              <h3 className="font-bold text-lg">
                {currentJob ? "Chỉnh Sửa Tin Tuyển Dụng" : "Thêm Bài Tuyển Dụng Mới"}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Grid 1: Tên công việc & Cửa hàng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Tên công việc / Vị trí <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="VD: Nhân viên pha chế, Thu ngân..." 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Tên quán / Cửa hàng / Công ty <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="VD: Highlands Coffee, Shop Routine..." 
                    value={formShop}
                    onChange={(e) => setFormShop(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Grid 2: SĐT & Trạng thái ban đầu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Số điện thoại liên hệ</label>
                  <input 
                    type="tel" 
                    placeholder="VD: 090xxxxxxx" 
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Trạng thái xử lý</label>
                  <select 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.name} value={opt.name}>{opt.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ô 3: Địa chỉ cửa hàng */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Địa chỉ nơi làm việc</label>
                <input 
                  type="text" 
                  placeholder="Nhập địa chỉ chi tiết số nhà, tên đường..." 
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Ô 4: Link bài viết FB & Mức lương */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Mức lương công bố</label>
                  <input 
                    type="text" 
                    placeholder="VD: 25k/h hoặc 8 triệu/tháng" 
                    value={formSalary}
                    onChange={(e) => setFormSalary(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Link bài viết tuyển dụng (Facebook)</label>
                  <input 
                    type="url" 
                    placeholder="https://facebook.com/..." 
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Ô 5: Yêu cầu & Phúc lợi */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Các yêu cầu từ nhà tuyển dụng</label>
                <textarea 
                  rows="2"
                  placeholder="Yêu cầu giới tính, độ tuổi, bằng cấp, thời gian làm việc..." 
                  value={formRequirements}
                  onChange={(e) => setFormRequirements(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Phúc lợi & Mô tả công việc</label>
                <textarea 
                  rows="2"
                  placeholder="Mô tả công việc sẽ làm, bao ăn, hỗ trợ xăng xe, tiền thưởng..." 
                  value={formBenefits}
                  onChange={(e) => setFormBenefits(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              {/* Ô 6: Ghi chú cá nhân */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Ghi chú cá nhân tiến trình</label>
                <textarea 
                  rows="2"
                  placeholder="VD: Đã nhắn tin hẹn chiều thứ 3 qua gặp trực tiếp..." 
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-amber-50/50"
                ></textarea>
              </div>

              {/* Khối nút bấm cuối */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
                >
                  {currentJob ? "Lưu thay đổi" : "Lưu tin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL CẤU HÌNH & HƯỚNG DẪN GOOGLE SHEETS --- */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden transform transition-all my-8">
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
                onClick={() => setIsSyncModalOpen(false)}
                className="text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 p-1.5 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Điền Link */}
              <div className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Link Google Sheets của bạn:
                  </label>
                  <input 
                    type="text"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="Nhập đường dẫn Google Sheets..."
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
                    Khi điền link Web App này, mỗi thao tác thêm, sửa, xóa, đổi trạng thái trên web sẽ tự đồng bộ thẳng lên Google Sheet của bạn.
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <button
                    onClick={() => syncWithGoogleSheets()}
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
                    onClick={handleFetchFromSheets}
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
                      onClick={() => {
                        document.execCommand ? document.execCommand('copy') : null;
                        navigator.clipboard?.writeText(googleAppsScriptCode);
                        showToast("Đã copy mã Apps Script vào bộ nhớ tạm!");
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      <span>Sao chép mã</span>
                    </button>
                  </div>
                  <pre className="bg-slate-900 text-slate-300 text-[11px] p-4 rounded-xl font-mono max-h-60 overflow-y-auto border border-slate-800 leading-relaxed select-all">
                    {googleAppsScriptCode}
                  </pre>
                </div>
              </div>

              {/* Nút đóng */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button 
                  type="button"
                  onClick={() => setIsSyncModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
                >
                  Xác nhận & Đóng lại
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- TOAST NOTIFICATIONS (HỆ THỐNG THÔNG BÁO POPUP) --- */}
      <div className="fixed bottom-5 right-5 space-y-2.5 z-50 max-w-sm w-full">
        {toasts.map(toast => {
          let bgClass = "bg-slate-800 text-white";
          if (toast.type === "error") bgClass = "bg-rose-600 text-white";
          if (toast.type === "warning") bgClass = "bg-amber-500 text-white";
          if (toast.type === "info") bgClass = "bg-indigo-600 text-white";

          return (
            <div 
              key={toast.id}
              className={`px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 text-sm font-semibold transition-all transform translate-y-0 opacity-100 ${bgClass}`}
            >
              <span>{toast.message}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}