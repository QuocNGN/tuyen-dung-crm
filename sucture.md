src/
│
├── constants/
│   └── crmConstants.ts       # Chứa INITIAL_JOBS, STATUS_OPTIONS, googleAppsScriptCode
│
├── hooks/
│   └── useCrmJobs.ts         # Custom Hook xử lý toàn bộ State, CRUD và Sync Logic
│
├── components/
│   ├── DashboardStats.tsx    # Thanh thống kê số liệu (6 card)
│   ├── FilterBar.tsx         # Thanh tìm kiếm, dropdown lọc trạng thái
│   ├── JobTable.tsx          # Bảng hiển thị danh sách công việc
│   ├── JobFormModal.tsx      # Modal thêm/sửa công việc
│   └── GoogleSheetsModal.tsx # Modal cấu hình và lấy mã Apps Script
│
└── App.tsx                   # File tổng đóng vai trò entrypoint (Clean & High-level)