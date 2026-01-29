export default function AboutSection() {
  return (
    <section className="bg-[#222831] text-white py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="w-full lg:w-1/2 relative group">
          <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-105">
            <img src="/assets/images/aboutTamBinh.png" alt="Về Tâm Bình" className="w-full h-auto object-cover rounded-3xl" />
          </div>
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-red-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-tight">
              Chúng tôi là <span className="text-red-500">Tâm Bình</span>
            </h2>
          </div>
          <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-medium">
            <div className="border-l-4 border-amber-500 pl-4 py-1 italic text-gray-300 bg-gray-800/30 rounded-r-lg">"Thực phẩm là yếu tố quan trọng xây dựng sức khoẻ, và ăn chay là chìa khóa của sự thịnh vượng!"</div>
            <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-amber-500 first-letter:mr-1">
              <strong className="text-gray-200">Tâm Bình buffet chay</strong> là thiên đường ẩm thực dành cho những người ưa thích chế độ ăn chay và muốn khám phá những hương vị tinh tế. Chúng tôi tự hào với hơn một trăm món ăn chay đa dạng và phong phú trong thực đơn buffet, từ khai vị cho đến món chính và món tráng miệng.
            </p>
            <p>
              Chất lượng luôn là mục tiêu hàng đầu của chúng tôi. Chúng tôi sử dụng những
              <span className="text-amber-500/90 font-semibold"> nguyên liệu tươi ngon và tự nhiên nhất </span>
              để mang đến những món ăn thơm ngon, hấp dẫn và giàu chất dinh dưỡng. Đội ngũ đầu bếp giàu kinh nghiệm của chúng tôi chuẩn bị từng món ăn với tình yêu và sự tỉ mỉ, tạo nên những trải nghiệm ẩm thực tuyệt vời cho bạn.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-gray-800">
            <div>
              <p className="text-3xl font-black text-white">50+</p>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Món chay</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">10+</p>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Năm kinh nghiệm</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">100%</p>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Thuần chay</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
