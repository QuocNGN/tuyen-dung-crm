// === DỮ LIỆU MẪU BAN ĐẦU ===
export const INITIAL_JOBS = [
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
    phone: "0901234567", // Trùng số điện thoại
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
    address: "789 Đường Láng, Đống Đa, Hà Nội", // Trùng địa chỉ
    link: "https://facebook.com/groups/tuyendung/posts/778899",
    salary: "300,000đ/ngày (Nhận theo ngày)",
    requirements: "Cọc 200k tiền đồng phục và dụng cụ làm việc tại nhà.",
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
    address: "789 Đường Láng, Đống Đa, Hà Nội", // Trùng địa chỉ
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
export const STATUS_OPTIONS = [
  { name: "Chờ phản hồi", color: "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200" },
  { name: "Đã phỏng vấn", color: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200" },
  { name: "Trúng tuyển", color: "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200" },
  { name: "Từ chối", color: "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200" }
];

// === THIẾT LẬP LIÊN KẾT MẶC ĐỊNH ===
export const DEFAULT_SHEET_URL = "https://docs.google.com/spreadsheets/d/1gu4FSNw0y8qqopd4tKbg3lcfB7eZ8seZ7UZSHDjZeVM/edit?usp=sharing";
export const DEFAULT_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxsfA2y8XKMudSsx191ju1AKdIMeV1k0Y-RSABKKLhRe9cGyvElbskIH8l1VakWWaG8GQ/exec";

// === MÃ APPS SCRIPT DÀNH CHO USER COPY ===
export const GOOGLE_APPS_SCRIPT_CODE = `function doGet(e) {
  var action = e.parameter.action;
  if (action === 'get_all') return handleGetAll();
  return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Invalid action"})).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var postData = JSON.parse(e.postData.contents);
    if (postData.action === 'sync_all') return handleSyncAll(postData.data);
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Invalid action"})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleGetAll() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
  var headers = data[0];
  var jsonArray = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {};c
    for (var j = 0; j < headers.length; j++) { obj[headers[j]] = data[i][j]; }
    jsonArray.push(obj);
  }
  return ContentService.createTextOutput(JSON.stringify(jsonArray)).setMimeType(ContentService.MimeType.JSON).setHeader("Access-Control-Allow-Origin", "*");
}

function handleSyncAll(jobsList) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();
  var headers = ["id", "title", "shopName", "phone", "address", "link", "salary", "requirements", "benefits", "status", "notes", "dateAdded"];
  sheet.appendRow(headers);
  for (var i = 0; i < jobsList.length; i++) {
    var job = jobsList[i];
    sheet.appendRow([job.id||"", job.title||"", job.shopName||"", job.phone||"", job.address||"", job.link||"", job.salary||"", job.requirements||"", job.benefits||"", job.status||"Chờ phản hồi", job.notes||"", job.dateAdded||""]);
  }
  return ContentService.createTextOutput(JSON.stringify({status: "success", message: "Synced " + jobsList.length + " jobs"})).setMimeType(ContentService.MimeType.JSON).setHeader("Access-Control-Allow-Origin", "*");
}`;