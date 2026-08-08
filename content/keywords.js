/**
 * 100 个低竞争长尾关键词规划
 * ==================================================
 * 选题原则（重要，请遵守）：
 *   1. 优先选"有人搜、竞争小"的长尾词，避开"AI工具"、"ChatGPT"这类被巨头霸占的头部词。
 *   2. 用户画像为：AI 小白 / 学生 / 打工人 / 自媒体博主 / 小商家，搜索词通常带有
 *      具体使用场景、使用对象、疑问句式或"免费/教程/合集/对比"等限定词。
 *   3. 每篇文章标题必须包含所选主关键词，且尽量为疑问句或带明确场景。
 *   4. 文章字数约 800 字，正文自然包含 2-4 个同类工具，并插入广告位。
 *
 * 用法：
 *   - 每个 topic 的 keywords 就是推荐的文章选题。写文章时取第一项作为标题主关键词。
 *   - slug 用于生成文章 URL（posts/文件名）。
 *   - 发布时在 sitemap.xml 中注册，并提交 Google Search Console。
 */
const KEYWORD_TOPICS = [
  // ============ 免费工具类（竞争相对小，搜索量稳定）============
  { slug: "free-chat-tools", title: "免费 AI 聊天工具推荐", keywords: ["免费AI聊天工具有哪些", "不要钱的AI对话助手", "免费中文AI助手推荐", "哪些AI聊天软件免费"] },
  { slug: "free-ai-painting", title: "免费 AI 绘画工具合集", keywords: ["免费AI绘画工具推荐", "不要钱的AI绘画网站", "免费文生图工具", "AI绘画免费版哪个好"] },
  { slug: "free-ai-video", title: "免费 AI 视频生成工具", keywords: ["免费AI视频生成工具", "AI做视频免费软件", "免费文生视频网站", "不用花钱的AI视频工具"] },
  { slug: "free-ai-voice", title: "免费 AI 配音工具", keywords: ["免费AI配音工具推荐", "不要钱的文字转语音", "免费AI语音合成软件", "视频配音免费AI"] },
  { slug: "free-ai-ppt", title: "免费 AI 做 PPT 工具", keywords: ["免费AI做PPT的工具", "AI自动生成PPT免费", "不要钱的PPT生成器", "一键生成PPT的免费AI"] },
  { slug: "free-ai-resume", title: "免费 AI 简历优化工具", keywords: ["免费AI简历工具", "AI优化简历免费", "AI生成简历网站", "应届生AI简历工具"] },
  { slug: "free-ai-translate", title: "免费 AI 翻译工具推荐", keywords: ["免费AI翻译工具", "AI翻译哪个好用", "论文翻译免费AI工具", "实时AI翻译软件"] },
  { slug: "free-ai-subtitle", title: "免费 AI 视频字幕工具", keywords: ["免费AI视频字幕工具", "AI自动生成字幕软件", "视频加字幕免费工具", "视频字幕一键生成"] },

  // ============ 场景/人群类 ============
  { slug: "student-ai-tools", title: "学生党必备 AI 工具", keywords: ["学生党AI工具推荐", "大学生适合用什么AI工具", "学习AI工具哪个好", "写论文AI工具学生"] },
  { slug: "office-worker-ai", title: "打工人提效 AI 工具", keywords: ["打工人AI工具推荐", "上班族必备AI工具", "办公提效AI软件", "职场AI工具合集"] },
  { slug: "selfmedia-ai-tools", title: "自媒体博主 AI 工具", keywords: ["自媒体AI工具推荐", "博主必备AI工具", "小红书运营AI工具", "短视频创作AI工具"] },
  { slug: "ecommerce-ai-tools", title: "电商卖家 AI 工具", keywords: ["电商AI工具推荐", "淘宝卖家AI工具", "电商文案AI生成", "商品图AI处理工具"] },
  { slug: "english-study-ai", title: "AI 学英语工具", keywords: ["AI学英语工具推荐", "AI英语口语陪练", "免费AI英语学习软件", "用AI练口语"] },
  { slug: "interview-ai", title: "AI 面试模拟工具", keywords: ["AI面试模拟工具", "AI面试官软件", "准备面试的AI工具", "AI模拟面试免费"] },
  { slug: "note-ai", title: "AI 笔记工具推荐", keywords: ["AI笔记工具推荐", "AI会议转文字工具", "录音转文字AI工具", "AI笔记整理软件"] },

  // ============ 教程/怎么做类 ============
  { slug: "howto-midjourney", title: "Midjourney 入门教程", keywords: ["Midjourney怎么用教程", "Midjourney中文教程", "Midjourney免费版怎么玩", "Midjourney注册流程"] },
  { slug: "howto-deepseek", title: "DeepSeek 使用教程", keywords: ["DeepSeek怎么用", "DeepSeek写代码教程", "DeepSeek和ChatGPT区别", "DeepSeek免费版功能"] },
  { slug: "howto-ai-painting", title: "AI 绘画入门教程", keywords: ["AI绘画怎么入门", "AI绘画提示词怎么写", "AI绘画新手教程", "AI绘画提示词中文"] },
  { slug: "howto-ai-ppt", title: "AI 一键生成 PPT 教程", keywords: ["怎么用AI做PPT", "AI生成PPT教程", "AI做PPT步骤详解", "一键生成PPT的方法"] },
  { slug: "howto-ai-video", title: "AI 生成视频教程", keywords: ["怎么用AI生成视频", "AI视频制作教程", "AI做视频完整流程", "用AI做短视频教程"] },
  { slug: "howto-ai-voiceover", title: "AI 配音教程", keywords: ["怎么用AI配音", "AI配音教程", "用AI给视频配音", "AI配音怎么操作"] },
  { slug: "howto-ai-remove-bg", title: "AI 抠图去背景教程", keywords: ["怎么用AI抠图", "AI去背景教程", "AI抠图工具推荐", "一键抠图怎么弄"] },
  { slug: "howto-ai-restore-photo", title: "AI 修复老照片教程", keywords: ["AI修复老照片怎么弄", "老照片修复工具推荐", "AI修复照片免费", "模糊照片AI修复"] },

  // ============ 对比/测评类 ============
  { slug: "compare-ai-chat", title: "国产 AI 聊天工具对比", keywords: ["国产AI聊天工具对比", "DeepSeek和Kimi哪个好", "豆包和文心一言哪个好用", "国产大模型哪个免费"] },
  { slug: "compare-ai-painting", title: "AI 绘画工具对比测评", keywords: ["AI绘画工具哪个好", "Midjourney和即梦对比", "免费AI绘画哪个强", "AI绘画软件测评"] },
  { slug: "compare-ai-translator", title: "AI 翻译工具对比", keywords: ["DeepL和谷歌翻译哪个好", "AI翻译工具对比", "翻译软件哪个准确", "论文翻译用什么AI"] },
  { slug: "compare-ai-search", title: "AI 搜索工具对比", keywords: ["AI搜索工具哪个好用", "秘塔和Perplexity对比", "AI搜索和百度搜索区别", "国产AI搜索推荐"] },
  { slug: "compare-ai-voice", title: "AI 配音工具对比", keywords: ["AI配音工具哪个好", "ElevenLabs和豆包配音对比", "免费AI配音音质哪个好", "AI配音效果测评"] },

  // ============ 答疑类 ============
  { slug: "ai-tools-what-is", title: "什么是 AI 工具", keywords: ["AI工具是什么意思", "AI工具有哪些类型", "AI工具能做什么", "AI工具入门科普"] },
  { slug: "ai-painting-can-use", title: "AI 绘画能商用吗", keywords: ["AI绘画能商用吗", "AI绘画商用版权", "AI图片商用需要注意什么", "AI绘画免费商用"] },
  { slug: "ai-content-detection", title: "AI 内容检测工具", keywords: ["AI内容检测工具", "AI写作会被检测出来吗", "怎么检测文章是不是AI写的", "AI检测工具哪个准"] },
  { slug: "ai-tool-privacy", title: "AI 工具安全吗", keywords: ["AI工具安全吗", "用AI工具会泄露隐私吗", "AI写作会不会泄漏", "用免费AI安全吗"] },
  { slug: "ai-writing-quality", title: "AI 写作质量怎么样", keywords: ["AI写文章质量怎么样", "AI写作靠谱吗", "AI写的文章能发布吗", "AI写作和人工区别"] },

  // ============ 垂直细分工具类 ============
  { slug: "ai-math-tools", title: "AI 数学解题工具", keywords: ["AI数学解题工具", "拍照解题软件免费", "AI解数学题哪个好", "数学不会用AI怎么解"] },
  { slug: "ai-ppt-design", title: "AI 设计 PPT 风格工具", keywords: ["AI设计PPT模板", "PPT自动美化工具", "AI排版PPT工具", "PPT一键美化的AI"] },
  { slug: "ai-data-analysis", title: "AI 数据分析工具", keywords: ["AI数据分析工具推荐", "不懂Excel用AI分析数据", "AI表格分析工具", "AI做数据图表"] },
  { slug: "ai-story-writing", title: "AI 写小说工具", keywords: ["AI写小说工具", "AI小说生成器", "AI写网文靠谱吗", "AI小说写作软件"] },
  { slug: "ai-marketing-copy", title: "AI 营销文案工具", keywords: ["AI营销文案工具", "AI写广告文案", "AI文案生成器免费", "AI写朋友圈文案"] },

  // ============ 更多免费/教程主题 ============
  { slug: "free-ai-music", title: "免费 AI 音乐生成工具", keywords: ["免费AI音乐生成工具", "AI生成歌曲免费", "Suno免费版怎么用", "AI作曲软件免费"] },
  { slug: "free-ai-notetaking", title: "免费 AI 录音转文字工具", keywords: ["免费录音转文字工具", "AI会议记录免费工具", "语音转文字哪个准", "免费AI转写软件"] },
  { slug: "howto-ai-search", title: "AI 搜索入门教程", keywords: ["AI搜索怎么用", "AI搜索和传统搜索区别", "AI搜索工具入门", "怎么用秘塔搜索"] },
  { slug: "howto-claude", title: "Claude 使用教程", keywords: ["Claude怎么用", "Claude写代码教程", "Claude和ChatGPT区别", "Claude免费版怎么用"] },
  { slug: "ai-tools-for-teachers", title: "老师用的 AI 工具", keywords: ["老师AI工具推荐", "教师用AI工具", "AI备课工具", "AI课件制作工具"] },
  { slug: "ai-avatar-tools", title: "AI 数字人工具", keywords: ["AI数字人工具推荐", "AI数字人播报", "AI数字人带货", "数字人视频制作"] },
  { slug: "ai-upscale-image", title: "AI 图片无损放大工具", keywords: ["AI图片无损放大工具", "图片放大不模糊AI", "AI修复模糊图片", "免费图片放大工具"] },
  { slug: "ai-web-design", title: "AI 建站工具", keywords: ["AI建站工具推荐", "AI生成网页", "不会代码怎么建站AI", "AI一键做网站"] },
  { slug: "ai-workflow", title: "AI 工作流工具", keywords: ["AI工作流工具", "AI自动化工具推荐", "Coze和Dify哪个好", "AI工作流编排"] },
  { slug: "ai-customer-service", title: "AI 客服机器人工具", keywords: ["AI客服机器人工具", "AI客服搭建教程", "免费AI客服系统", "AI智能客服推荐"] },

  // ============ 第二批发散主题（补足 100 个关键词）============
  { slug: "free-ai-photo", title: "免费 AI 修图工具", keywords: ["免费AI修图工具", "AI修图软件推荐", "AI照片处理工具", "免费AI美图工具"] },
  { slug: "ai-logo-design", title: "AI 生成 Logo 工具", keywords: ["AI生成Logo工具", "免费AI做Logo", "AI设计Logo教程", "不会设计怎么用AI做Logo"] },
  { slug: "ai-tiktok-creators", title: "短视频创作者 AI 工具", keywords: ["短视频AI工具推荐", "抖音创作者AI工具", "短视频脚本AI怎么写", "短视频封面AI工具"] },
  { slug: "ai-meeting-notes", title: "AI 会议纪要工具", keywords: ["AI会议纪要工具", "会议录音自动转纪要", "AI会议记录软件", "开会怎么用AI做笔记"] },
  { slug: "ai-language-learning", title: "AI 语言学习工具", keywords: ["AI语言学习工具", "AI日语学习软件", "AI韩语翻译工具", "AI学小语种"] },
  { slug: "ai-reading-tools", title: "AI 读书笔记工具", keywords: ["AI读书笔记工具", "AI读PDF总结", "AI总结一本书", "AI读书工具推荐"] },
  { slug: "ai-document-summary", title: "AI 文档总结工具", keywords: ["AI文档总结工具", "长文档AI总结", "AI压缩文档内容", "AI快速读文档"] },
  { slug: "ai-prompt-engineering", title: "AI 提示词技巧", keywords: ["AI提示词怎么写", "AI提示词技巧教程", "提示词模板免费", "AI提问技巧"] },
  { slug: "ai-social-content", title: "AI 朋友圈文案工具", keywords: ["AI朋友圈文案工具", "AI写节假日文案", "AI营销文案免费", "AI祝福语生成器"] },
  { slug: "ai-article-writing", title: "AI 写文章工具", keywords: ["AI写文章工具推荐", "AI长文生成工具", "AI写知乎文章", "AI写公众号文章"] },
  { slug: "ai-code-review", title: "AI 代码审查工具", keywords: ["AI代码审查工具", "AI找代码Bug", "AI代码质量检查", "AI审查代码免费"] },
  { slug: "ai-sql-assistant", title: "AI 写 SQL 工具", keywords: ["AI写SQL工具", "AI生成SQL语句", "不懂SQL怎么用AI", "AI查询数据库工具"] },
  { slug: "ai-regex-tools", title: "AI 生成正则表达式工具", keywords: ["AI生成正则表达式", "正则不会写用AI", "AI正则工具推荐", "正则表达式生成器"] },
  { slug: "ai-english-writing", title: "AI 英文写作润色工具", keywords: ["AI英文润色工具", "论文英文润色AI", "AI改英文语法", "免费英文润色软件"] },
  { slug: "ai-email-writing", title: "AI 写邮件工具", keywords: ["AI写邮件工具", "AI商务邮件模板", "AI回复邮件助手", "英文邮件AI撰写"] },
  { slug: "ai-tools-for-kids", title: "孩子用 AI 学习工具", keywords: ["孩子AI学习工具", "儿童AI教育工具", "小学生AI学习软件", "AI辅导作业工具"] },
  { slug: "ai-photo-enhance", title: "AI 照片增强工具", keywords: ["AI照片增强工具", "AI提高照片清晰度", "AI照片变清晰软件", "老照片翻新AI"] },
  { slug: "ai-3d-modeling", title: "AI 生成 3D 模型工具", keywords: ["AI生成3D模型工具", "AI做3D建模", "文本生成3D模型", "AI 3D模型免费"] },
  { slug: "ai-video-scripts", title: "AI 写短视频脚本工具", keywords: ["AI写短视频脚本", "带货视频脚本AI", "AI脚本生成器", "短视频脚本怎么写"] },
  { slug: "ai-testing-tools", title: "AI 软件测试工具", keywords: ["AI软件测试工具", "AI自动生成测试用例", "AI测试代码工具", "AI辅助QA工具"] },
  { slug: "ai-mindmap", title: "AI 生成思维导图工具", keywords: ["AI生成思维导图", "AI做思维导图工具", "文字转思维导图AI", "免费AI思维导图"] },
  { slug: "ai-cv-optimizer", title: "AI 简历优化技巧", keywords: ["AI简历优化技巧", "AI改简历靠谱吗", "AI简历排版工具", "简历怎么用AI改"] },
  { slug: "ai-deepfake-tools", title: "AI 换脸工具", keywords: ["AI换脸工具", "AI换脸视频怎么弄", "AI换脸软件推荐", "AI换脸安全吗"] },
  { slug: "ai-screenshot-design", title: "AI 生成 UI 设计工具", keywords: ["AI生成UI设计", "AI做网页设计", "AI生成界面工具", "UI设计AI工具"] },
  { slug: "ai-ad-copy", title: "AI 广告文案工具", keywords: ["AI广告文案工具", "AI写广告语", "AI营销文案生成", "AI广告语生成器"] },
  { slug: "ai-image-seo", title: "AI 图片 SEO 优化", keywords: ["AI图片SEO优化", "AI生成图片alt", "图片搜索优化AI", "AI批量图片优化"] },
  { slug: "ai-seo-tools", title: "AI SEO 工具", keywords: ["AI SEO工具推荐", "AI做SEO优化", "AI关键词工具", "AI内容SEO工具"] },
  { slug: "ai-vtuber", title: "AI 虚拟主播工具", keywords: ["AI虚拟主播工具", "AI虚拟形象直播", "AI主播软件", "虚拟人直播教程"] },
  { slug: "ai-songwriting", title: "AI 写歌词工具", keywords: ["AI写歌词工具", "AI歌词生成器", "AI帮你写歌词", "AI音乐创作歌词"] },
  { slug: "ai-medical-tools", title: "AI 健康咨询工具", keywords: ["AI健康咨询工具", "AI看报告靠谱吗", "AI医疗问答工具", "AI饮食建议工具"] },
  { slug: "ai-legal-tools", title: "AI 法律助手工具", keywords: ["AI法律助手工具", "AI写合同", "AI法律咨询免费", "AI审合同工具"] },
  { slug: "ai-cook", title: "AI 做菜工具", keywords: ["AI做菜工具", "AI菜谱推荐", "冰箱有什么菜问AI", "AI定制菜谱"] },
  { slug: "ai-workout", title: "AI 健身教练工具", keywords: ["AI健身教练工具", "AI定制训练计划", "AI健身动作纠正", "免费AI健身软件"] },
  { slug: "ai-sleep", title: "AI 助眠工具", keywords: ["AI助眠工具", "AI白噪音", "AI睡眠监测", "AI哄睡软件"] },
  { slug: "ai-gardening", title: "AI 养花识图工具", keywords: ["AI识花工具", "AI植物识别", "拍照识别植物APP", "AI养花助手"] },
  { slug: "ai-pet-tools", title: "AI 宠物工具", keywords: ["AI宠物识别工具", "AI宠物照片生成", "AI宠物翻译", "AI宠物摄影"] },
  { slug: "ai-travel-planner", title: "AI 旅行规划工具", keywords: ["AI旅行规划工具", "AI做旅游攻略", "AI行程规划免费", "AI旅行助手"] },
  { slug: "ai-home-design", title: "AI 室内设计工具", keywords: ["AI室内设计工具", "AI装修效果图", "AI设计房间", "AI家居设计软件"] },
  { slug: "ai-research-paper", title: "AI 写论文工具", keywords: ["AI写论文工具", "AI论文降重", "AI找参考文献", "AI论文大纲生成"] },
  { slug: "ai-college-major", title: "AI 选专业工具", keywords: ["AI选专业工具", "AI高考志愿填报", "AI选学校工具", "AI职业规划工具"] },
  { slug: "ai-karaoke", title: "AI 分离伴奏工具", keywords: ["AI分离伴奏工具", "歌曲去人声软件", "AI扒谱工具", "免费去人声工具"] },
  { slug: "ai-voice-clone", title: "AI 声音克隆工具", keywords: ["AI声音克隆工具", "AI声音模仿", "AI克隆自己声音", "声音克隆免费"] },

  // ============ 补足 100 篇（偏门低竞争长尾）============
  { slug: "ai-paper-dedup", title: "AI 论文降重工具", keywords: ["AI论文降重工具", "论文查重怎么降", "AI改写论文降重", "免费论文降重"] },
  { slug: "ai-photo-colorize", title: "AI 老照片上色工具", keywords: ["AI老照片上色工具", "黑白照片AI上色", "老照片翻新上色", "免费照片上色软件"] },
  { slug: "ai-subtitle-translate", title: "AI 字幕翻译工具", keywords: ["AI字幕翻译工具", "视频字幕自动翻译", "外剧字幕AI翻译", "免费字幕翻译软件"] },
  { slug: "ai-meme-maker", title: "AI 表情包生成工具", keywords: ["AI表情包生成工具", "AI做表情包", "表情包生成器免费", "文字表情包AI"] },
  { slug: "ai-id-photo", title: "AI 证件照制作工具", keywords: ["AI证件照制作工具", "自己拍证件照AI", "证件照换底色AI", "免费证件照工具"] },
  { slug: "ai-kids-story", title: "AI 儿童绘本生成工具", keywords: ["AI儿童绘本工具", "AI给孩子讲故事", "AI绘本插图生成", "儿童故事AI生成"] },
  { slug: "ai-wallpaper", title: "AI 壁纸生成工具", keywords: ["AI壁纸生成工具", "AI做手机壁纸", "免费AI壁纸", "4K壁纸AI生成"] },
  { slug: "ai-product-image", title: "AI 商品主图工具", keywords: ["AI商品主图工具", "电商主图AI生成", "AI白底图工具", "商品图AI换背景"] },
  { slug: "ai-xiaohongshu-cover", title: "AI 小红书封面工具", keywords: ["AI小红书封面工具", "小红书封面AI生成", "小红书首图工具", "笔记封面AI排版"] },
  { slug: "ai-question-bank", title: "AI 出题工具", keywords: ["AI出题工具", "AI生成练习题", "教师AI出题", "试卷AI生成"] },

  // ============ 扩充篇（补强对比/语音/音乐/编程/场景）============
  // -- 对比类 --
  { slug: "compare-ai-notebook", title: "AI 笔记工具对比", keywords: ["AI笔记软件哪个好", "Notion和印象笔记AI对比", "AI会议纪要工具对比", "AI笔记工具测评"] },
  { slug: "compare-ai-music", title: "AI 音乐生成工具对比", keywords: ["AI音乐工具哪个好", "Suno和Udio对比", "AI作曲工具测评", "免费AI音乐哪个强"] },
  { slug: "compare-ai-avatar", title: "AI 数字人工具对比", keywords: ["AI数字人工具对比", "HeyGen和D-ID对比", "数字人软件哪个好用", "AI虚拟人测评"] },
  { slug: "compare-ai-pdf", title: "AI 阅读 PDF 工具对比", keywords: ["AI读PDF哪个好", "ChatPDF替代工具", "PDF问答工具对比", "AI论文阅读工具测评"] },
  { slug: "compare-ai-code", title: "AI 编程助手对比", keywords: ["AI编程助手哪个好", "Copilot和通义灵码对比", "Cursor好用吗", "免费AI编程工具测评"] },
  { slug: "compare-ai-subtitle", title: "AI 字幕工具对比", keywords: ["AI字幕工具哪个好", "视频字幕软件对比", "AI自动字幕测评", "免费字幕工具哪个准"] },
  // -- AI 语音 --
  { slug: "ai-live-translate", title: "AI 实时翻译耳机工具", keywords: ["AI同声传译工具", "实时翻译耳机推荐", "AI实时翻译软件", "会议实时翻译工具"] },
  { slug: "ai-voice-beautify", title: "AI 变声工具", keywords: ["AI变声器工具", "AI语音美化", "AI变声软件免费", "视频配音变声"] },
  { slug: "ai-audio-restore", title: "AI 音频降噪工具", keywords: ["AI音频降噪工具", "录音去杂音AI", "AI消除环境音", "免费音频降噪软件"] },
  { slug: "ai-voice-assistant", title: "AI 语音助手工具", keywords: ["AI语音助手推荐", "AI语音控制工具", "智能语音助手对比", "免费AI语音助理"] },
  // -- AI 音乐 --
  { slug: "ai-remix-tools", title: "AI 音乐混音工具", keywords: ["AI混音工具", "AI做伴奏", "AI音乐后期", "AI修音工具"] },
  { slug: "ai-cover-song", title: "AI 翻唱工具", keywords: ["AI翻唱工具", "AI唱别人的歌", "AI音色翻唱", "AI翻唱软件"] },
  { slug: "ai-lullaby", title: "AI 助眠音乐生成", keywords: ["AI助眠音乐", "AI白噪音生成", "AI睡前音乐", "AI放松音乐工具"] },
  // -- AI 编程 --
  { slug: "ai-lowcode", title: "AI 低代码建站工具", keywords: ["AI低代码工具", "不会代码做软件", "AI无代码平台", "AI快速开发工具"] },
  { slug: "ai-api-testing", title: "AI 接口测试工具", keywords: ["AI接口测试工具", "AI写API测试", "AI调试接口", "AI生成mock数据"] },
  { slug: "ai-docs-tools", title: "AI 生成代码文档工具", keywords: ["AI生成代码文档", "AI写注释工具", "代码文档自动生成", "AI文档助手编程"] },
  // -- 场景人群 --
  { slug: "ai-for-freelancers", title: "自由职业者 AI 工具", keywords: ["自由职业AI工具", "接单族AI提效", "自由职业者必备AI", "AI接单工具"] },
  { slug: "ai-for-startup", title: "创业团队 AI 工具", keywords: ["创业公司AI工具", "小团队AI提效", "创业必备AI软件", "AI工具创业团队"] },
  { slug: "ai-for-youtuber", title: "YouTuber AI 工具", keywords: ["YouTuber必备AI工具", "YouTube创作者AI", "油管博主AI工具", "海外视频AI工具"] },
  { slug: "ai-for-designer", title: "设计师 AI 工具", keywords: ["设计师AI工具推荐", "UI设计师必备AI", "平面设计AI工具", "设计师提效AI"] },
  // -- 更多教程 --
  { slug: "howto-ai-transcribe", title: "AI 录音转文字教程", keywords: ["AI录音转文字怎么弄", "会议录音转文字教程", "AI语音转文字步骤", "采访录音转文字"] },
  { slug: "howto-ai-mindmap", title: "AI 生成思维导图教程", keywords: ["AI做思维导图教程", "文字转导图怎么弄", "AI生成脑图步骤", "会议纪要转思维导图"] },
  { slug: "howto-ai-logo", title: "AI 做 Logo 教程", keywords: ["AI做Logo教程", "AI生成Logo步骤", "不会设计用AI做Logo", "免费AI Logo生成"] },
  { slug: "howto-ai-restore-video", title: "AI 视频修复教程", keywords: ["AI修复老视频", "模糊视频AI修复", "AI提升视频清晰度", "老视频翻新AI"] },
  { slug: "howto-ai-data", title: "AI 数据分析教程", keywords: ["AI分析数据教程", "不懂Excel用AI分析", "AI做图表教程", "AI数据分析步骤"] },
  // -- 垂直应用 --
  { slug: "ai-doc-scan", title: "AI 扫描识别工具", keywords: ["AI扫描工具", "拍照识别文字APP", "AI OCR识别工具", "免费文字识别软件"] },
  { slug: "ai-note-ocr", title: "AI 手写笔记识别工具", keywords: ["AI识别手写笔记", "手写转文字AI", "手写笔记电子化", "AI整理手写笔记"] },
  { slug: "ai-receipt-ocr", title: "AI 发票识别工具", keywords: ["AI发票识别工具", "发票扫码录入AI", "AI报销工具", "票据识别软件"] },
  { slug: "ai-job-hunting", title: "AI 求职工具", keywords: ["AI求职工具", "AI改简历找工作", "AI面试准备工具", "找工作AI助手"] },
  { slug: "ai-investment", title: "AI 理财助手工具", keywords: ["AI理财助手", "AI分析股票工具", "AI记账工具", "AI财务分析工具"] },
  { slug: "ai-shopping", title: "AI 购物比价工具", keywords: ["AI比价工具", "AI购物助手", "AI推荐商品", "AI省钱购物工具"] },
  { slug: "ai-fitness-plan", title: "AI 健身计划工具", keywords: ["AI健身计划生成", "AI定制训练方案", "AI健身教练测评", "免费AI健身计划"] },
  { slug: "ai-recipes", title: "AI 做饭菜谱工具", keywords: ["AI菜谱工具", "AI推荐家常菜", "AI做饭助手", "冰箱食材AI搭配"] },
  { slug: "ai-pet-name", title: "AI 宠物名字生成工具", keywords: ["AI给宠物起名", "宠物名字生成器", "AI宠物起名工具", "猫狗名字AI"] },
  { slug: "ai-baby-name", title: "AI 宝宝起名工具", keywords: ["AI给宝宝起名", "宝宝名字生成器", "AI起名工具", "新生儿起名AI"] },
  { slug: "ai-interior", title: "AI 家装设计工具", keywords: ["AI家装设计工具", "AI装修效果图生成", "AI软装搭配", "AI设计房间布局"] },
  { slug: "ai-garden", title: "AI 花园设计工具", keywords: ["AI花园设计工具", "AI庭院设计", "AI植物搭配", "AI景观设计"] },
  { slug: "ai-fashion", title: "AI 穿搭助手工具", keywords: ["AI穿搭助手", "AI推荐穿搭", "AI试衣工具", "AI时尚搭配"] },
  { slug: "ai-hairstyle", title: "AI 换发型工具", keywords: ["AI换发型工具", "AI试发型", "AI发型生成", "换发型效果图AI"] },
  { slug: "ai-makeup", title: "AI 妆容试色工具", keywords: ["AI试妆工具", "AI妆容推荐", "AI美妆效果", "AI化妆模拟"] },
  { slug: "ai-history-photo", title: "AI 历史照片上色工具", keywords: ["AI历史照片上色", "老照片修复上色", "黑白历史照片AI", "AI还原老照片"] },
  { slug: "ai-tour-guide", title: "AI 语音导游工具", keywords: ["AI语音导游", "AI景点讲解", "AI旅游讲解工具", "免费AI导游"] },
  { slug: "ai-language-partner", title: "AI 口语陪练工具", keywords: ["AI口语陪练", "AI英语口语对话", "AI练口语免费", "AI口语练习工具"] },
  { slug: "ai-study-planner", title: "AI 学习计划工具", keywords: ["AI学习计划生成", "AI制定学习计划", "AI备考计划", "AI学习规划工具"] },
  { slug: "ai-flashcards", title: "AI 背单词工具", keywords: ["AI背单词工具", "AI单词记忆软件", "AI记单词方法", "智能背单词APP"] },
  { slug: "ai-math-word-problem", title: "AI 解数学应用题工具", keywords: ["AI解应用题", "AI数学题讲解", "AI奥数解题工具", "AI数学辅导"] },
  { slug: "ai-physics-tutor", title: "AI 物理辅导工具", keywords: ["AI物理辅导", "AI解物理题", "AI物理学习工具", "物理不会用AI"] },
  { slug: "ai-chemistry-tutor", title: "AI 化学辅导工具", keywords: ["AI化学辅导", "AI解化学题", "AI化学学习工具", "化学方程式AI"] },
  { slug: "ai-history-study", title: "AI 历史学习工具", keywords: ["AI历史学习工具", "AI讲历史", "AI历史问答", "学历史用AI"] },
  { slug: "ai-geography", title: "AI 地理学习工具", keywords: ["AI地理学习工具", "AI地图工具", "AI学地理", "地理知识AI"] },
  { slug: "ai-books-summary", title: "AI 书籍总结工具", keywords: ["AI书籍总结工具", "AI一本书概括", "AI读书笔记生成", "AI快速读书"] },
  { slug: "ai-news-digest", title: "AI 新闻摘要工具", keywords: ["AI新闻摘要", "AI日报工具", "AI资讯整理", "AI新闻聚合工具"] },
  { slug: "ai-social-media-post", title: "AI 社媒发帖工具", keywords: ["AI社媒文案工具", "AI发帖助手", "AI多平台发帖", "AI社媒运营工具"] },
  { slug: "ai-comment-reply", title: "AI 评论回复工具", keywords: ["AI回复评论", "AI客服评论", "AI评论生成", "AI留言回复工具"] },
  { slug: "ai-tiktok-hook", title: "AI 短视频标题工具", keywords: ["AI短视频标题", "AI起爆款标题", "AI视频标题生成", "短视频标题工具"] },
  { slug: "ai-thumbnail", title: "AI 视频封面工具", keywords: ["AI视频封面工具", "AI缩略图生成", "AI封面设计", "视频封面AI制作"] },
  { slug: "ai-trademark", title: "AI 商标起名工具", keywords: ["AI商标起名", "AI品牌起名", "AI公司起名", "AI商标查询工具"] },
  { slug: "ai-brand-slogan", title: "AI 品牌口号工具", keywords: ["AI品牌口号生成", "AI广告语起名", "AI标语工具", "AI品牌文案"] }
];

/** 展开为扁平的关键词列表，方便统计 */
const ALL_KEYWORDS = KEYWORD_TOPICS.flatMap(t => t.keywords);

if (typeof window !== "undefined") {
  window.KEYWORD_TOPICS = KEYWORD_TOPICS;
  window.ALL_KEYWORDS = ALL_KEYWORDS;
}

if (typeof module !== "undefined") {
  module.exports = { KEYWORD_TOPICS, ALL_KEYWORDS };
}
