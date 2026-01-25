export default function AboutSection() {
  return (
    <section className="bg-[#222831] text-white py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="w-full lg:w-1/2 relative group">
          <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-105">
            <img 
              src="/assets/images/aboutTamBinh.png"
              alt="Về Tâm Bình"
              className="w-full h-auto object-cover rounded-3xl"
            />
          </div>
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-red-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-tight">
              Chúng tôi là <span className="text-red-500">Tâm Bình</span>
            </h2>
            <div className="w-20 h-1.5 bg-red-600 rounded-full"></div>
          </div>
          <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-medium">
            <p>
              Tại nhà hàng chay Tâm Bình, chúng tôi tin rằng ẩm thực không chỉ là việc lấp đầy dạ dày, mà còn là hành trình nuôi dưỡng tâm hồn. Mỗi món ăn được chế biến từ những nguyên liệu tươi ngon nhất, thuần khiết nhất từ thiên nhiên.
            </p>
            <p>
              Với không gian thanh tịnh và thực đơn buffet hơn 50 món chay đa dạng, chúng tôi mong muốn mang đến cho quý khách những giây phút bình yên, thư thái bên gia đình và người thân sau những giờ làm việc mệt mỏi.
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
  );
}