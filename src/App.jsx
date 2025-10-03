import { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [apiStatus, setApiStatus] = useState('Đang chờ kết nối...');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then((response) => response.json())
      .then((data) => {
        // --- THÊM DÒNG NÀY VÀO ---
        console.log("✅ Kết nối tới API thành công!", data);
        // -------------------------

        setApiStatus(data.status); // Cập nhật giao diện
      })
      .catch((error) => {
        console.error("❌ Lỗi khi kết nối tới API:", error);
        setApiStatus('Kết nối thất bại! Bạn đã chạy server backend chưa?');
      });
  }, []);

  return (
    <div>
      <h1>Trang Web Pizza Sắp Ra Mắt!</h1>
      <p>
        <strong>API Status:</strong> {apiStatus}
      </p>
    </div>
  );
}

export default App;