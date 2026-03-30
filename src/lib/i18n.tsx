import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'vi' | 'en';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  vi: {
    // App.tsx
    'app.title': 'Huyền Phong Phật Đạo',
    'app.headphone_prompt': 'Vui lòng đeo tai nghe để có trải nghiệm tâm linh trọn vẹn nhất',
    'app.enter_temple': 'Bước Vào Chánh Điện',
    'app.bow_message': 'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật',
    'app.donate_blessing': 'Tâm an vạn sự an',

    // UIOverlay.tsx
    'ui.incense': 'Dâng Hương',
    'ui.bow': 'Lễ Bái',
    'ui.repent': 'Sám Hối',
    'ui.fortune': 'Xin Xăm',
    'ui.donate': 'Cúng Dường',
    'ui.disclaimer': 'Trải nghiệm tĩnh tâm • Không thay thế nghi thức thực tế',
    'ui.guide_tooltip': 'Hướng dẫn lễ bái',
    'ui.audio_on': 'Bật âm thanh',
    'ui.audio_off': 'Tắt âm thanh',

    // AIGuidance.tsx
    'ai.back': 'Trở lại',
    'ai.title': 'Xin Xăm & Lời Khuyên',
    'ai.prompt': 'Hãy chọn tâm nguyện của bạn để nhận một lời khuyên từ chư Phật.',
    'ai.peace': 'Bình An',
    'ai.health': 'Sức Khỏe',
    'ai.clarity': 'Trí Tuệ',
    'ai.shaking': 'Đang thỉnh xăm...',
    'ai.result': 'Quẻ Xăm',
    'ai.redraw': 'Xin xăm lại',
    'ai.stick': 'XĂM',
    'ai.fallback': 'Tâm tĩnh lặng, vạn sự bình an. Hãy giữ tâm trong sáng như đóa sen.',

    // RepentanceRoom.tsx
    'repent.title': 'Phòng Sám Hối',
    'repent.desc1': 'Viết ra những muộn phiền, lỗi lầm hay chấp niệm trong lòng.',
    'repent.desc2': 'Thành tâm sám hối để cõi lòng nhẹ nhõm, thanh tịnh.',
    'repent.placeholder': 'Con xin sám hối...',
    'repent.btn': 'Thành Tâm Buông Bỏ',
    'repent.releasing': 'Nghiệp chướng đang tan biến...',
    'repent.return': 'Trở về',
    'repent.fallback': 'Nghiệp chướng đã được xoa dịu. Hãy buông bỏ quá khứ, sống trọn vẹn với hiện tại. Tâm sáng như gương, vạn sự bình an.',

    // GuideModal.tsx
    'guide.title': 'Hướng Dẫn Lễ Bái',
    'guide.sec1.title': '1. Chuẩn Bị Tâm Thế',
    'guide.sec1.desc': 'Trước khi bước vào không gian tâm linh, hãy giữ cho tâm trí thanh tịnh, gạt bỏ mọi tạp niệm và lo âu thường nhật. Trang phục cần gọn gàng, kín đáo. Sự thành tâm là yếu tố quan trọng nhất để kết nối với chư Phật và thần linh.',
    'guide.sec2.title': '2. Nghi Thức Dâng Hương',
    'guide.sec2.desc1': 'Dâng hương (thắp nhang) là nhịp cầu giao tiếp giữa thế giới hữu hình và vô hình. Thông thường, người ta thắp 3 nén hương tượng trưng cho:',
    'guide.sec2.li1.strong': 'Giới hương:',
    'guide.sec2.li1.text': ' Nhắc nhở giữ gìn giới luật, sống đạo đức.',
    'guide.sec2.li2.strong': 'Định hương:',
    'guide.sec2.li2.text': ' Giữ tâm kiên định, không xao động trước cám dỗ.',
    'guide.sec2.li3.strong': 'Tuệ hương:',
    'guide.sec2.li3.text': ' Khai mở trí tuệ, thấu hiểu chân lý.',
    'guide.sec2.desc2.strong': 'Cách cầm:',
    'guide.sec2.desc2.text': ' Dùng hai tay cầm hương, dâng cao ngang trán, cắm hương thẳng đứng vào bát nhang bằng hai tay để thể hiện sự ngay thẳng và tôn kính.',
    'guide.sec3.title': '3. Nghi Thức Lễ Bái (Lạy)',
    'guide.sec3.desc1': 'Lễ bái là cách hạ mình thấp nhất để thể hiện sự tôn kính tột cùng. Tư thế chuẩn nhất là "Ngũ thể đầu địa" (năm vóc gieo sát đất):',
    'guide.sec3.li1': 'Hai bàn tay, hai đầu gối và trán phải chạm hoàn toàn xuống đất.',
    'guide.sec3.li2': 'Hai bàn tay ngửa ra như đang nâng đỡ bàn chân của Đức Phật.',
    'guide.sec3.desc2': 'Thường lạy 3 lạy tượng trưng cho việc quy y Tam Bảo: Phật, Pháp, Tăng.',
    'guide.sec4.title': '4. Khấn Nguyện & Hồi Hướng',
    'guide.sec4.desc': 'Khi khấn nguyện, hãy khấn rõ ràng, rành mạch trong tâm. Nên cầu quốc thái dân an, gia đạo bình an, sức khỏe và trí tuệ sáng suốt trước khi cầu xin tài lộc cá nhân. Cuối cùng, đừng quên hồi hướng công đức cho muôn loài chúng sinh.',
    'guide.btn': 'ĐÃ HIỂU',

    // DonationPanel.tsx
    'donate.title': 'Gieo Duyên',
    'donate.subtitle': 'Cúng Dường Tam Bảo',
    'donate.desc': 'Phước báu phát sinh từ tâm thành kính. Mọi sự gieo duyên đều góp phần duy trì không gian thanh tịnh này.',
    'donate.bank': 'Ngân hàng Vietcombank',
    'donate.wallet': 'Ví ZaloPay',
    'donate.copy': 'Sao chép',
    'donate.copied': 'Đã chép',
    'donate.confirm': 'Tôi đã thành tâm cúng dường',
  },
  en: {
    // App.tsx
    'app.title': 'Huyen Phong Zen Temple',
    'app.headphone_prompt': 'Please wear headphones for the most immersive spiritual experience',
    'app.enter_temple': 'Enter the Main Hall',
    'app.bow_message': 'Namo Shakyamuni Buddha',
    'app.donate_blessing': 'Peaceful mind, peaceful life',

    // UIOverlay.tsx
    'ui.incense': 'Offer Incense',
    'ui.bow': 'Bow',
    'ui.repent': 'Repentance',
    'ui.fortune': 'Fortune',
    'ui.donate': 'Donate',
    'ui.disclaimer': 'Mindful experience • Does not replace actual rituals',
    'ui.guide_tooltip': 'Worship Guide',
    'ui.audio_on': 'Enable Audio',
    'ui.audio_off': 'Disable Audio',

    // AIGuidance.tsx
    'ai.back': 'Back',
    'ai.title': 'Fortune & Guidance',
    'ai.prompt': 'Choose your intention to receive guidance from the Buddhas.',
    'ai.peace': 'Peace',
    'ai.health': 'Health',
    'ai.clarity': 'Wisdom',
    'ai.shaking': 'Drawing fortune...',
    'ai.result': 'Your Fortune',
    'ai.redraw': 'Draw Again',
    'ai.stick': 'FORTUNE',
    'ai.fallback': 'A quiet mind brings universal peace. Keep your heart as pure as a lotus.',

    // RepentanceRoom.tsx
    'repent.title': 'Repentance Room',
    'repent.desc1': 'Write down your sorrows, mistakes, or attachments.',
    'repent.desc2': 'Sincerely repent to find peace and clarity in your heart.',
    'repent.placeholder': 'I sincerely repent...',
    'repent.btn': 'Sincerely Let Go',
    'repent.releasing': 'Karma is dissolving...',
    'repent.return': 'Return',
    'repent.fallback': 'Your karma has been eased. Let go of the past and live fully in the present. May your mind be clear as a mirror, and your life be peaceful.',

    // GuideModal.tsx
    'guide.title': 'Worship Guide',
    'guide.sec1.title': '1. Preparation',
    'guide.sec1.desc': 'Before entering the spiritual space, keep your mind pure, putting aside all worldly distractions and anxieties. Dress neatly and modestly. Sincerity is the most important element to connect with the Buddhas and deities.',
    'guide.sec2.title': '2. Offering Incense',
    'guide.sec2.desc1': 'Offering incense is a bridge between the visible and invisible worlds. Usually, 3 incense sticks are offered, representing:',
    'guide.sec2.li1.strong': 'Sila (Morality):',
    'guide.sec2.li1.text': ' A reminder to observe precepts and live ethically.',
    'guide.sec2.li2.strong': 'Samadhi (Concentration):',
    'guide.sec2.li2.text': ' Keeping the mind steadfast, unmoved by temptations.',
    'guide.sec2.li3.strong': 'Prajna (Wisdom):',
    'guide.sec2.li3.text': ' Awakening wisdom and understanding the truth.',
    'guide.sec2.desc2.strong': 'How to hold:',
    'guide.sec2.desc2.text': ' Hold the incense with both hands, raise it to forehead level, and place it upright in the censer with both hands to show uprightness and respect.',
    'guide.sec3.title': '3. Bowing',
    'guide.sec3.desc1': 'Bowing is the lowest humbling of oneself to show the utmost respect. The standard posture is "Five points touching the earth":',
    'guide.sec3.li1': 'Both hands, both knees, and forehead must completely touch the ground.',
    'guide.sec3.li2': 'Both hands face up as if supporting the Buddha\'s feet.',
    'guide.sec3.desc2': 'Usually, 3 bows are made representing taking refuge in the Triple Gem: Buddha, Dharma, Sangha.',
    'guide.sec4.title': '4. Praying & Dedication',
    'guide.sec4.desc': 'When praying, pray clearly in your mind. You should pray for national peace, family well-being, health, and clear wisdom before asking for personal wealth. Finally, do not forget to dedicate the merit to all sentient beings.',
    'guide.btn': 'I UNDERSTAND',

    // DonationPanel.tsx
    'donate.title': 'Sow Good Karma',
    'donate.subtitle': 'Offerings to the Triple Gem',
    'donate.desc': 'Merit arises from a sincere heart. Every offering helps maintain this pure space.',
    'donate.bank': 'Vietcombank',
    'donate.wallet': 'ZaloPay Wallet',
    'donate.copy': 'Copy',
    'donate.copied': 'Copied',
    'donate.confirm': 'I have sincerely offered',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('vi');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
