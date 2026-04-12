export interface Article {
  id: string;
  title: { vi: string; en: string };
  category: { vi: string; en: string };
  content: { vi: string; en: string };
  excerpt: { vi: string; en: string };
  image: string;
}

export const articles: Article[] = [
  {
    id: 'intro-to-meditation',
    title: {
      vi: 'Hướng Dẫn Thiền Định Cho Người Mới Bắt Đầu',
      en: 'Meditation Guide for Beginners'
    },
    category: {
      vi: 'Thiền Định',
      en: 'Meditation'
    },
    excerpt: {
      vi: 'Thiền định không chỉ là ngồi yên, mà là cách để chúng ta tìm lại sự bình yên trong tâm hồn giữa cuộc sống hối hả.',
      en: 'Meditation is not just sitting still, it is a way to find peace in your soul amidst a busy life.'
    },
    content: {
      vi: `Thiền định là một phương pháp rèn luyện tâm trí đã có từ hàng ngàn năm nay. Trong cuộc sống hiện đại đầy áp lực, thiền định trở thành một "liều thuốc" quý giá giúp chúng ta giảm căng thẳng, cải thiện sự tập trung và tìm lại sự cân bằng nội tại.

1. Tư thế ngồi thiền:
Bạn có thể ngồi xếp bằng, bán già hoặc kiết già. Quan trọng nhất là giữ cho lưng thẳng nhưng không quá căng cứng. Tay đặt nhẹ nhàng trên đùi hoặc đan vào nhau đặt trước bụng.

2. Tập trung vào hơi thở:
Hãy nhắm mắt lại và bắt đầu quan sát hơi thở của mình. Đừng cố gắng điều khiển hơi thở, chỉ cần cảm nhận luồng khí đi vào và đi ra qua cánh mũi.

3. Đối diện với những suy nghĩ:
Khi thiền, tâm trí bạn sẽ không tránh khỏi những suy nghĩ miên man. Đừng bực bội hay cố gắng xua đuổi chúng. Hãy chỉ đơn giản là nhận biết chúng và nhẹ nhàng đưa tâm trí quay trở lại với hơi thở.

4. Thời gian thực hành:
Đối với người mới, bạn chỉ cần bắt đầu với 5-10 phút mỗi ngày. Quan trọng là sự đều đặn hơn là thời gian dài nhưng ngắt quãng.`,
      en: `Meditation is a mental training method that has existed for thousands of years. In modern life full of pressure, meditation becomes a precious "medicine" that helps us reduce stress, improve focus, and find internal balance.

1. Meditation posture:
You can sit cross-legged, half-lotus, or full-lotus. The most important thing is to keep your back straight but not too stiff. Hands placed gently on thighs or interlaced in front of the abdomen.

2. Focus on breathing:
Close your eyes and start observing your breath. Don't try to control your breath, just feel the air flowing in and out through your nostrils.

3. Facing thoughts:
When meditating, your mind will inevitably wander. Don't be frustrated or try to chase them away. Simply acknowledge them and gently bring your mind back to your breath.

4. Practice time:
For beginners, you only need to start with 5-10 minutes a day. Consistency is more important than long but intermittent sessions.`
    },
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'meaning-of-incense',
    title: {
      vi: 'Ý Nghĩa Của Việc Dâng Hương Trong Phật Giáo',
      en: 'The Meaning of Offering Incense in Buddhism'
    },
    category: {
      vi: 'Nghi Lễ',
      en: 'Rituals'
    },
    excerpt: {
      vi: 'Dâng hương là một nghi thức tâm linh quan trọng, thể hiện lòng thành kính và sự kết nối giữa con người với thế giới tâm linh.',
      en: 'Offering incense is an important spiritual ritual, expressing respect and connection between humans and the spiritual world.'
    },
    content: {
      vi: `Trong văn hóa Phật giáo, dâng hương (thắp nhang) không chỉ là một nghi thức truyền thống mà còn mang những ý nghĩa sâu sắc về mặt tâm linh và giáo dục.

1. Lòng thành kính:
Nén hương dâng lên bàn thờ Phật thể hiện lòng tôn kính đối với các bậc giác ngộ. Khói hương bay lên như lời nguyện cầu chân thành của người con Phật gửi gắm vào hư không.

2. Sự thanh tịnh:
Mùi hương trầm thanh khiết giúp làm sạch không gian, xua tan những uế tạp và giúp tâm hồn người hành lễ trở nên thanh tịnh, nhẹ nhàng hơn.

3. Bài học về vô thường:
Nén hương cháy dần và tan biến thành tro bụi là hình ảnh ẩn dụ cho sự vô thường của vạn vật. Nó nhắc nhở chúng ta rằng cuộc đời là ngắn ngủi, hãy sống trọn vẹn và ý nghĩa trong từng khoảnh khắc.

4. Kết nối tâm linh:
Dâng hương là nhịp cầu kết nối giữa thế giới hữu hình và vô hình, giúp con người cảm thấy được che chở và bình an hơn trong cuộc sống.`,
      en: `In Buddhist culture, offering incense is not only a traditional ritual but also carries deep spiritual and educational meanings.

1. Respect:
The incense offered on the Buddha altar expresses respect for enlightened beings. The rising smoke is like a sincere prayer of a Buddhist child sent into the void.

2. Purity:
The pure scent of sandalwood helps clean the space, dispel impurities, and help the soul of the practitioner become purer and lighter.

3. Lesson on impermanence:
The incense burning down and turning into ash is a metaphor for the impermanence of all things. It reminds us that life is short, let's live fully and meaningfully in every moment.

4. Spiritual connection:
Offering incense is a bridge connecting the visible and invisible worlds, helping people feel protected and more peaceful in life.`
    },
    image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e2?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'mindfulness-in-daily-life',
    title: {
      vi: 'Thực Hành Chánh Niệm Trong Đời Sống Hằng Ngày',
      en: 'Practicing Mindfulness in Daily Life'
    },
    category: {
      vi: 'Chánh Niệm',
      en: 'Mindfulness'
    },
    excerpt: {
      vi: 'Chánh niệm không chỉ dành cho lúc ngồi thiền, mà là sự hiện diện trọn vẹn trong mọi hoạt động của cuộc sống.',
      en: 'Mindfulness is not just for meditation, but full presence in all activities of life.'
    },
    content: {
      vi: `Chánh niệm là sự biết rõ những gì đang xảy ra trong giây phút hiện tại mà không phán xét. Bạn có thể thực hành chánh niệm ở bất cứ đâu, bất cứ lúc nào.

1. Chánh niệm khi ăn:
Hãy tắt tivi, điện thoại và tập trung hoàn toàn vào món ăn. Cảm nhận hương vị, màu sắc và sự nhai nuốt. Biết ơn thực phẩm đã nuôi dưỡng cơ thể bạn.

2. Chánh niệm khi đi bộ:
Cảm nhận sự tiếp xúc của bàn chân với mặt đất. Quan sát hơi thở nhịp nhàng theo từng bước chân. Đừng vội vã, hãy tận hưởng hành trình thay vì chỉ nghĩ đến đích đến.

3. Chánh niệm khi làm việc:
Tập trung vào từng công việc nhỏ. Khi tâm trí bị xao nhãng bởi những lo âu về tương lai hay hối tiếc về quá khứ, hãy nhẹ nhàng đưa nó quay trở lại với công việc hiện tại.

4. Lợi ích của chánh niệm:
Thực hành chánh niệm giúp chúng ta bớt phản ứng thái quá với các tình huống khó khăn, tăng cường sự thấu cảm và mang lại niềm vui tự thân từ những điều giản dị nhất.`,
      en: `Mindfulness is knowing what is happening in the present moment without judgment. You can practice mindfulness anywhere, anytime.

1. Mindfulness while eating:
Turn off the TV and phone and focus completely on the food. Feel the taste, color, and chewing. Be grateful for the food that nourishes your body.

2. Mindfulness while walking:
Feel the contact of your feet with the ground. Observe your breath rhythmic with each step. Don't rush, enjoy the journey instead of just thinking about the destination.

3. Mindfulness while working:
Focus on each small task. When your mind is distracted by worries about the future or regrets about the past, gently bring it back to the current task.

4. Benefits of mindfulness:
Practicing mindfulness helps us react less excessively to difficult situations, enhances empathy, and brings self-joy from the simplest things.`
    },
    image: 'https://images.unsplash.com/photo-1499209974431-9dac3adaf471?q=80&w=800&auto=format&fit=crop'
  }
];
