export default function AboutSection() {
  return (
    <section className="relative z-20 bg-[#1a1d23] text-white py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10">
              <img src="/assets/images/aboutTamBinh.png" alt="Về Tâm Bình" className="w-full h-auto object-cover rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5" />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-600/10 rounded-full blur-[80px] -z-10"></div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-10">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-normal">
                Chúng tôi là <br />
                <span className="text-red-500 not-italic">Tâm Bình</span>
              </h2>
            </div>
            <div className="space-y-12 text-gray-400 text-lg">
              <div className="relative pl-8 border-l-2 border-amber-600/40">
                <p className="italic text-gray-100 text-2xl font-light leading-relaxed">"Thực phẩm là yếu tố quan trọng xây dựng sức khoẻ, và ăn chay là chìa khóa của sự thịnh vượng!"</p>
              </div>
              <div className="space-y-8 font-light text-gray-300">
                <p className="leading-relaxed">
                  <strong className="text-white text-xl block mb-2">Hành trình nuôi dưỡng tâm hồn</strong>
                  Tâm Bình buffet chay là thiên đường ẩm thực dành cho những ai muốn khám phá hương vị tinh tế. Chúng tôi tự hào mang đến thực đơn hơn một trăm món chay đa dạng, từ khai vị nồng nàn đến món chính đậm đà.
                </p>
                <p className="pt-8 border-t border-white/5">
                  Tại đây, <span className="text-amber-500 font-medium">chất lượng là lời cam kết</span>. Từng nguyên liệu được đội ngũ đầu bếp giàu kinh nghiệm chắt lọc tỉ mỉ, gửi gắm trọn vẹn tình yêu vào mỗi vị giác của bạn.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-8 pt-6">
                <div>
                  <p className="text-4xl font-black text-white">50+</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-2">Món chay</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-white">10+</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-2">Năm kinh</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-white">100%</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-2">Sạch</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
