import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../lib/i18n';
import { useUserStats } from '../lib/userStats';
import { ChevronLeft, BookText, Sparkles, Heart, Briefcase, GraduationCap, Home, Plane, Cross, Wind } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (e) {
  console.warn("Failed to initialize GoogleGenAI:", e);
}

interface PrayerBookProps {
  onClose: () => void;
}

type PrayerCategory = 'daily' | 'wealth' | 'ancestor' | 'peace' | 'business' | 'health' | 'love' | 'travel';

interface Prayer {
  id: string;
  category: PrayerCategory;
  titleVi: string;
  titleEn: string;
  contentVi: string;
  contentEn: string;
}

const prayers: Prayer[] = [
  {
    id: 'p1',
    category: 'daily',
    titleVi: 'Văn khấn Thần linh (Mùng 1, Rằm)',
    titleEn: 'Prayer to Deities (1st & 15th Lunar)',
    contentVi: 'Nam mô A Di Đà Phật! (3 lần)\n\nCon lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.\nCon kính lạy Hoàng thiên Hậu Thổ chư vị Tôn thần.\nCon kính lạy ngài Bản cảnh Thành Hoàng, ngài Bản xứ Thổ địa, ngài Bản gia Táo quân cùng chư vị Tôn thần.\n\nTín chủ (chúng) con là: [Tên của bạn]\nNgụ tại: [Địa chỉ của bạn]\n\nHôm nay là ngày [Ngày] tháng [Tháng] năm [Năm] âm lịch, tín chủ con thành tâm sắm lễ, quả cau lá trầu, hương hoa trà quả, thắp nén tâm hương dâng lên trước án.\n\nChúng con kính mời ngài Bản cảnh Thành hoàng Chư vị Đại Vương, ngài Bản xứ Thần linh Thổ địa, ngài Bản gia Táo quân, Ngũ phương, Long mạch, Tài thần. Cúi xin các ngài giáng lâm trước án, chứng giám lòng thành, thụ hưởng lễ vật.\n\nCúi xin các ngài che chở cho gia đình chúng con luôn bình an, mạnh khỏe, công việc hanh thông, vạn sự tốt lành.\n\nNam mô A Di Đà Phật! (3 lần)',
    contentEn: 'Namo Amitabha Buddha! (3 times)\n\nI bow to the heavens in nine directions, the Buddhas in ten directions.\nI respectfully bow to the Deities of Heaven and Earth.\nI respectfully bow to the City God, the Earth God, the Kitchen God, and all Deities.\n\nYour disciple is: [Your Name]\nResiding at: [Your Address]\n\nToday is the [Day] of the [Month] of the [Year] in the lunar calendar. I sincerely prepare offerings, light incense, and present them before the altar.\n\nI respectfully invite the Deities to descend, witness my sincerity, and accept the offerings.\n\nI pray for your protection over our family, granting us peace, health, smooth work, and all good things.\n\nNamo Amitabha Buddha! (3 times)'
  },
  {
    id: 'p2',
    category: 'wealth',
    titleVi: 'Văn khấn Thần Tài - Thổ Địa',
    titleEn: 'Prayer to God of Wealth & Earth God',
    contentVi: 'Nam mô A Di Đà Phật! (3 lần)\n\nCon lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.\nKính lạy ngài Hoàng Thiên Hậu Thổ chư vị Tôn thần.\nCon kính lạy ngài Đông Trù Tư mệnh Táo phủ Thần quân.\nCon kính lạy Thần Tài vị tiền.\nCon kính lạy các ngài Thần linh, Thổ địa cai quản trong xứ này.\n\nTín chủ con là: [Tên của bạn]\nNgụ tại: [Địa chỉ của bạn]\n\nHôm nay là ngày [Ngày] tháng [Tháng] năm [Năm].\nTín chủ thành tâm sửa biện, hương hoa, lễ vật, kim ngân, trà quả và các thứ cúng dâng, bày ra trước án kính mời ngài Thần Tài vị tiền.\n\nCúi xin Thần Tài thương xót tín chủ, giáng lâm trước án, chứng giám lòng thành, thụ hưởng lễ vật phù trì tín chủ chúng con an ninh khang thái, vạn sự tốt lành, gia đạo hưng long thịnh vượng, lộc tài tăng tiến, tâm đạo mở mang, sở cầu tất ứng, sở nguyện tòng tâm.\n\nNam mô A Di Đà Phật! (3 lần)',
    contentEn: 'Namo Amitabha Buddha! (3 times)\n\nI bow to the heavens in nine directions, the Buddhas in ten directions.\nI respectfully bow to the Deities of Heaven and Earth.\nI respectfully bow to the God of Wealth and the Earth God of this land.\n\nYour disciple is: [Your Name]\nResiding at: [Your Address]\n\nToday is the [Day] of the [Month] of the [Year].\nI sincerely prepare offerings, incense, flowers, and tea, presenting them before the altar to invite the God of Wealth.\n\nI pray for your compassion to descend, witness my sincerity, and accept the offerings. Please protect us, grant us peace, prosperity, increasing wealth, and fulfill our wishes.\n\nNamo Amitabha Buddha! (3 times)'
  },
  {
    id: 'p3',
    category: 'ancestor',
    titleVi: 'Văn khấn Gia Tiên',
    titleEn: 'Prayer to Ancestors',
    contentVi: 'Nam mô A Di Đà Phật! (3 lần)\n\nCon lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.\nCon kính lạy Hoàng thiên Hậu Thổ chư vị Tôn thần.\nCon kính lạy ngài Bản cảnh Thành Hoàng, ngài Bản xứ Thổ địa, ngài Bản gia Táo quân cùng chư vị Tôn thần.\nCon kính lạy Tổ tiên, Hiển khảo, Hiển tỷ, chư vị Hương linh (nếu bố mẹ còn sống thì thay bằng Tổ Khảo, Tổ Tỷ).\n\nTín chủ (chúng) con là: [Tên của bạn]\nNgụ tại: [Địa chỉ của bạn]\n\nHôm nay là ngày [Ngày] tháng [Tháng] năm [Năm].\nTín chủ con thành tâm sắm lễ, hương hoa trà quả, thắp nén tâm hương dâng lên trước án, kính mời các cụ Cao Tằng Tổ Khảo, Cao Tằng Tổ Tỷ, bá thúc đệ huynh, cô di, tỷ muội nam nữ tử tôn nội ngoại cúi xin các vị thương xót con cháu linh thiêng hiện về, chứng giám lòng thành, thụ hưởng lễ vật.\n\nCúi xin các vị phù hộ độ trì cho gia đình chúng con luôn bình an, mạnh khỏe, tai qua nạn khỏi, mọi sự tốt lành.\n\nNam mô A Di Đà Phật! (3 lần)',
    contentEn: 'Namo Amitabha Buddha! (3 times)\n\nI bow to the heavens in nine directions, the Buddhas in ten directions.\nI respectfully bow to the Deities of Heaven and Earth.\nI respectfully bow to our Ancestors and all departed spirits of our lineage.\n\nYour disciple is: [Your Name]\nResiding at: [Your Address]\n\nToday is the [Day] of the [Month] of the [Year].\nI sincerely prepare offerings, incense, flowers, and tea, presenting them before the altar to invite our ancestors of all generations to return, witness our sincerity, and accept the offerings.\n\nI pray for your protection over our family, granting us peace, health, overcoming obstacles, and all good things.\n\nNamo Amitabha Buddha! (3 times)'
  },
  {
    id: 'p4',
    category: 'peace',
    titleVi: 'Bài khấn Cầu Bình An',
    titleEn: 'Prayer for Peace & Health',
    contentVi: 'Nam mô Bổn Sư Thích Ca Mâu Ni Phật! (3 lần)\nNam mô Đại Bi Quán Thế Âm Bồ Tát! (3 lần)\n\nĐệ tử con tên là: [Tên của bạn]\nPháp danh (nếu có): [Pháp danh]\nNgụ tại: [Địa chỉ của bạn]\n\nHôm nay, đứng trước tôn nhan chư Phật, chư Đại Bồ Tát, con xin thành tâm đảnh lễ và dâng lên lời nguyện cầu từ tận đáy lòng.\n\nCon nguyện cầu cho thế giới hòa bình, chúng sinh an lạc. Con nguyện cầu cho gia đình con, cha mẹ, anh em, người thân và chính bản thân con luôn được thân tâm an lạc, tật bệnh tiêu trừ, tai qua nạn khỏi.\n\nNguyện cho con luôn giữ được tâm thiện lành, biết yêu thương và tha thứ, biết buông bỏ những muộn phiền để sống một cuộc đời ý nghĩa.\n\nNam mô Bổn Sư Thích Ca Mâu Ni Phật! (3 lần)',
    contentEn: 'Namo Shakyamuni Buddha! (3 times)\nNamo Avalokiteshvara Bodhisattva! (3 times)\n\nMy name is: [Your Name]\nResiding at: [Your Address]\n\nToday, standing before the Buddhas and Bodhisattvas, I sincerely bow and offer my prayers from the bottom of my heart.\n\nI pray for world peace and the happiness of all beings. I pray for my family, parents, siblings, loved ones, and myself to always have peace of mind and body, to be free from illness, and to overcome all difficulties.\n\nMay I always keep a kind heart, know how to love and forgive, and know how to let go of sorrows to live a meaningful life.\n\nNamo Shakyamuni Buddha! (3 times)'
  },
  {
    id: 'p5',
    category: 'business',
    titleVi: 'Văn khấn Khai Trương Cửa Hàng',
    titleEn: 'Prayer for Store Opening',
    contentVi: 'Nam mô A Di Đà Phật! (3 lần)\n\nCon lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.\nCon kính lạy Quan Đương niên Hành khiển Thái tuế chí đức Tôn thần.\nCon kính lạy các ngài Bản cảnh Thành hoàng chư vị Đại Vương.\nCon kính lạy các ngài Ngũ phương, Ngũ thổ, Long mạch, Tài thần định phúc Táo quân, chư vị Tôn thần.\nCon kính lạy các thần linh cai quản trong khu vực này.\n\nTín chủ (chúng) con là: [Tên của bạn]\nHôm nay là ngày [Ngày] tháng [Tháng] năm [Năm], tín chủ con thành tâm sắm sửa lễ, quả cau lá trầu, hương hoa trà quả, thắp nén tâm hương dâng lên trước án, lòng thành tâu rằng: tín chủ con xây cất (hoặc thuê được) một ngôi hàng ở tại xứ này (địa chỉ) [Địa chỉ cửa hàng].\n\nNay muốn khai trương khởi đầu việc kinh doanh (hoặc sản xuất) phục vụ nhân sinh, phục vụ sinh hoạt. Do đó chúng con chọn được ngày lành tháng tốt sắm sanh lễ vật cáo yết Tôn thần dâng cùng Bách linh....... cúi mong soi xét.\n\nChúng con xin kính mời quan Đương niên quan Đương cảnh, quan Thần linh Thổ địa, Thần tài, ngài định phúc Táo quân cùng chư vị Tôn thần giáng lâm trước án, chứng giám lòng thành, thụ hưởng lễ vật.\n\nCúi xin các ngài phù hộ cho chúng con buôn bán hanh thông, làm ăn thuận lợi, lộc tài vượng tiến, cần gì được nấy, nguyện gì cũng thành.\n\nNam mô A Di Đà Phật! (3 lần)',
    contentEn: 'Namo Amitabha Buddha! (3 times)\n\nI bow to the heavens in nine directions, the Buddhas in ten directions.\nI respectfully bow to the ruling Deities of the year.\nI respectfully bow to the City God and all Deities.\nI respectfully bow to the Gods of the five directions, the Earth God, the God of Wealth, the Kitchen God, and all Deities governing this area.\n\nYour disciple is: [Your Name]\nToday is the [Day] of the [Month] of the [Year]. I sincerely prepare offerings, light incense, and present them before the altar to announce: I have built (or rented) a store at [Store Address].\n\nToday, I wish to open for business to serve the people. Therefore, I have chosen an auspicious day to prepare offerings to report to the Deities, hoping for your consideration.\n\nI respectfully invite the ruling Deities, the Earth God, the God of Wealth, the Kitchen God, and all Deities to descend, witness my sincerity, and accept the offerings.\n\nI pray for your protection to grant us smooth business, prosperous trade, increasing wealth, and fulfillment of all our wishes.\n\nNamo Amitabha Buddha! (3 times)'
  },
  {
    id: 'p6',
    category: 'health',
    titleVi: 'Văn khấn Cầu Bệnh Tật Tiêu Trừ',
    titleEn: 'Prayer for Healing and Health',
    contentVi: 'Nam mô Dược Sư Lưu Ly Quang Như Lai! (3 lần)\nNam mô Đại Bi Quán Thế Âm Bồ Tát! (3 lần)\n\nĐệ tử con tên là: [Tên của bạn]\nNgụ tại: [Địa chỉ của bạn]\n\nHôm nay, con thành tâm quỳ trước tôn nhan chư Phật, chư Đại Bồ Tát, đặc biệt là đức Dược Sư Lưu Ly Quang Như Lai, đấng Y vương vô thượng, xin dâng lên lời khẩn cầu thiết tha.\n\nHiện nay, con (hoặc người thân tên là...) đang mang trọng bệnh (tên bệnh nếu có), thân thể đau đớn, tâm trí lo âu. Con biết rằng mọi bệnh tật đều do nghiệp chướng từ nhiều đời nhiều kiếp hoặc do sự vô minh trong kiếp này mà ra.\n\nNay con thành tâm sám hối mọi lỗi lầm, nguyện từ nay làm lành lánh dữ, tu tâm dưỡng tính. Cúi xin đức Dược Sư Như Lai, Quán Thế Âm Bồ Tát từ bi gia hộ, phóng quang tiếp dẫn, ban cho con (hoặc người thân) diệu dược linh đan, để bệnh tật sớm ngày tiêu trừ, thân tâm được an lạc, sức khỏe phục hồi.\n\nNam mô Dược Sư Lưu Ly Quang Như Lai! (3 lần)',
    contentEn: 'Namo Medicine Buddha! (3 times)\nNamo Avalokiteshvara Bodhisattva! (3 times)\n\nMy name is: [Your Name]\nResiding at: [Your Address]\n\nToday, I sincerely kneel before the Buddhas and Bodhisattvas, especially the Medicine Buddha, the supreme healer, to offer my earnest prayer.\n\nCurrently, I (or my loved one named...) am suffering from illness, experiencing physical pain and mental anxiety. I know that all illnesses arise from karmic debts of past lives or ignorance in this life.\n\nNow I sincerely repent all my wrongdoings, vowing to do good and avoid evil from now on. I pray for the compassion of the Medicine Buddha and Avalokiteshvara Bodhisattva to protect us, grant us the miraculous medicine, so that the illness may soon be eliminated, body and mind may be at peace, and health may be restored.\n\nNamo Medicine Buddha! (3 times)'
  },
  {
    id: 'p7',
    category: 'travel',
    titleVi: 'Văn khấn Trước Khi Đi Xa',
    titleEn: 'Prayer Before Traveling',
    contentVi: 'Nam mô A Di Đà Phật! (3 lần)\nNam mô Đại Bi Quán Thế Âm Bồ Tát! (3 lần)\n\nCon lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.\nCon kính lạy Hoàng thiên Hậu Thổ chư vị Tôn thần.\nCon kính lạy ngài Bản cảnh Thành Hoàng, ngài Bản xứ Thổ địa, ngài Bản gia Táo quân cùng chư vị Tôn thần.\nCon kính lạy Tổ tiên, Hiển khảo, Hiển tỷ, chư vị Hương linh.\n\nTín chủ (chúng) con là: [Tên của bạn]\nNgụ tại: [Địa chỉ của bạn]\n\nHôm nay là ngày [Ngày] tháng [Tháng] năm [Năm]. Tín chủ con sắp sửa có chuyến đi xa đến [Nơi đến] vì việc [Mục đích chuyến đi].\n\nCon thành tâm sắm lễ, thắp nén tâm hương dâng lên trước án, kính cáo chư vị Tôn thần và Gia tiên tiền tổ.\n\nCúi xin các ngài thương xót, che chở, vuốt ve che chở cho con đi đến nơi về đến chốn, thượng lộ bình an, mọi sự hanh thông, công việc thuận lợi, tai qua nạn khỏi, gặp nhiều may mắn.\n\nNam mô A Di Đà Phật! (3 lần)',
    contentEn: 'Namo Amitabha Buddha! (3 times)\nNamo Avalokiteshvara Bodhisattva! (3 times)\n\nI bow to the heavens in nine directions, the Buddhas in ten directions.\nI respectfully bow to the Deities of Heaven and Earth.\nI respectfully bow to the City God, the Earth God, the Kitchen God, and all Deities.\nI respectfully bow to our Ancestors and all departed spirits.\n\nYour disciple is: [Your Name]\nResiding at: [Your Address]\n\nToday is the [Day] of the [Month] of the [Year]. I am about to travel to [Destination] for [Purpose of trip].\n\nI sincerely prepare offerings, light incense, and present them before the altar to announce to the Deities and Ancestors.\n\nI pray for your compassion and protection, guiding me safely to my destination and back, granting a peaceful journey, smooth affairs, overcoming obstacles, and good luck.\n\nNamo Amitabha Buddha! (3 times)'
  }
];

export function PrayerBook({ onClose }: PrayerBookProps) {
  const { t, language } = useLanguage();
  const { incrementPrayer } = useUserStats();
  const [activeTab, setActiveTab] = useState<'suggest' | 'list'>('suggest');
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSuggestPrayer = async (needId: string, needLabel: string) => {
    setIsGenerating(true);
    
    try {
      if (ai) {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `You are a wise Buddhist monk. The user is asking for a prayer regarding: ${needLabel}.
          
          Write a short, profound, and comforting prayer (max 4 paragraphs).
          The tone must be peaceful, respectful, and deeply comforting.
          Start with "Nam mô A Di Đà Phật! (3 lần)" or "Namo Amitabha Buddha! (3 times)" depending on the language.
          Write it in ${language === 'vi' ? 'Vietnamese' : 'English'}. Do not use markdown formatting, just plain text.`,
        });

        setSelectedPrayer({
          id: 'ai-generated',
          category: 'daily', // fallback category
          titleVi: `Bài khấn: ${needLabel}`,
          titleEn: `Prayer for: ${needLabel}`,
          contentVi: response.text || 'Tâm tĩnh lặng, vạn sự bình an.',
          contentEn: response.text || 'A quiet mind brings universal peace.',
        });
        incrementPrayer();
      } else {
        // Fallback to predefined prayers if AI is not available
        setSelectedPrayer(prayers.find(p => p.id === needs.find(n => n.id === needId)?.prayerId) || null);
      }
    } catch (error) {
      console.error("Error generating prayer:", error);
      // Fallback to predefined prayers on error
      setSelectedPrayer(prayers.find(p => p.id === needs.find(n => n.id === needId)?.prayerId) || null);
    } finally {
      setIsGenerating(false);
    }
  };

  const needs = [
    { id: 'peace', icon: <Heart size={18} />, label: t('prayer.need.peace'), prayerId: 'p4' },
    { id: 'wealth', icon: <Briefcase size={18} />, label: t('prayer.need.wealth'), prayerId: 'p2' },
    { id: 'family', icon: <Home size={18} />, label: t('prayer.need.family'), prayerId: 'p3' },
    { id: 'study', icon: <GraduationCap size={18} />, label: t('prayer.need.study'), prayerId: 'p4' },
    { id: 'business', icon: <Briefcase size={18} />, label: t('prayer.need.business'), prayerId: 'p5' },
    { id: 'health', icon: <Cross size={18} />, label: t('prayer.need.health'), prayerId: 'p6' },
    { id: 'travel', icon: <Plane size={18} />, label: t('prayer.need.travel'), prayerId: 'p7' },
  ];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/95 ">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#110e0c] border border-amber-500/20 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-500/10 bg-black/40 shrink-0">
          <button 
            onClick={() => selectedPrayer ? setSelectedPrayer(null) : onClose()}
            className="flex items-center gap-1 text-amber-500/80 hover:text-amber-400 transition-colors text-sm font-light tracking-wider"
          >
            <ChevronLeft size={18} />
            {t('prayer.back')}
          </button>
          <span className="text-amber-200/40 text-[10px] tracking-[0.2em] uppercase font-medium">
            {t('prayer.title')}
          </span>
          <div className="w-16"></div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {selectedPrayer ? (
              <motion.div
                key="prayer-detail"
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar flex flex-col relative"
              >
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
                
                <h2 className="text-xl sm:text-2xl text-amber-100 font-medium tracking-wide mb-6 text-center drop-shadow-[0_0_10px_rgba(251,191,36,0.2)] relative z-10">
                  {language === 'vi' ? selectedPrayer.titleVi : selectedPrayer.titleEn}
                </h2>
                <div className="bg-black/60 border border-amber-500/20 rounded-2xl p-6 sm:p-8 relative flex-1 shadow-[0_0_30px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(245,158,11,0.05)] ">
                  <div className="absolute top-4 right-4 text-amber-500/10">
                    <BookText size={60} strokeWidth={0.5} />
                  </div>
                  <p className="text-amber-100/90 text-sm sm:text-base font-light leading-relaxed whitespace-pre-line relative z-10 drop-shadow-sm">
                    {language === 'vi' ? selectedPrayer.contentVi : selectedPrayer.contentEn}
                  </p>
                </div>
                <div className="mt-6 text-center text-amber-500/60 text-xs tracking-widest uppercase flex items-center justify-center gap-3 shrink-0 relative z-10">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                    <Sparkles size={14} className="text-amber-400" />
                  </motion.div>
                  <span className="drop-shadow-md">{t('prayer.read_aloud')}</span>
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                    <Sparkles size={14} className="text-amber-400" />
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="prayer-list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 flex flex-col"
              >
                {/* Tabs */}
                <div className="flex border-b border-amber-500/10">
                  <button
                    onClick={() => setActiveTab('suggest')}
                    className={`flex-1 py-4 text-sm tracking-wider uppercase transition-colors ${
                      activeTab === 'suggest' 
                        ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5' 
                        : 'text-amber-200/40 hover:text-amber-200/60'
                    }`}
                  >
                    {t('prayer.suggest_tab')}
                  </button>
                  <button
                    onClick={() => setActiveTab('list')}
                    className={`flex-1 py-4 text-sm tracking-wider uppercase transition-colors ${
                      activeTab === 'list' 
                        ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5' 
                        : 'text-amber-200/40 hover:text-amber-200/60'
                    }`}
                  >
                    {t('prayer.list_tab')}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  {activeTab === 'suggest' ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-900/40 to-amber-950/40 flex items-center justify-center mb-8 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15),inset_0_0_15px_rgba(245,158,11,0.1)] relative">
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full border border-amber-500/20 border-dashed"
                        />
                        <Sparkles className="text-amber-400 drop-shadow-lg" size={32} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl text-amber-100 font-light tracking-widest uppercase mb-10 text-center drop-shadow-md">
                        {t('prayer.what_do_you_need')}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                        {needs.map((need, index) => (
                          <motion.button
                            key={need.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSuggestPrayer(need.id, need.label)}
                            disabled={isGenerating}
                            className={`flex items-center gap-4 p-4 bg-black/50 border border-amber-500/20 rounded-xl transition-all duration-300 group relative overflow-hidden ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-900/40 hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:-translate-y-0.5'}`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <div className="text-amber-500/80 group-hover:text-amber-300 transition-colors drop-shadow-md">
                              {need.icon}
                            </div>
                            <span className="text-amber-100/80 group-hover:text-amber-100 text-sm tracking-wider font-medium">
                              {need.label}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                      {isGenerating && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-amber-200/50 tracking-widest font-light text-sm uppercase animate-pulse text-center mt-6"
                        >
                          {t('prayer.composing')}
                        </motion.p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {prayers.map((prayer) => (
                        <button
                          key={prayer.id}
                          onClick={() => {
                            setSelectedPrayer(prayer);
                            incrementPrayer();
                          }}
                          className="flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-xl hover:bg-amber-900/20 hover:border-amber-500/30 transition-all duration-300 text-left group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center border border-amber-500/20 group-hover:border-amber-400/50 transition-colors">
                              <BookText className="text-amber-500/70 group-hover:text-amber-400" size={18} />
                            </div>
                            <div>
                              <h4 className="text-amber-100/90 font-medium tracking-wide group-hover:text-amber-300 transition-colors">
                                {language === 'vi' ? prayer.titleVi : prayer.titleEn}
                              </h4>
                              <span className="text-amber-200/40 text-xs tracking-widest uppercase mt-1 block">
                                {t(`prayer.cat.${prayer.category}`)}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
