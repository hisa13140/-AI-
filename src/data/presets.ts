import { ToolMeta, SavedResource } from '../types';

export const TOOLS_LIST: ToolMeta[] = [
  // Kindergarten Dedicated Tools
  {
    id: 'kindergarten-activity',
    name: '幼教五大领域活动设计',
    shortDesc: '健康/语言/社会/科学/艺术·游戏化教学与一日活动方案',
    category: 'kindergarten',
    iconName: 'Baby',
    badge: '幼教必备',
    gradient: 'from-amber-500 to-rose-500',
    accentColor: 'amber',
  },
  {
    id: 'child-observation',
    name: '幼儿观察记录与个案分析',
    shortDesc: '学习故事·轶事白描·《3-6岁指南》发展评估与支持策略',
    category: 'kindergarten',
    iconName: 'Sparkles',
    badge: '指南对标',
    gradient: 'from-pink-500 to-rose-600',
    accentColor: 'pink',
  },
  {
    id: 'kindergarten-env',
    name: '班级环创与主题墙设计',
    shortDesc: '六大区角规划·主题墙版式·互动材料投放与动线动静分区',
    category: 'kindergarten',
    iconName: 'LayoutTemplate',
    badge: '环创灵感',
    gradient: 'from-teal-500 to-emerald-600',
    accentColor: 'teal',
  },

  // K-12 & Universal Tools
  {
    id: 'lesson-plan',
    name: '教案智能设计',
    shortDesc: '三维目标/核心素养/板书设计/分层作业一键生成',
    category: 'design',
    iconName: 'BookOpen',
    badge: '高频推荐',
    gradient: 'from-blue-600 to-indigo-600',
    accentColor: 'blue',
  },
  {
    id: 'quiz-gen',
    name: '考题试卷工坊',
    shortDesc: '知识点命题/多题型组合/标准答案与深度解析',
    category: 'assessment',
    iconName: 'HelpCircle',
    badge: '分层命题',
    gradient: 'from-emerald-600 to-teal-600',
    accentColor: 'emerald',
  },
  {
    id: 'essay-grade',
    name: '作文作业精批',
    shortDesc: '中英文作文深度批改/逐段润色/升格范例指引',
    category: 'assessment',
    iconName: 'FileCheck2',
    badge: '智能批注',
    gradient: 'from-amber-600 to-orange-600',
    accentColor: 'amber',
  },
  {
    id: 'student-comment',
    name: '个性化学生评语',
    shortDesc: '期末操行评定/多维度素养提炼/支持全班批量生成',
    category: 'evaluation',
    iconName: 'Award',
    badge: '班主任必备',
    gradient: 'from-purple-600 to-pink-600',
    accentColor: 'purple',
  },
  {
    id: 'ppt-outline',
    name: '课件大纲与放映',
    shortDesc: '结构化幻灯片规划/教师说课备忘/内置全屏演示',
    category: 'design',
    iconName: 'Presentation',
    badge: '带说课稿',
    gradient: 'from-cyan-600 to-blue-600',
    accentColor: 'cyan',
  },
  {
    id: 'parent-comm',
    name: '家校沟通锦囊',
    shortDesc: '家长会发言稿/敏感问题沟通话术/班级通知模板',
    category: 'evaluation',
    iconName: 'MessageSquareShare',
    badge: '情商话术',
    gradient: 'from-rose-600 to-red-600',
    accentColor: 'rose',
  },
  {
    id: 'class-activity',
    name: '课堂互动设计',
    shortDesc: '5分钟课前破冰/随堂探究活动/小组接力游戏',
    category: 'interaction',
    iconName: 'Sparkles',
    badge: '活跃课堂',
    gradient: 'from-violet-600 to-indigo-600',
    accentColor: 'violet',
  },
  {
    id: 'in-class-tools',
    name: '课堂实用小工具',
    shortDesc: '随机点名抽签/随堂倒计时器/小组分组转盘',
    category: 'classroom',
    iconName: 'Clock',
    badge: '课堂随堂',
    gradient: 'from-sky-600 to-teal-600',
    accentColor: 'sky',
  },
  {
    id: 'micro-lesson',
    name: '微课视频脚本',
    shortDesc: '5-8分钟录课分镜脚本/讲解台词/板书与视觉提示',
    category: 'design',
    iconName: 'Video',
    badge: '录课分镜',
    gradient: 'from-fuchsia-600 to-pink-600',
    accentColor: 'fuchsia',
  },
  {
    id: 'library',
    name: '我的教学备课库',
    shortDesc: '已保存教案、试卷、评语、课件的集中管理与导出',
    category: 'classroom',
    iconName: 'FolderArchive',
    gradient: 'from-slate-700 to-slate-900',
    accentColor: 'slate',
  }
];

export const KINDERGARTEN_DOMAINS = [
  '健康领域 (身心健康/动作发展/生活自理)',
  '语言领域 (倾听与表达/早期阅读与前书写)',
  '社会领域 (人际交往/社会适应/情绪认知)',
  '科学领域 (科学探究/数学认知/自然探索)',
  '艺术领域 (音乐律动/美术创作/戏剧表演)'
];

export const KINDERGARTEN_AGE_GROUPS = [
  '托班 (2-3岁)',
  '小班 (3-4岁)',
  '中班 (4-5岁)',
  '大班 (5-6岁)',
  '幼小衔接衔接期 (大班下学期)'
];

export const KINDERGARTEN_CENTERS = [
  '建构区 (积木搭建/结构认知)',
  '美工区 (涂鸦剪贴/黏土泥塑/自然物手工)',
  '角色表演区 (娃娃家/超市/医院/厨房)',
  '益智区 (拼图/数理棋类/逻辑桌游)',
  '阅读区 (绘本共读/绘本表演)',
  '科学探究区 (光影水流/动植物自然角/放大镜探索)',
  '体能运动区 (安吉游戏/平衡木/障碍闯关)'
];

export const SUBJECTS_LIST = [
  '语文', '数学', '英语', '物理', '化学', '生物',
  '历史', '道德与法治/政治', '地理', '科学', '信息科技',
  '音乐', '美术', '体育与健康', '综合实践活动'
];

export const GRADES_LIST = [
  '幼儿园小班 (3-4岁)', '幼儿园中班 (4-5岁)', '幼儿园大班 (5-6岁)',
  '小学一年级', '小学二年级', '小学三年级', '小学四年级', '小学五年级', '小学六年级',
  '初中七年级 (初一)', '初中八年级 (初二)', '初中九年级 (初三)',
  '高中一年级 (高一)', '高中二年级 (高二)', '高中三年级 (高三)',
  '中等职业/技校', '大学本科/专科'
];

export const SAMPLE_SAVED_RESOURCES: SavedResource[] = [
  {
    id: 'res-sample-k-1',
    title: '幼儿园中班科学领域《沉与浮的秘密》探究活动教案',
    toolId: 'kindergarten-activity',
    category: '幼儿园中班科学',
    createdAt: Date.now() - 3600 * 1000 * 24 * 1,
    tags: ['幼儿园中班', '科学探究', '沉浮实验', '游戏化活动'],
    isFavorite: true,
    content: `# 中班科学探究活动设计：《沉与浮的秘密》

## 一、 活动设计意图
中班幼儿对水具有天然的探索兴趣。在日常玩水、洗手、吃水果过程中，幼儿常会对“为什么有的东西浮在水面，有的东西沉到水底”产生好奇。根据《3-6岁儿童学习与发展指南》科学领域目标：“能对事物有好奇心和探究欲望，喜欢亲自动手操作并发现现象”，特设计本次趣味探究游戏。

---

## 二、 活动目标
1. **情感与态度目标**：乐于参与动手操作，体验与同伴合作探索沉浮现象的快乐。
2. **能力与方法目标**：能运用观察、猜想、实验和记录表（符号记录法）比较常见物体的沉浮特性。
3. **认知与经验目标**：感知铁钉、石头等较重物体会下沉，泡沫板、木块、塑料小鸭等会浮在水面上；初步尝试用改变物体形状或借助漂浮物的方法让沉下去的物体浮起来。

---

## 三、 活动准备
- **物质准备**：
  * 每组1个透明大水盆、毛巾若干。
  * 探究材料包（每组一份）：塑料积木、铁质小汤匙、木质积木、橡皮泥、海绵、玻璃弹珠、钥匙、树叶、干松果。
  * 幼儿个性化记录单（配“向上箭头代表浮、向下箭头代表沉”示意图）、记号笔。
- **经验准备**：幼儿有过日常玩水洗手、洗水果的生活经验。

---

## 四、 活动实施过程（预计 25 分钟）

### 1. 魔法情境导入（3分钟）
- **情境创设**：“小黄鸭去水上乐园游泳，邀请了好多好朋友一起来玩水！可是有些朋友一跳进水里就看不见了，有些朋友却能稳稳漂在水面。我们一起来帮小黄鸭找找哪些朋友能漂在水上吧！”
- **出示材料**：展示神秘宝盒，逐一请幼儿说出物品名称。

### 2. 幼儿大胆猜想与符号记录（5分钟）
- **发散提问**：“猜一猜，如果把钥匙和海绵放进水里，谁会浮在水面？谁会沉下去？”
- **记录猜想**：幼儿在记录表上的“猜想栏”中画上对应箭头（↑ 或 ↓）。

### 3. 分组亲历实验与验证（10分钟）
- **操作规则**：
  * 轻轻放，水花不溅出。
  * 拿一样，测一样，在“实验栏”做好标记。
- **教师巡回个别化指导**：
  * 观察幼儿是否能细致观察浸水过程；
  * 启发提问学有余力幼儿：“看，橡皮泥沉下去了，如果把它捏成小船形状，它还能浮起来吗？”

### 4. 游戏化总结与科学小发现（5分钟）
- **大图表展示**：师生共同汇总将物品按“沉”和“浮”进行分类归位。
- **科学儿歌记忆**：
  * “小鸭子，浮上来；小树叶，漂水面；铁钥匙，沉下去；沉浮秘密真有趣！”

### 5. 区域与家园延伸（2分钟）
- **科学角延伸**：投放胡萝卜块、盐水与鸡蛋，探索“神奇的盐水浮蛋”。
- **家园共育**：建议家长在晚间洗澡或洗菜时，与孩子共同寻找家中的沉浮小玩具。`
  },
  {
    id: 'res-sample-1',
    title: '《背影》（朱自清）大单元启发式教学教案',
    toolId: 'lesson-plan',
    category: '初中语文',
    createdAt: Date.now() - 3600 * 1000 * 24 * 2,
    tags: ['初中语文', '散文赏析', '核心素养', '详案'],
    isFavorite: true,
    content: `# 《背影》大单元深度教学设计
...`
  }
];

export const STUDENT_ROSTER_SAMPLE = [
  { name: '张子轩', gender: 'male' as const, level: '优秀', tags: ['思维敏捷', '班长/责任心强', '理科拔尖', '乐于助人'], note: '偶尔书写略显潦草' },
  { name: '李雨桐', gender: 'female' as const, level: '优秀', tags: ['文笔细腻', '踏实认真', '专注力高', '画画特长'], note: '课堂发言可更加自信大方' },
  { name: '王俊杰', gender: 'male' as const, level: '良好', tags: ['体育健将', '性格阳光', '动手能力强', '积极活跃'], note: '理科计算粗心，需培养耐性' },
  { name: '陈思羽', gender: 'female' as const, level: '良好', tags: ['温和懂礼', '英语口语好', '作业工整', '人际融洽'], note: '数学大题缺乏深度探究毅力' },
  { name: '刘浩宇', gender: 'male' as const, level: '有进步空间', tags: ['幽默开朗', '热心劳动', '反应快', '善于观察'], note: '上课易受同桌干扰分心，需加强自律' },
  { name: '赵梓涵', gender: 'female' as const, level: '中等', tags: ['安静守纪', '字迹娟秀', '勤奋打卡', '态度端正'], note: '需主动提问，掌握科学高效的复习方法' },
];
