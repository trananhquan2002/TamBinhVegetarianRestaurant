export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-yellow-400 font-bold mb-4">Liên hệ</h4>
          <p>📍 Địa chỉ : B33 Ng. 70 P. Nguyễn Thị Định, Trung Hoà, Cầu Giấy, Hà Nội</p>
          <p>📞 Số điện thoại : 0984 832 086</p>
        </div>
        <div>
          <h4 className="text-yellow-400 font-bold mb-4">Tâm Bình</h4>
          <p className="text-sm">Buffet chay thanh đạm - hơn 50 món mỗi ngày</p>
        </div>
        <div>
          <h4 className="text-yellow-400 font-bold mb-4">Nhận ưu đãi</h4>
          <input className="w-full px-3 py-2 rounded mb-4 text-white border" placeholder="Email" />
          <button className="w-full bg-red-700 hover:bg-red-800 py-2 rounded cursor-pointer">Đăng ký</button>
        </div>
      </div>
      <div className="text-center text-sm border-t border-gray-700 py-4">© 2025 Nhà Hàng Chay Tâm Bình</div>
    </footer>
  )
}
