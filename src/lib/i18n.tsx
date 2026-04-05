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
    'app.online_users': 'Đang trực tuyến',
    'app.total_visits': 'Tổng lượt viếng thăm',
    'app.loading_scene': 'Đang khởi tạo không gian...',
    'og.description': 'Trải nghiệm không gian tâm linh ảo Huyền Phong Phật Đạo - Dâng hương, lễ bái, xin xăm online.',

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
    'ui.share': 'Chia sẻ',
    'ui.copy_success': 'Đã sao chép liên kết!',

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
    'repentance.step1': 'Chân thật',
    'repentance.step2': 'Đối diện',
    'repentance.step3': 'Buông bỏ',
    'repentance.quote': '"Viết ra những muộn phiền, hối tiếc hay gánh nặng trong lòng. Khi ngọn lửa bùng lên, hãy để mọi thứ tan biến thành tro bụi."',
    'repentance.completed_title': 'Tâm Đã Buông Xả',
    'repentance.continue': 'Tiếp tục',
    'repentance.title': 'Phòng Sám Hối',
    'repentance.desc1': 'Viết ra những muộn phiền, lỗi lầm hay chấp niệm trong lòng.',
    'repentance.desc2': 'Thành tâm sám hối để cõi lòng nhẹ nhõm, thanh tịnh.',
    'repentance.prompt': 'Viết ra những muộn phiền, lỗi lầm hay chấp niệm trong lòng. Thành tâm sám hối để cõi lòng nhẹ nhõm, thanh tịnh.',
    'repentance.placeholder': 'Con xin sám hối...',
    'repentance.button': 'Thành Tâm Buông Bỏ',
    'repentance.releasing': 'Nghiệp chướng đang tan biến...',
    'repentance.back': 'Trở về',
    'repentance.fallback': 'Nghiệp chướng đã được xoa dịu. Hãy buông bỏ quá khứ, sống trọn vẹn với hiện tại. Tâm sáng như gương, vạn sự bình an.',

    // MeditationRoom.tsx
    'meditation.step1': 'Hít thở',
    'meditation.step2': 'Thư giãn',
    'meditation.step3': 'Buông xả',
    'meditation.quote': '"Hãy tìm một tư thế thoải mái, nhắm mắt lại và để hơi thở dẫn lối bạn về với hiện tại."',
    'meditation.duration': 'Thời gian',
    'meditation.completed_quote': '"Tâm tĩnh lặng, vạn sự bình an."',
    'meditation.title': 'Phòng Thiền & Chánh Niệm',
    'meditation.desc': 'Tìm lại sự bình yên trong từng hơi thở và âm thanh tỉnh thức.',
    'meditation.timer.5min': '5 Phút',
    'meditation.timer.10min': '10 Phút',
    'meditation.timer.15min': '15 Phút',
    'meditation.timer.30min': '30 Phút',
    'meditation.start': 'Bắt Đầu Thiền',
    'meditation.stop': 'Kết Thúc',
    'meditation.breathe_in': 'Hít vào...',
    'meditation.breathe_out': 'Thở ra...',
    'meditation.hold': 'Giữ hơi...',
    'meditation.completed': 'Buổi thiền kết thúc. Chúc bạn một ngày an lành.',
    'meditation.back': 'Trở về',
    'meditation.sound.none': 'Không nhạc nền',
    'meditation.sound.rain': 'Mưa rơi',
    'meditation.sound.stream': 'Suối chảy',
    'meditation.sound.birds': 'Chim hót',
    'meditation.sound.chanting': 'Tụng kinh',
    'meditation.wooden_fish': 'Gõ Mõ',
    'meditation.bell': 'Thỉnh Chuông',

    // PrayerBook.tsx
    'prayer.title': 'Văn Khấn',
    'prayer.desc': 'Những bài văn khấn cổ truyền và gợi ý thông minh theo tâm nguyện.',
    'prayer.suggest_tab': 'Gợi Ý Thông Minh',
    'prayer.list_tab': 'Danh Sách Bài Khấn',
    'prayer.what_do_you_need': 'Hôm nay bạn mong cầu điều gì?',
    'prayer.need.peace': 'Bình An & Sức Khỏe',
    'prayer.need.wealth': 'Tài Lộc & Công Việc',
    'prayer.need.family': 'Gia Đạo Hạnh Phúc',
    'prayer.need.study': 'Học Hành Thi Cử',
    'prayer.need.business': 'Kinh Doanh Buôn Bán',
    'prayer.need.health': 'Tiêu Trừ Bệnh Tật',
    'prayer.need.travel': 'Đi Xa Bình An',
    'prayer.composing': 'Đang soạn bài khấn...',
    'prayer.cat.daily': 'Thường Nhật (Mùng 1, Rằm)',
    'prayer.cat.wealth': 'Thần Tài - Thổ Địa',
    'prayer.cat.ancestor': 'Gia Tiên',
    'prayer.cat.peace': 'Bình An',
    'prayer.cat.business': 'Kinh Doanh',
    'prayer.cat.health': 'Sức Khỏe',
    'prayer.cat.travel': 'Đi Xa',
    'prayer.read_aloud': 'Đọc nhẩm trong tâm',
    'prayer.back': 'Trở về',

    // LifeRelease.tsx
    'release.title': 'Phóng Sinh',
    'release.desc': 'Cứu muôn loài, gieo mầm thiện, nuôi dưỡng lòng từ bi.',
    'release.choose': 'Chọn loài phóng sinh',
    'release.bird': 'Chim',
    'release.fish': 'Cá',
    'release.birds': 'Phóng Sinh Chim',
    'release.fish_title': 'Phóng Sinh Cá',
    'release.action': 'Thực Hiện Phóng Sinh',
    'release.action.birds': 'Thả Chim Về Trời',
    'release.action.fish': 'Thả Cá Về Nước',
    'release.chant': 'Nguyện đem công đức này, hướng về khắp tất cả. Đệ tử và chúng sinh, đều trọn thành Phật đạo.',
    'release.success': 'Phóng Sinh Viên Mãn',
    'release.merit': 'Công đức vô lượng. Vạn vật biết ơn lòng từ bi của bạn.',
    'release.continue': 'Tiếp tục',
    'release.tap': 'Nhấn để phóng sinh',
    'release.completed': 'Phóng sinh viên mãn. Vạn vật biết ơn lòng từ bi của bạn.',
    'release.back': 'Trở về',

    // GuideModal.tsx
    'guide.title': 'Hướng Dẫn Lễ Bái',
    'guide.mindset.title': '1. Chuẩn Bị Tâm Thế',
    'guide.mindset.desc': 'Trước khi bước vào không gian tâm linh, hãy giữ cho tâm trí thanh tịnh, gạt bỏ mọi tạp niệm và lo âu thường nhật. Trang phục cần gọn gàng, kín đáo. Sự thành tâm là yếu tố quan trọng nhất để kết nối với chư Phật và thần linh.',
    'guide.incense.title': '2. Nghi Thức Dâng Hương',
    'guide.incense.desc1': 'Dâng hương (thắp nhang) là nhịp cầu giao tiếp giữa thế giới hữu hình và vô hình. Thông thường, người ta thắp 3 nén hương tượng trưng cho:',
    'guide.incense.point1.title': 'Giới hương:',
    'guide.incense.point1.desc': ' Nhắc nhở giữ gìn giới luật, sống đạo đức.',
    'guide.incense.point2.title': 'Định hương:',
    'guide.incense.point2.desc': ' Giữ tâm kiên định, không xao động trước cám dỗ.',
    'guide.incense.point3.title': 'Tuệ hương:',
    'guide.incense.point3.desc': ' Khai mở trí tuệ, thấu hiểu chân lý.',
    'guide.incense.how.title': 'Cách cầm:',
    'guide.incense.how.desc': ' Dùng hai tay cầm hương, dâng cao ngang trán, cắm hương thẳng đứng vào bát nhang bằng hai tay để thể hiện sự ngay thẳng và tôn kính.',
    'guide.bow.title': '3. Nghi Thức Lễ Bái (Lạy)',
    'guide.bow.desc1': 'Lễ bái là cách hạ mình thấp nhất để thể hiện sự tôn kính tột cùng. Tư thế chuẩn nhất là ',
    'guide.bow.desc1.bold': '"Ngũ thể đầu địa"',
    'guide.bow.desc1.after': ' (năm vóc gieo sát đất):',
    'guide.bow.point1': 'Hai bàn tay, hai đầu gối và trán phải chạm hoàn toàn xuống đất.',
    'guide.bow.point2': 'Hai bàn tay ngửa ra như đang nâng đỡ bàn chân của Đức Phật.',
    'guide.bow.desc2': 'Thường lạy 3 lạy tượng trưng cho việc quy y Tam Bảo: ',
    'guide.bow.desc2.bold': 'Phật, Pháp, Tăng',
    'guide.pray.title': '4. Khấn Nguyện & Hồi Hướng',
    'guide.pray.desc': 'Khi khấn nguyện, hãy khấn rõ ràng, rành mạch trong tâm. Nên cầu quốc thái dân an, gia đạo bình an, sức khỏe và trí tuệ sáng suốt trước khi cầu xin tài lộc cá nhân. Cuối cùng, đừng quên hồi hướng công đức cho muôn loài chúng sinh.',
    'guide.understood': 'ĐÃ HIỂU',

    // DonationPanel.tsx
    'donation.title': 'Gieo Duyên',
    'donation.subtitle': 'Cúng Dường Tam Bảo',
    'donation.desc': 'Phước báu phát sinh từ tâm thành kính. Mọi sự gieo duyên đều góp phần duy trì không gian thanh tịnh này.',
    'donation.back': 'Trở lại',
    'donation.bank': 'Ngân hàng',
    'donation.wallet': 'Ví ZaloPay',
    'donation.copy': 'Sao chép',
    'donation.copied': 'Đã chép',
    'donation.confirm': 'Tôi đã thành tâm cúng dường',
    'donation.amount.custom': 'Tùy tâm',
    'donation.scan_qr': 'Quét mã QR để gieo duyên',
    'donation.account_name': 'Chủ tài khoản',
    'donation.account_number': 'Số tài khoản',

    // LegalModal.tsx
    'legal.privacy.title': 'Chính Sách Bảo Mật',
    'legal.privacy.text': 'Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết bảo vệ dữ liệu cá nhân. Không gian tâm linh này không thu thập bất kỳ thông tin nhận dạng cá nhân nào mà không có sự đồng ý rõ ràng của bạn. Mọi dữ liệu được xử lý trong quá trình bạn viếng thăm, chẳng hạn như thống kê sử dụng ẩn danh hoặc tương tác AI, chỉ được sử dụng để nâng cao trải nghiệm và duy trì sự thanh tịnh của ứng dụng. Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin của bạn cho bên ngoài.',
    'legal.terms.title': 'Điều Khoản Dịch Vụ',
    'legal.terms.text': 'Khi bước vào không gian linh thiêng ảo này, bạn đồng ý duy trì thái độ tôn trọng và trang nghiêm. Ứng dụng này được cung cấp cho mục đích tĩnh tâm, thiền định và tôn vinh văn hóa. Đây không phải là sự thay thế cho các nghi thức tôn giáo thực tế hoặc lời khuyên tâm lý chuyên nghiệp. Chúng tôi có quyền sửa đổi hoặc chấm dứt dịch vụ bất cứ lúc nào để bảo vệ tính toàn vẹn của trải nghiệm. Việc bạn tiếp tục sử dụng đồng nghĩa với việc chấp nhận các điều khoản này.',
    'legal.contact.title': 'Liên Hệ',
    'legal.contact.text': 'Đối với bất kỳ thắc mắc, phản hồi hoặc hỗ trợ nào liên quan đến trải nghiệm của bạn trong ngôi chùa ảo của chúng tôi, vui lòng liên hệ với chúng tôi. Chúng tôi hoan nghênh những chia sẻ của bạn và luôn sẵn sàng hỗ trợ bạn trên hành trình tâm linh.',
    'legal.contact.email_label': 'Email Trực Tiếp',
    'legal.back': 'Trở lại',
    'legal.header': 'Pháp Lý & Thông Tin',
  },
  en: {
    // App.tsx
    'app.title': 'Huyen Phong Zen Temple',
    'app.headphone_prompt': 'Please wear headphones for the most immersive spiritual experience',
    'app.enter_temple': 'Enter the Main Hall',
    'app.bow_message': 'Namo Shakyamuni Buddha',
    'app.donate_blessing': 'Peaceful mind, peaceful life',
    'app.online_users': 'Online now',
    'app.total_visits': 'Total visits',
    'app.loading_scene': 'Initializing sacred space...',
    'og.description': 'Experience the virtual spiritual space of Huyen Phong Zen Temple - Offer incense, bow, and draw fortune online.',

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
    'ui.share': 'Share',
    'ui.copy_success': 'Link copied!',

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
    'repentance.step1': 'Honest',
    'repentance.step2': 'Face it',
    'repentance.step3': 'Release',
    'repentance.quote': '"Write down your sorrows, regrets, or burdens. As the flame ignites, let everything turn to ashes."',
    'repentance.completed_title': 'Burden Released',
    'repentance.continue': 'Continue',
    'repentance.title': 'Repentance Room',
    'repentance.desc1': 'Write down your sorrows, mistakes, or attachments.',
    'repentance.desc2': 'Sincerely repent to find peace and clarity in your heart.',
    'repentance.prompt': 'Write down your sorrows, mistakes, or attachments. Sincerely repent to find peace and clarity in your heart.',
    'repentance.placeholder': 'I sincerely repent...',
    'repentance.button': 'Sincerely Let Go',
    'repentance.releasing': 'Karma is dissolving...',
    'repentance.back': 'Return',
    'repentance.fallback': 'Your karma has been eased. Let go of the past and live fully in the present. May your mind be clear as a mirror, and your life be peaceful.',

    // MeditationRoom.tsx
    'meditation.step1': 'Breathe',
    'meditation.step2': 'Relax',
    'meditation.step3': 'Let go',
    'meditation.quote': '"Find a comfortable posture, close your eyes, and let your breath guide you back to the present."',
    'meditation.duration': 'Duration',
    'meditation.completed_quote': '"A quiet mind brings universal peace."',
    'meditation.title': 'Mindfulness & Meditation',
    'meditation.desc': 'Find peace in every breath and awakening sound.',
    'meditation.timer.5min': '5 Min',
    'meditation.timer.10min': '10 Min',
    'meditation.timer.15min': '15 Min',
    'meditation.timer.30min': '30 Min',
    'meditation.start': 'Start Meditation',
    'meditation.stop': 'End Session',
    'meditation.breathe_in': 'Breathe in...',
    'meditation.breathe_out': 'Breathe out...',
    'meditation.hold': 'Hold...',
    'meditation.completed': 'Meditation completed. Have a peaceful day.',
    'meditation.back': 'Return',
    'meditation.sound.none': 'No Background',
    'meditation.sound.rain': 'Rainfall',
    'meditation.sound.stream': 'Flowing Stream',
    'meditation.sound.birds': 'Birdsong',
    'meditation.sound.chanting': 'Chanting',
    'meditation.wooden_fish': 'Wooden Fish',
    'meditation.bell': 'Ring Bell',

    // PrayerBook.tsx
    'prayer.title': 'Prayer Book',
    'prayer.desc': 'Traditional prayers and smart suggestions based on your intentions.',
    'prayer.suggest_tab': 'Smart Suggestions',
    'prayer.list_tab': 'All Prayers',
    'prayer.what_do_you_need': 'What are you praying for today?',
    'prayer.need.peace': 'Peace & Health',
    'prayer.need.wealth': 'Wealth & Career',
    'prayer.need.family': 'Family Harmony',
    'prayer.need.study': 'Studies & Exams',
    'prayer.need.business': 'Business & Trade',
    'prayer.need.health': 'Healing & Health',
    'prayer.need.travel': 'Safe Travels',
    'prayer.composing': 'Composing prayer...',
    'prayer.cat.daily': 'Daily (1st & 15th Lunar)',
    'prayer.cat.wealth': 'God of Wealth',
    'prayer.cat.ancestor': 'Ancestors',
    'prayer.cat.peace': 'Peace',
    'prayer.cat.business': 'Business',
    'prayer.cat.health': 'Health',
    'prayer.cat.travel': 'Travel',
    'prayer.read_aloud': 'Read silently in your heart',
    'prayer.back': 'Return',

    // LifeRelease.tsx
    'release.title': 'Life Release',
    'release.desc': 'Save lives, sow seeds of goodness, and nurture compassion.',
    'release.choose': 'Choose species to release',
    'release.bird': 'Bird',
    'release.fish': 'Fish',
    'release.birds': 'Release Birds',
    'release.fish_title': 'Release Fish',
    'release.action': 'Perform Release',
    'release.action.birds': 'Release Birds to the Sky',
    'release.action.fish': 'Release Fish to the Water',
    'release.chant': 'May this merit be dedicated to all beings. May we and all sentient beings attain Buddhahood.',
    'release.success': 'Release Completed',
    'release.merit': 'Boundless merit. All beings are grateful for your compassion.',
    'release.continue': 'Continue',
    'release.tap': 'Tap to release',
    'release.completed': 'Life release completed. All beings are grateful for your compassion.',
    'release.back': 'Return',

    // GuideModal.tsx
    'guide.title': 'Worship Guide',
    'guide.mindset.title': '1. Preparation',
    'guide.mindset.desc': 'Before entering the spiritual space, keep your mind pure, putting aside all worldly distractions and anxieties. Dress neatly and modestly. Sincerity is the most important element to connect with the Buddhas and deities.',
    'guide.incense.title': '2. Offering Incense',
    'guide.incense.desc1': 'Offering incense is a bridge between the visible and invisible worlds. Usually, 3 incense sticks are offered, representing:',
    'guide.incense.point1.title': 'Sila (Morality):',
    'guide.incense.point1.desc': ' A reminder to observe precepts and live ethically.',
    'guide.incense.point2.title': 'Samadhi (Concentration):',
    'guide.incense.point2.desc': ' Keeping the mind steadfast, unmoved by temptations.',
    'guide.incense.point3.title': 'Prajna (Wisdom):',
    'guide.incense.point3.desc': ' Awakening wisdom and understanding the truth.',
    'guide.incense.how.title': 'How to hold:',
    'guide.incense.how.desc': ' Hold the incense with both hands, raise it to forehead level, and place it upright in the censer with both hands to show uprightness and respect.',
    'guide.bow.title': '3. Bowing',
    'guide.bow.desc1': 'Bowing is the lowest humbling of oneself to show the utmost respect. The standard posture is ',
    'guide.bow.desc1.bold': '"Five points touching the earth"',
    'guide.bow.desc1.after': ':',
    'guide.bow.point1': 'Both hands, both knees, and forehead must completely touch the ground.',
    'guide.bow.point2': 'Both hands face up as if supporting the Buddha\'s feet.',
    'guide.bow.desc2': 'Usually, 3 bows are made representing taking refuge in the Triple Gem: ',
    'guide.bow.desc2.bold': 'Buddha, Dharma, Sangha',
    'guide.pray.title': '4. Praying & Dedication',
    'guide.pray.desc': 'When praying, pray clearly in your mind. You should pray for national peace, family well-being, health, and clear wisdom before asking for personal wealth. Finally, do not forget to dedicate the merit to all sentient beings.',
    'guide.understood': 'I UNDERSTAND',

    // DonationPanel.tsx
    'donation.title': 'Sow Good Karma',
    'donation.subtitle': 'Offerings to the Triple Gem',
    'donation.desc': 'Merit arises from a sincere heart. Every offering helps maintain this pure space.',
    'donation.back': 'Back',
    'donation.bank': 'Bank',
    'donation.wallet': 'ZaloPay Wallet',
    'donation.copy': 'Copy',
    'donation.copied': 'Copied',
    'donation.confirm': 'I have sincerely offered',
    'donation.amount.custom': 'Custom',
    'donation.scan_qr': 'Scan QR code to donate',
    'donation.account_name': 'Account Name',
    'donation.account_number': 'Account Number',

    // LegalModal.tsx
    'legal.privacy.title': 'Privacy Policy',
    'legal.privacy.text': 'We respect your privacy and are committed to protecting your personal data. This spiritual space does not collect any personally identifiable information without your explicit consent. Any data processed during your visit, such as anonymous usage statistics or AI interactions, is used solely to enhance your experience and maintain the tranquility of the application. We do not sell, trade, or otherwise transfer your information to outside parties.',
    'legal.terms.title': 'Terms of Service',
    'legal.terms.text': 'By entering this virtual sacred space, you agree to maintain a respectful and peaceful demeanor. This application is provided for spiritual reflection, meditation, and cultural appreciation. It is not a replacement for actual religious practices or professional mental health advice. We reserve the right to modify or terminate the service at any time to preserve the integrity of the experience. Your continued use signifies your acceptance of these terms.',
    'legal.contact.title': 'Contact Us',
    'legal.contact.text': 'For any inquiries, feedback, or support regarding your experience in our virtual temple, please reach out to us. We welcome your thoughts and are here to assist you on your spiritual journey.',
    'legal.contact.email_label': 'Direct Email',
    'legal.back': 'Back',
    'legal.header': 'Legal & Info',
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
