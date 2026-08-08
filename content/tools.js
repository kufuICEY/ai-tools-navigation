/**
 * AI 工具导航数据
 * ==================================================
 * 结构说明：
 *   - id:       分类唯一标识（用于 URL，如 /category.html?cat=chat）
 *   - name:     分类名称
 *   - desc:     分类的一句话简介（用于分类页 SEO 描述）
 *   - keywords: 该分类的 SEO 关键词
 *   - tools:    工具数组，每个工具包含 { name, url, desc, tags, badge? }
 *
 * 添加新工具只需在这个文件里新增一条记录，然后运行 `npm run build` 即可。
 */
const CATEGORIES = [
  {
    id: "chat",
    icon: "💬",
    name: "聊天助手",
    desc: "通用 AI 对话助手合集：免费好用的大语言模型聊天工具，帮你写作、问答、翻译、头脑风暴。",
    keywords: "AI聊天助手,免费AI对话工具,大语言模型,AI写作助手,国产ChatGPT",
    tools: [
      { name: "DeepSeek", url: "https://chat.deepseek.com", desc: "国产开源大模型，推理能力强，支持长上下文，官方免费使用。", tags: ["免费", "开源", "中文强"] , badge: "热门" },
      { name: "豆包", url: "https://www.doubao.com", desc: "字节跳动出品，免费 AI 对话助手，支持 AI 搜索、图片生成、语音对话。", tags: ["免费", "国产", "多功能"], badge: "热门" },
      { name: "Kimi", url: "https://kimi.moonshot.cn", desc: "月之暗面出品，长文本处理能力突出，适合论文、长文档阅读。", tags: ["长文本", "国产", "免费"] },
      { name: "文心一言", url: "https://yiyan.baidu.com", desc: "百度出品，中文理解能力强，支持联网搜索与插件生态。", tags: ["国产", "百度", "联网"] },
      { name: "通义千问", url: "https://tongyi.aliyun.com", desc: "阿里云出品，免费 AI 助手，集成文档、PPT、绘图等多场景工具。", tags: ["免费", "阿里", "办公"] },
      { name: "智谱清言", url: "https://chatglm.cn", desc: "智谱 AI 出品，基于 GLM 大模型，代码能力与逻辑推理较强。", tags: ["国产", "GLM", "代码"] },
      { name: "讯飞星火", url: "https://xinghuo.xfyun.cn", desc: "科大讯飞出品，语音识别技术强，适合会议记录与口语练习。", tags: ["语音", "国产", "免费"] },
      { name: "腾讯元宝", url: "https://yuanbao.tencent.com", desc: "腾讯出品的 AI 助手，接入微信公众号生态与腾讯生态内容。", tags: ["腾讯", "国产", "微信"] }
    ]
  },
  {
    id: "search",
    icon: "🔍",
    name: "AI 搜索",
    desc: "AI 搜索引擎推荐：与传统搜索不同，AI 搜索直接给你整理好的答案，附上来源链接，告别广告和垃圾信息。",
    keywords: "AI搜索引擎,AI搜索工具,免费AI搜索,Perplexity中文替代",
    tools: [
      { name: "Perplexity", url: "https://www.perplexity.ai", desc: "全球最流行的 AI 搜索引擎，答案引用来源，支持学术搜索与文件上传。", tags: ["国外", "引用来源", "必用"], badge: "热门" },
      { name: "秘塔 AI 搜索", url: "https://metaso.cn", desc: "国内免费 AI 搜索，无广告、答案结构化，适合学术与深度研究。", tags: ["免费", "无广告", "学术"], badge: "推荐" },
      { name: "Felo AI 搜索", url: "https://felo.ai", desc: "支持中英日韩等多语言，可生成思维导图，适合跨语言检索。", tags: ["多语言", "思维导图", "免费"] },
      { name: "博查 AI 搜索", url: "https://www.bochaai.com", desc: "国产 AI 搜索 API 与搜索服务，支持深度问题研究与追问。", tags: ["国产", "API", "研究"] },
      { name: "Devv.ai", url: "https://devv.ai", desc: "面向程序员的 AI 搜索引擎，直接检索 GitHub、Stack Overflow 等开发者内容。", tags: ["编程", "开发者", "免费"] },
      { name: "iAsk AI", url: "https://iask.ai", desc: "免费无广告的 AI 搜索引擎，支持中英文提问与实时答案。", tags: ["免费", "无广告", "实时"] }
    ]
  },
  {
    id: "image",
    icon: "🎨",
    name: "AI 绘图",
    desc: "AI 绘画工具大全：从免费国产文生图到专业 AI 图片创作平台，一键生成插画、海报、头像和设计素材。",
    keywords: "AI绘画工具,AI生成图片,AI绘图免费,文生图,AI图片生成",
    tools: [
      { name: "即梦 AI", url: "https://jimeng.jianying.com", desc: "字节跳动出品，免费 AI 绘画与视频生成，支持海报、图片、数字人。", tags: ["免费", "国产", "视频"], badge: "热门" },
      { name: "Midjourney", url: "https://www.midjourney.com", desc: "全球最火的 AI 绘画工具，艺术感与细节表现力一流。", tags: ["付费", "艺术", "顶级"] },
      { name: "Stable Diffusion", url: "https://stability.ai", desc: "开源 AI 绘图模型，可本地部署，社区生态庞大，插件丰富。", tags: ["开源", "本地", "免费"] },
      { name: "通义万相", url: "https://tongyi.aliyun.com/wanxiang", desc: "阿里出品，免费 AI 绘画，支持文生图、图生图、风格迁移。", tags: ["免费", "国产", "阿里"] },
      { name: "文心一格", url: "https://yige.baidu.com", desc: "百度出品的 AI 艺术创作平台，中文提示词理解好。", tags: ["免费", "国产", "百度"] },
      { name: "Leonardo AI", url: "https://leonardo.ai", desc: "免费额度较多的 AI 绘图工具，适合游戏素材与概念设计。", tags: ["免费额度", "游戏", "设计"] },
      { name: "LiblibAI", url: "https://www.liblib.art", desc: "国内最大的 AI 绘画模型社区，海量 LoRA 模型可直接在线使用。", tags: ["社区", "模型", "国产"], badge: "推荐" },
      { name: "Recraft AI", url: "https://www.recraft.ai", desc: "免费 AI 设计工具，可生成 SVG 矢量图、图标与品牌素材。", tags: ["免费", "矢量", "设计"] }
    ]
  },
  {
    id: "video",
    icon: "🎬",
    name: "AI 视频",
    desc: "AI 视频生成工具推荐：文生视频、数字人播报、视频剪辑，用 AI 快速制作短视频内容。",
    keywords: "AI视频生成,AI做视频工具,数字人,文生视频,AI剪辑",
    tools: [
      { name: "可灵 AI", url: "https://klingai.com", desc: "快手出品，国产文生视频天花板之一，支持图生视频与延长创作。", tags: ["国产", "文生视频", "免费额度"], badge: "热门" },
      { name: "Runway", url: "https://runwayml.com", desc: "好莱坞常用 AI 视频工具，Gen 系列模型效果出色，支持视频编辑。", tags: ["国外", "专业", "付费"] },
      { name: "Pika", url: "https://pika.art", desc: "轻量易用的 AI 视频生成平台，支持图生视频与局部修改。", tags: ["国外", "易用", "图生视频"] },
      { name: "海螺 AI", url: "https://hailuoai.com", desc: "MiniMax 出品，免费 AI 视频生成，人物动作与一致性表现好。", tags: ["免费", "国产", "MiniMax"] },
      { name: "剪映", url: "https://www.capcut.cn", desc: "国民级剪辑软件，内置海量 AI 功能：字幕、数字人、一键成片。", tags: ["免费", "剪辑", "数字人"], badge: "必备" },
      { name: "HeyGen", url: "https://www.heygen.com", desc: "AI 数字人视频生成，支持多语言口型同步，适合做口播视频。", tags: ["数字人", "口播", "付费"] },
      { name: "Luma Dream Machine", url: "https://lumalabs.ai", desc: "Luma 出品的 AI 视频生成工具，可生成高质量电影感镜头。", tags: ["国外", "电影感", "文生视频"] }
    ]
  },
  {
    id: "writing",
    icon: "✍️",
    name: "AI 写作",
    desc: "AI 写作助手与文案工具：写文章、写周报、写小红书文案、生成公文和营销文案的一站式工具。",
    keywords: "AI写作工具,AI文案生成,AI写文章,小红书文案生成器,AI公文写作",
    tools: [
      { name: "Notion AI", url: "https://www.notion.so/product/ai", desc: "笔记与知识库巨头内置 AI，写作、总结、翻译无缝衔接。", tags: ["笔记", "写作", "付费"] },
      { name: "Jasper", url: "https://www.jasper.ai", desc: "专注营销文案的 AI 写作工具，支持品牌语气与团队协作。", tags: ["营销", "英文", "付费"] },
      { name: "Copy.ai", url: "https://www.copy.ai", desc: "海外热门营销文案生成器，电商详情页、广告语一键生成。", tags: ["营销", "电商", "付费"] },
      { name: "秘塔写作猫", url: "https://xiezuocat.com", desc: "国产 AI 写作与校对工具，查错别字、改病句、润色一站式。", tags: ["校对", "润色", "免费"], badge: "推荐" },
      { name: "笔灵 AI 写作", url: "https://ibiling.cn", desc: "国产 AI 写作平台，覆盖公文、论文、小说、小红书等 300+ 场景。", tags: ["国产", "公文", "多场景"] },
      { name: "Effidit", url: "https://effidit.qq.com", desc: "腾讯出品的智能写作助手，输入联想与改写润色体验流畅。", tags: ["腾讯", "免费", "改写"] },
      { name: "Writesonic", url: "https://writesonic.com", desc: "多语言 AI 写作工具，内置 SEO 优化功能，适合做内容站。", tags: ["SEO", "多语言", "付费"] },
      { name: "讯飞写作", url: "https://www.iflyrec.com", desc: "科大讯飞出品，语音转写后一键成文，适合会议纪要、采访稿。", tags: ["语音转写", "国产", "纪要"] }
    ]
  },
  {
    id: "voice",
    icon: "🔊",
    name: "AI 语音",
    desc: "AI 语音工具集合：文字转语音配音、声音克隆、语音识别、会议转写，做视频配音必备。",
    keywords: "AI配音工具,文字转语音,AI语音合成,声音克隆,免费配音",
    tools: [
      { name: "ElevenLabs", url: "https://elevenlabs.io", desc: "全球最逼真的 AI 语音合成工具，声音情感丰富，支持 30+ 语言。", tags: ["国外", "逼真", "配音"], badge: "热门" },
      { name: "豆包配音", url: "https://www.doubao.com", desc: "字节跳动免费 AI 配音工具，支持超百种音色与多情感朗读。", tags: ["免费", "国产", "多音色"], badge: "推荐" },
      { name: "剪映文本朗读", url: "https://www.capcut.cn", desc: "剪映内置文字转语音，免费音色多，中文效果好，剪辑时直接配音。", tags: ["免费", "剪辑", "国产"] },
      { name: "魔音工坊", url: "https://www.moyin.com", desc: "国内商用配音平台，音色丰富，适合有声书、广告配音。", tags: ["商用", "国产", "音色多"] },
      { name: "讯飞配音", url: "https://peiyin.xunfei.cn", desc: "科大讯飞配音平台，发音标准，支持多方言与英文。", tags: ["国产", "标准", "方言"] },
      { name: "Whisper", url: "https://openai.com/research/whisper", desc: "OpenAI 开源语音识别模型，免费本地部署，转写准确率高。", tags: ["开源", "免费", "本地"] },
      { name: "通义听悟", url: "https://tingwu.aliyun.com", desc: "阿里云免费会议转写工具，自动生成会议纪要与重点摘要。", tags: ["免费", "会议", "转写"] }
    ]
  },
  {
    id: "music",
    icon: "🎵",
    name: "AI 音乐",
    desc: "AI 音乐生成工具：一句话生成歌曲、AI 作曲伴奏、音频分离，创作背景音乐和原创歌曲。",
    keywords: "AI音乐生成,AI作曲工具,AI生成歌曲,免费AI音乐,Suno",
    tools: [
      { name: "Suno", url: "https://suno.com", desc: "全球最火的 AI 音乐生成器，输入歌词和风格即可生成完整歌曲。", tags: ["免费额度", "歌曲", "热门"], badge: "热门" },
      { name: "Udio", url: "https://www.udio.com", desc: "高质量 AI 音乐生成，人声自然、风格多元，支持音轨扩展。", tags: ["国外", "高质量", "人声"] },
      { name: "网易天音", url: "https://tianyin.music.163.com", desc: "网易云音乐出品的 AI 音乐创作工具，模板丰富易上手。", tags: ["国产", "网易", "免费"] },
      { name: "ACE Studio", url: "https://www.acestudio.ai", desc: "AI 虚拟歌手引擎，可调音色情感，适合制作中文原创歌曲。", tags: ["虚拟歌手", "国产", "调校"] },
      { name: "Lalals", url: "https://lalals.com", desc: "AI 音色转换工具，把自己的声音转换成明星音色翻唱。", tags: ["音色转换", "翻唱", "国外"] },
      { name: "Moises", url: "https://moises.ai", desc: "AI 音频分离工具，一键分离人声和伴奏，适合扒谱和做伴奏。", tags: ["音频分离", "扒谱", "免费额度"] }
    ]
  },
  {
    id: "coding",
    icon: "💻",
    name: "AI 编程",
    desc: "AI 编程助手与开发工具：AI 写代码、代码补全、智能调试，程序员提效必备神器。",
    keywords: "AI编程工具,AI写代码,AI代码助手,免费编程AI,Cursor",
    tools: [
      { name: "Cursor", url: "https://cursor.com", desc: "AI 原生代码编辑器，可对话式改代码，被誉为程序员新神器。", tags: ["编辑器", "热门", "对话编程"], badge: "热门" },
      { name: "GitHub Copilot", url: "https://github.com/features/copilot", desc: "GitHub 出品的 AI 编程助手，代码补全准确，支持主流 IDE。", tags: ["代码补全", "微软", "付费"] },
      { name: "通义灵码", url: "https://tongyi.aliyun.com/lingma", desc: "阿里云免费 AI 编程助手，支持代码生成、解释、单元测试。", tags: ["免费", "国产", "阿里"], badge: "推荐" },
      { name: "CodeGeeX", url: "https://codegeex.cn", desc: "智谱 AI 出品的免费编程助手，支持多种编程语言。", tags: ["免费", "国产", "多语言"] },
      { name: "Claude", url: "https://claude.ai", desc: "Anthropic 出品的 AI 助手，代码能力强，配合 Agent 可自动改代码。", tags: ["代码强", "Agent", "编程"] },
      { name: "v0 by Vercel", url: "https://v0.dev", desc: "Vercel 出品的 AI 建站工具，一句话生成 React 前端页面。", tags: ["前端", "React", "建站"] },
      { name: "Tabnine", url: "https://www.tabnine.com", desc: "注重隐私的 AI 代码补全工具，可本地部署模型。", tags: ["隐私", "补全", "本地"] },
      { name: "Replit", url: "https://replit.com", desc: "云端 IDE 集成 AI，在线写代码、部署应用，适合初学者。", tags: ["云端", "在线", "学习"] }
    ]
  },
  {
    id: "office",
    icon: "🗂️",
    name: "AI 办公",
    desc: "AI 办公效率工具：AI 做 PPT、AI 表格处理、AI 文档总结，打工人提效必备。",
    keywords: "AI办公工具,AI做PPT,AI表格工具,AI文档处理,办公效率工具",
    tools: [
      { name: "Gamma", url: "https://gamma.app", desc: "AI 一键生成演示文稿，支持 PPT、网页、文档多种形式。", tags: ["PPT", "国外", "免费额度"], badge: "热门" },
      { name: "WPS AI", url: "https://ai.wps.cn", desc: "WPS 内置 AI 助手，文档、表格、PPT 一站式智能处理。", tags: ["国产", "WPS", "办公"], badge: "推荐" },
      { name: "美图 AI PPT", url: "https://www.designkit.com", desc: "美图设计室出品，AI 一键生成 PPT，模板颜值高。", tags: ["PPT", "国产", "免费"] },
      { name: "ChatExcel", url: "https://chatexcel.com", desc: "用对话操作 Excel，自动写公式、做图表，不懂公式也能用。", tags: ["表格", "对话", "公式"] },
      { name: "百度如流", url: "https://ruflow.baidu.com", desc: "百度出品的 AI 办公套件，整合会议、文档、知识库。", tags: ["协作", "国产", "百度"] },
      { name: "讯飞智文", url: "https://zw.xfyun.cn", desc: "讯飞 AI 文档工具，输入主题一键生成 PPT 大纲与内容。", tags: ["国产", "文档", "PPT"] },
      { name: "Nolan AI", url: "https://www.nolanai.app", desc: "AI 简历优化工具，帮你一键生成并美化求职简历。", tags: ["简历", "求职", "AI"] }
    ]
  },
  {
    id: "special",
    icon: "🛠️",
    name: "AI 特殊用途",
    desc: "垂直领域 AI 工具：AI 翻译、AI 去背景、AI 老照片修复、AI 数字人播报等黑科技工具合集。",
    keywords: "AI特殊工具,AI翻译,AI照片修复,AI去背景,AI数字人",
    tools: [
      { name: "DeepL", url: "https://www.deepl.com/translator", desc: "全球翻译质量最高的在线翻译工具，支持 30+ 语言。", tags: ["翻译", "精准", "免费额度"], badge: "必备" },
      { name: "Remove.bg", url: "https://www.remove.bg", desc: "AI 一键抠图去背景，电商修图、证件照换背景神器。", tags: ["抠图", "免费", "一键"] },
      { name: "佐糖", url: "https://picwish.cn", desc: "国产 AI 修图工具，老照片修复、去水印、图片放大免费好用。", tags: ["修图", "老照片", "免费"], badge: "推荐" },
      { name: "D-ID", url: "https://www.d-id.com", desc: "AI 数字人视频，用一张照片生成会说话的人物视频。", tags: ["数字人", "照片说话", "国外"] },
      { name: "美图设计室", url: "https://www.designkit.com", desc: "AI 电商设计平台，海报、商品图、Logo 设计素材丰富。", tags: ["设计", "电商", "国产"] },
      { name: "ChatPDF", url: "https://www.chatpdf.com", desc: "上传 PDF 直接对话，论文、合同、书籍快速总结提问。", tags: ["PDF", "论文", "免费额度"] },
      { name: "Hume AI", url: "https://www.hume.ai", desc: "情感识别 AI，可分析语音与表情中的情绪，用于陪伴与客服。", tags: ["情感", "语音", "前沿"] },
      { name: "Photomath", url: "https://photomath.com", desc: "AI 拍照解题，拍下数学题立即给出步骤详解，学生神器。", tags: ["解题", "数学", "学生"] }
    ]
  }
];

/** 将分类数据同步到 window（供页面脚本使用） */
if (typeof window !== "undefined") {
  window.CATEGORIES = CATEGORIES;
}

/** Node 环境导出（供构建脚本使用） */
if (typeof module !== "undefined") {
  module.exports = { CATEGORIES };
}
