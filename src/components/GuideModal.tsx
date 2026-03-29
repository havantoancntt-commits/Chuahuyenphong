import { motion } from 'framer-motion';
import { X, Heart, Flame, User, BookOpen, Sparkles } from 'lucide-react';

interface GuideModalProps {
  onClose: () => void;
}

export function GuideModal({ onClose }: GuideModalProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar bg-zinc-900/90 border border-amber-500/30 rounded-3xl shadow-[0_0_50px_rgba(251,191,36,0.1)] text-amber-50"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-amber-500/20 bg-zinc-900/95 backdrop-blur-sm">
          <h2 className="text-xl sm:text-2xl font-medium tracking-wider text-amber-200 flex items-center gap-3">
            <BookOpen size={24} className="text-amber-400" />
            Hướng Dẫn Lễ Bái
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-amber-200/70 hover:text-amber-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8 font-light leading-relaxed text-sm sm:text-base">
          
          {/* Section 1: Tâm Thế */}
          <section className="space-y-3">
            <h3 className="text-lg font-medium text-amber-300 flex items-center gap-2">
              <Heart size={20} className="text-rose-400" />
              1. Chuẩn Bị Tâm Thế
            </h3>
            <p className="text-amber-100/80 pl-7">
              Trước khi bước vào không gian tâm linh, hãy giữ cho tâm trí thanh tịnh, gạt bỏ mọi tạp niệm và lo âu thường nhật. Trang phục cần gọn gàng, kín đáo. Sự thành tâm là yếu tố quan trọng nhất để kết nối với chư Phật và thần linh.
            </p>
          </section>

          {/* Section 2: Dâng Hương */}
          <section className="space-y-3">
            <h3 className="text-lg font-medium text-amber-300 flex items-center gap-2">
              <Flame size={20} className="text-orange-400" />
              2. Nghi Thức Dâng Hương
            </h3>
            <div className="text-amber-100/80 pl-7 space-y-2">
              <p>Dâng hương (thắp nhang) là nhịp cầu giao tiếp giữa thế giới hữu hình và vô hình. Thông thường, người ta thắp 3 nén hương tượng trưng cho:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-amber-200/70">
                <li><strong className="text-amber-200 font-normal">Giới hương:</strong> Nhắc nhở giữ gìn giới luật, sống đạo đức.</li>
                <li><strong className="text-amber-200 font-normal">Định hương:</strong> Giữ tâm kiên định, không xao động trước cám dỗ.</li>
                <li><strong className="text-amber-200 font-normal">Tuệ hương:</strong> Khai mở trí tuệ, thấu hiểu chân lý.</li>
              </ul>
              <p className="pt-2"><strong>Cách cầm:</strong> Dùng hai tay cầm hương, dâng cao ngang trán, cắm hương thẳng đứng vào bát nhang bằng hai tay để thể hiện sự ngay thẳng và tôn kính.</p>
            </div>
          </section>

          {/* Section 3: Lễ Bái */}
          <section className="space-y-3">
            <h3 className="text-lg font-medium text-amber-300 flex items-center gap-2">
              <User size={20} className="text-amber-400" />
              3. Nghi Thức Lễ Bái (Lạy)
            </h3>
            <div className="text-amber-100/80 pl-7 space-y-2">
              <p>Lễ bái là cách hạ mình thấp nhất để thể hiện sự tôn kính tột cùng. Tư thế chuẩn nhất là <strong>"Ngũ thể đầu địa"</strong> (năm vóc gieo sát đất):</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-amber-200/70">
                <li>Hai bàn tay, hai đầu gối và trán phải chạm hoàn toàn xuống đất.</li>
                <li>Hai bàn tay ngửa ra như đang nâng đỡ bàn chân của Đức Phật.</li>
              </ul>
              <p className="pt-2">Thường lạy 3 lạy tượng trưng cho việc quy y Tam Bảo: <strong>Phật, Pháp, Tăng</strong>.</p>
            </div>
          </section>

          {/* Section 4: Khấn Nguyện */}
          <section className="space-y-3">
            <h3 className="text-lg font-medium text-amber-300 flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-400" />
              4. Khấn Nguyện & Hồi Hướng
            </h3>
            <p className="text-amber-100/80 pl-7">
              Khi khấn nguyện, hãy khấn rõ ràng, rành mạch trong tâm. Nên cầu quốc thái dân an, gia đạo bình an, sức khỏe và trí tuệ sáng suốt trước khi cầu xin tài lộc cá nhân. Cuối cùng, đừng quên hồi hướng công đức cho muôn loài chúng sinh.
            </p>
          </section>

        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-amber-500/20 bg-zinc-900/95 backdrop-blur-sm flex justify-center">
          <button 
            onClick={onClose}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 text-amber-200 font-medium tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(251,191,36,0.1)] hover:shadow-[0_0_25px_rgba(251,191,36,0.2)]"
          >
            ĐÃ HIỂU
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
