export interface GenerateOptions {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
  onChunk?: (accumulatedText: string, latestChunk: string) => void;
}

export async function requestAIGeneration(options: GenerateOptions): Promise<string> {
  const { prompt, systemInstruction, temperature = 0.7, onChunk } = options;

  // 1. If streaming is supported and onChunk callback provided, use /api/gemini/stream
  if (onChunk) {
    try {
      const response = await fetch('/api/gemini/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction,
          temperature,
        }),
      });

      const contentType = response.headers.get('content-type') || '';

      if (response.ok && contentType.includes('text/event-stream') && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullText = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const jsonStr = trimmed.substring(6).trim();
              try {
                const data = JSON.parse(jsonStr);
                if (data.text) {
                  fullText += data.text;
                  onChunk(fullText, data.text);
                } else if (data.done) {
                  // Stream finished successfully
                } else if (data.error) {
                  console.warn('Stream chunk reported error:', data.error);
                  throw new Error(data.error);
                }
              } catch (e: any) {
                if (e.message && !e.message.includes('Unexpected token')) {
                  throw e;
                }
              }
            }
          }
        }

        if (fullText.trim().length > 0) {
          return fullText;
        }
      } else {
        // If stream response is not ok (e.g. 500 JSON error)
        let errorMsg = 'AI 流式生成未成功';
        try {
          const errData = await response.json();
          if (errData?.error) errorMsg = errData.error;
        } catch {
          // ignore non-json
        }
        console.warn('Stream responded with non-stream status:', response.status, errorMsg);
      }
    } catch (streamErr) {
      console.warn('Streaming fetch failed, attempting standard generate POST:', streamErr);
    }
  }

  // 2. Fallback or Standard non-streaming POST to /api/gemini/generate
  try {
    const response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        systemInstruction,
        temperature,
        responseMimeType: options.responseMimeType,
      }),
    });

    const contentType = response.headers.get('content-type') || '';
    const rawText = await response.text();

    let data: any = {};
    if (contentType.includes('application/json') || rawText.startsWith('{')) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = {};
      }
    }

    if (!response.ok) {
      const errMsg = data.error || `AI 接口响应异常 (${response.status})`;
      throw new Error(errMsg);
    }

    if (data.text) {
      if (onChunk) {
        onChunk(data.text, data.text);
      }
      return data.text;
    }

    throw new Error('AI 未返回生成内容，请重试');
  } catch (err: any) {
    console.error('AI Request error:', err);
    throw new Error(err.message || 'AI 生成失败，请稍后重试');
  }
}

// Structured Prompt Builders for Educators

// 1. Kindergarten Five Domains Activity Design
export function buildKindergartenActivityPrompt(params: {
  domain: string;
  ageGroup: string;
  topic: string;
  durationMinutes: number;
  gameElements: string;
  specialRequirements?: string;
}): { prompt: string; systemInstruction: string } {
  const systemInstruction = `你是一位国家级幼儿园骨干教师、学前教育特级教师与教研员。
你深度精通中国教育部《3-6岁儿童学习与发展指南》、《幼儿园教育指导纲要（试行）》以及《幼儿园保育教育质量评估指南》。
你擅长设计“以游戏为基本活动”、富有趣味性、情境化、激发幼儿主动探究和动作/语言/社会性发展的精品五大领域活动方案。使用标准 Markdown 格式输出。`;

  const prompt = `请为以下幼儿园教学活动，生成一份符合国家《3-6岁儿童学习与发展指南》标准的五大领域完整教学设计（详案）：

【基本信息】
- 所属领域：${params.domain}
- 适用年龄段：${params.ageGroup}
- 活动主题/内容：《${params.topic}》
- 预计活动时长：${params.durationMinutes} 分钟
- 游戏化形式/玩法特色：${params.gameElements}
${params.specialRequirements ? `- 教师特别要求：${params.specialRequirements}` : ''}

【必须包含的幼教标准结构】：
1. # 活动名称与设计意图（结合《指南》对应领域目标与幼儿年龄特点分析）
2. ## 一、 活动目标（从三个维度制定，表述符合幼儿身心特点）：
   - 【情感态度与兴趣】：
   - 【能力习惯与动作/技能】：
   - 【经验认知与理解】：
3. ## 二、 活动重难点
   - 活动重点：
   - 活动难点及突破策略：
4. ## 三、 活动准备
   - 【物质准备】：（具体教具、玩教具、操作材料、多媒体课件）
   - 【经验准备】：（幼儿前期已具备的生活或操作经验）
   - 【场地与环境准备】：（如U型座位、地垫、游戏区角）
5. ## 四、 活动实施过程（分步详述，含具体师幼对话、情境过渡语、游戏玩法）：
   - 【环节一：情境激趣 / 导入新课】（用故事/儿歌/谜语/魔法盒子等趣味引入）
   - 【环节二：探索感知 / 自主尝试】（出示材料，鼓励幼儿看、听、摸、做）
   - 【环节三：深化体验 / 游戏挑战】（核心游戏互动，设置阶梯式趣味任务）
   - 【环节四：分享表达 / 梳理总结】（引导幼儿大胆表达自己的发现，附易记儿歌/口诀）
   - 【环节五：活动延伸】
     * 班级区角延伸（如美工区/建构区/益智区如何承接）
     * 户外体能或生活环节延伸
     * 家园共育建议（亲子家庭小任务）
6. ## 五、 教师巡视指导与安全保育提示
   - 关注个别差异（针对胆小慢热或过于活跃幼儿的个别化支持）
   - 安全与健康提示（如小零件防吞食、防碰撞、材料安全）`;

  return { prompt, systemInstruction };
}

// 2. Child Observation and Learning Story
export function buildChildObservationPrompt(params: {
  childName: string;
  ageGroup: string;
  domain: string;
  observationContext: string;
  rawBehaviorDescription: string;
  teacherFocus?: string;
}): { prompt: string; systemInstruction: string } {
  const systemInstruction = `你是一位精通新西兰“学习故事”（Learning Stories）与中国《3-6岁儿童学习与发展指南》的资深幼教观察与儿童发展评估专家。
你善于透过幼儿在自主游戏、区域活动和一日生活中的言行细节，敏锐捕捉儿童的学习品质、关键经验与最近发展区，给出温暖、专业且富有支持性的教育策略。`;

  const prompt = `请根据以下幼儿在园的真实行为记录，生成一份专业的【幼儿观察记录与个案分析报告（学习故事）】：

【基本信息】
- 观察对象：${params.childName}
- 年龄学段：${params.ageGroup}
- 关联领域：${params.domain}
- 观察情境/场景：${params.observationContext}
${params.teacherFocus ? `- 教师关注点：${params.teacherFocus}` : ''}

【原始行为白描与现场记录】：
"""
${params.rawBehaviorDescription}
"""

【专业分析报告规范框架】：
1. # 观察记录标题（生动、富有童趣的标题，如《小积木的大城堡》、《我不怕黑黑的隧道了》）
2. ## 一、 发生了什么（客观行为白描实录）
   - 梳理时间、地点、材料背景
   - 客观记叙幼儿的动作细节、语言对话、面部表情、眼神注视与情绪变化（避免主观评判词）
3. ## 二、 学习了什么（基于《3-6岁指南》的深度行为分析）
   - 【发展水平与关键经验】：该行为体现了幼儿在《指南》对应领域的何种发展阶段？
   - 【学习品质表现】：体现了何种好奇心、专注力、坚持性、抗挫力或同伴协商能力？
   - 【潜在需求与阻碍】：幼儿当前遇到了什么挑战？
4. ## 三、 教师下一步支持策略（机会与可能）
   - 【环境与材料调整】：下一步如何在区角中增减何种材料以支持其探索？
   - 【师幼互动策略】：教师在何时以何种角色（观察者/引导者/游戏伙伴）介入？
   - 【个别化启发引导语】：教师可以提问哪两句关键启发式问题？
5. ## 四、 家园协同共育建议
   - 针对家长在家庭环境中的支持建议（100字左右，温暖鼓励，具体易操作）`;

  return { prompt, systemInstruction };
}

// 3. Kindergarten Classroom Environment & Theme Wall Design
export function buildKindergartenEnvPrompt(params: {
  themeName: string;
  ageGroup: string;
  spaceType: string;
  style: string;
  materialsPreference: string;
}): { prompt: string; systemInstruction: string } {
  const systemInstruction = `你是一位顶级幼儿园环境创设专家与儿童空间美学设计师。
你倡导“让环境成为第三位老师”、“儿童是环境的主人”的现代环创理念，注重动静分区、低结构自然材料投放、幼儿作品痕迹、互动式墙面与儿童视线高度。`;

  const prompt = `请为以下幼儿园班级空间设计一套完整的【班级环创与主题墙创设方案】：

【创设信息】
- 主题名称：《${params.themeName}》
- 年龄班级：${params.ageGroup}
- 空间范围：${params.spaceType}
- 视觉风格：${params.style}
- 材料偏好：${params.materialsPreference}

【方案内容框架】：
1. # 主题环创设计理念与色系规划（主色调、辅助色、氛围营造）
2. ## 一、 主题墙面核心版块规划（布局示意与儿童视线平视设计）
   - 【版块1：我们的问题与发现】（幼儿前经验与探索痕迹）
   - 【版块2：探究过程与大图表】（照片墙、符号调查表、生长记录）
   - 【版块3：互动操作与游戏转盘】（幼儿可随手取放、拨动、配对的互动墙设计）
   - 【版块4：我的创意秀】（幼儿个性化美工作品悬挂/粘贴区）
3. ## 二、 配套区域活动角（Learning Centers）材料投放清单
   - 美工区 / 建构区 / 益智区 / 科学区 的主题材料投放与进阶玩法
4. ## 三、 低结构与废旧物品环保改造清单
   - 纸箱、麻绳、树枝、松果、瓶盖等自然材料与生活废弃物的巧妙改造
5. ## 四、 家园互动墙与幼儿参与实施步骤`;

  return { prompt, systemInstruction };
}

// Structured Prompt Builders for Educators
export function buildLessonPlanPrompt(params: {
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  pedagogicalStyle: string;
  competencyFocus: string;
  customRequirements?: string;
}): { prompt: string; systemInstruction: string } {
  const systemInstruction = `你是一位拥有20年国家级教学名师经验的特级教师和教学教研专家。
你精通中国教育部新课程标准（最新版课标）、大单元教学设计、学科核心素养培育、三维教学目标及现代启发探究式教学法。
请生成一份格式规范、排版优美、具备高度可执行性与落地性的结构化详案。使用标准 Markdown 格式输出。`;

  const prompt = `请为以下课程生成一份完整的特级教师示范级教学设计（详案）：

【基本信息】
- 学科：${params.subject}
- 适用年级：${params.grade}
- 课题名称：《${params.topic}》
- 课时安排：${params.duration}
- 教学风格/方法：${params.pedagogicalStyle}
- 核心素养侧重：${params.competencyFocus}
${params.customRequirements ? `- 教师特别要求：${params.customRequirements}` : ''}

【必须包含的标准结构与模块】：
1. # 课题名称与设计理念
2. ## 一、 课标要求与核心素养目标
   - 包含【知识与技能/学科素养】【过程与方法/关键能力】【情感态度价值观/必备品格】
3. ## 二、 教学重难点与学情分析
   - 重点、难点及突破策略
4. ## 三、 教学准备与教具资源
5. ## 四、 教学过程详细设计（需标明每个环节预计用时，如5分钟、15分钟等）：
   - 【环节一：情境创设 / 导入新课】（具体师生对话、引导情境）
   - 【环节二：任务驱动 / 新知探究】（分层次的核心问题链、活动设计）
   - 【环节三：合作研讨 / 深化拓展】（生生互动、思维碰撞设计）
   - 【环节四：随堂检测 / 巩固应用】（精心设计的变式例题）
   - 【环节五：课堂小结 / 情感升华】
6. ## 五、 结构化板书设计（使用清晰的图示、思维导图式ASCII框图或提纲排版）
7. ## 六、 分层作业设计
   - 【基础巩固作业】
   - 【能力提升作业】
   - 【综合探究/实践作业】
8. ## 七、 教学反思预案与教学提示（教师容易踩坑的点与应对预案）`;

  return { prompt, systemInstruction };
}

export function buildQuizPrompt(params: {
  subject: string;
  grade: string;
  topic: string;
  difficulty: string;
  types: string[];
  count: number;
  includeExplanations: boolean;
  specialInstructions?: string;
}): { prompt: string; systemInstruction: string } {
  const systemInstruction = `你是一位权威的中高考及期末考试命题组专家教师。
你命制的试题严谨无科学性错误，符合课程标准，考查梯度清晰，区分度与信度高，语言规范。
解析部分必须步骤详尽、逻辑清晰、指出易错陷阱与核心考点。`;

  const prompt = `请为以下科目和知识点命制一份高质量的检测练习卷：

【命题参数】
- 学科：${params.subject}
- 年级：${params.grade}
- 考核主题/知识点：${params.topic}
- 难度水平：${params.difficulty}
- 题型组合：${params.types.join('、')}
- 总题数：约 ${params.count} 题
- 解析要求：${params.includeExplanations ? '必须提供标准答案、考点定位、分步详细解析与易错警示' : '提供简明参考答案'}
${params.specialInstructions ? `- 补充要求：${params.specialInstructions}` : ''}

【试卷输出规范要求】：
1. 顶部输出试卷大标题、满分预设、建议答题时间。
2. 按照大题题型分大类（如 一、单项选择题 二、填空题 三、解答探究题...）。
3. 每道题目排版清晰，标明分值。
4. 在试卷后半部分或题目下方清晰给出【参考答案】【考点梳理】【详细解析与踩分点】【易错警示】。
5. 涉及数学/物理公式时，请使用规范清晰的 LaTeX 数学公式格式（如 $x^2 + y^2 = r^2$ ）。`;

  return { prompt, systemInstruction };
}

export function buildEssayGradePrompt(params: {
  essayType: string;
  gradeLevel: string;
  topicTitle: string;
  content: string;
  rubricFocus: string;
}): { prompt: string; systemInstruction: string } {
  const systemInstruction = `你是一位深具教育温情的高考/中考作文阅卷组组长与写作特级教师。
你的评语客观敏锐、鼓励为主、指引精辟。既能挖掘学生的闪光点，又能一针见血指出立意、结构、语言或逻辑上的软肋，并给出切实可行的升格修改方案。`;

  const prompt = `请对以下学生提交的习作/作业进行全方位、专业深度的智能批阅：

【作文基本信息】
- 作文类别：${params.essayType}
- 适用学段：${params.gradeLevel}
- 题目/写作要求：《${params.topicTitle || '自命题'}》
- 评分标准侧重：${params.rubricFocus}

【学生提交内容】：
"""
${params.content}
"""

【批阅报告规范结构】：
1. # 综合评分与等级判定（标明得分，如 52/60分 或 88/100分，并给出等级：一类卷/二类卷）
2. ## 一、 亮点采撷（肯定立意、文采、情感、结构等方面的成功之处，增强学生信心）
3. ## 二、 诊断与不足（分析扣分点：如选材陈旧、结构松散、词汇重复、过渡生硬等）
4. ## 三、 逐段精细批注与润色对比（选取文中2-3处典型语句或段落，给出【原句】与【润色升格句】，并说明修改理由）
5. ## 四、 经典升格示范（针对该文的某处薄弱段落，提供一段特级教师示范重写的满分升格段）
6. ## 五、 教师寄语与针对性训练建议（给学生的量身定制建议，150字左右）`;

  return { prompt, systemInstruction };
}

export function buildStudentCommentPrompt(params: {
  name: string;
  gender: string;
  grade: string;
  performanceLevel: string;
  traits: string[];
  strengths: string;
  improvements: string;
  tone: string;
}): { prompt: string; systemInstruction: string } {
  const systemInstruction = `你是一位深谙青少年心理学、深受学生和家长爱戴的资深班主任。
你擅长撰写具有温度、个性化、走心且富有教育启发性的学生操行评语与期末素质报告册评语。
坚决杜绝千篇一律的套话（如“该生遵纪守法，学习认真”），注重用敏锐的观察抓住每个孩子的独特性格，用温暖而有力量的文字点燃学生的内驱力。`;

  const prompt = `请为学生【${params.name}】撰写一份高质量的期末评语：

【学生档案】
- 姓名：${params.name}（${params.gender === 'male' ? '男生' : '女生'}）
- 年级：${params.grade}
- 总体表现水平：${params.performanceLevel}
- 性格与特质标签：${params.traits.join('、')}
- 闪光点与特长优势：${params.strengths}
- 改进期望与成长建议：${params.improvements}
- 评语语言风格：${params.tone}

【请提供以下两个版本的评语】：
1. **【标准期末素质报告册评语】**（200-280字，结构完整：肯定亮点与闪光点 + 展现具体细节特质 + 委婉提出针对性期望与指引 + 励志结语）
2. **【精练版/成绩单寄语】**（80-120字，精炼有力，适合快速填写或家长会交流卡片）
3. **【班主任私享建议点】**（1-2句供家校沟通时对家长说的话术）`;

  return { prompt, systemInstruction };
}

export function buildPptOutlinePrompt(params: {
  subject: string;
  grade: string;
  topic: string;
  slideCount: number;
  style: string;
  specialRequests?: string;
}): { prompt: string; systemInstruction: string } {
  const systemInstruction = `你是一位顶尖的教育课件设计师和特级说课名师。
你擅长设计结构严谨、逻辑清晰、互动性强的多媒体 PPT 课件大纲，并且能够为每一页幻灯片提供实用的教师说课讲义台词与课堂提问设计。`;

  const prompt = `请为以下课程设计一套结构化 PPT 课件大纲（共 ${params.slideCount} 页）：

- 学科：${params.subject}
- 年级：${params.grade}
- 课题：《${params.topic}》
- 风格特色：${params.style}
${params.specialRequests ? `- 特别要求：${params.specialRequests}` : ''}

【输出格式要求】：
请为每一页幻灯片按照以下统一的 Markdown 格式输出：

### Slide [序号]：[本页标题]
- **页面类型**：[如：封面 / 导入激趣 / 概念精讲 / 实验演示 / 案例研讨 / 随堂测验 / 课堂小结 / 作业拓展]
- **画面核心视觉/板式建议**：[建议配图、图表类型或视觉布局]
- **课件展示核心要点**：
  * 要点1
  * 要点2
  * 要点3
- **教师说课讲义 / 讲台提示词**：[教师在讲授此页时的完整口语化讲解台词与过渡语]
- **课堂互动提问 / 互动活动**：[本页配套的随堂提问或学生互动任务]

请确保生成全部 ${params.slideCount} 页，逻辑连贯，层层递进！`;

  return { prompt, systemInstruction };
}

export function buildParentCommPrompt(params: {
  scenario: string;
  targetStudent?: string;
  topicSummary: string;
  tone: string;
  specialContext?: string;
}): { prompt: string; systemInstruction: string } {
  const systemInstruction = `你是一位精通家校沟通心理学、深得家长信赖的优秀班主任与德育名师。
你深知家校共育的核心在于“真诚共情、基于事实、少批评多方案、携手合作”，语言得体文雅，兼具原则性与人情味。`;

  const prompt = `请根据以下情境，为教师生成一套专业、高情商的家校沟通文案或话术指南：

【沟通情境】
- 场景类别：${params.scenario}
${params.targetStudent ? `- 涉及学生：${params.targetStudent}` : ''}
- 沟通核心事件/主题：${params.topicSummary}
- 期望语气与基调：${params.tone}
${params.specialContext ? `- 背景细节与特殊考量：${params.specialContext}` : ''}

【输出内容框架】：
1. **【正文文案】**（如为家长会发言稿、群发通知或微信沟通消息，请输出可直接复制使用的规范文本）
2. **【电话/面谈核心要点备忘清单】**（分步骤：共情破冰 -> 摆出客观事实 -> 挖掘深层原因 -> 共同制定行动清单）
3. **【高情商避坑指南】**（提醒教师避免使用的伤害性语言，以及如何化解家长的焦虑或防御心理）`;

  return { prompt, systemInstruction };
}

export function buildClassActivityPrompt(params: {
  activityType: string;
  subject: string;
  grade: string;
  topic: string;
  durationMinutes: number;
  groupSize: string;
}): { prompt: string; systemInstruction: string } {
  const systemInstruction = `你是一位精通游戏化教学、探究式学习与翻转课堂的创新教育专家。
你设计的课堂活动兼具趣味性、全员参与度与知识内化度，规则清晰，控场容易，道具简便。`;

  const prompt = `请为以下课程设计一个生动有趣的课堂互动教学活动：

- 活动类型：${params.activityType}
- 学科与年级：${params.subject} (${params.grade})
- 结合知识点/主题：《${params.topic}》
- 预计耗时：${params.durationMinutes} 分钟
- 学生组织形式：${params.groupSize}

【请包含以下方案要素】：
1. **活动名称与核心教育目标**（兼顾趣味与学科素养）
2. **所需简易教具/准备工作**
3. **极简规则说明（3条以内，学生一听就懂）**
4. **活动分步实施流程（含教师主持词、学生任务、时间分配）**
5. **积分/激励机制与评价方式**
6. **教师控场小锦囊（如何避免课堂失控或冷场）**`;

  return { prompt, systemInstruction };
}

export function buildMicroLessonPrompt(params: {
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  visualStyle: string;
}): { prompt: string; systemInstruction: string } {
  const systemInstruction = `你是一位国家精品微课大赛特等奖得主与资深数字化教学设计师。
你编写的微课视频脚本镜头感强、语言精炼生动、板书与动画时机卡点准确。`;

  const prompt = `请为微课录制编写一份专业的分镜脚本：

- 学科与年级：${params.subject} (${params.grade})
- 微课微专题：《${params.topic}》
- 视频总时长：${params.duration}（通常5-8分钟）
- 呈现风格：${params.visualStyle}

【请以标准分镜表形式输出】：
包含：
| 序号 | 预计时间 | 画面呈现/课件动画/板书视觉 | 教师口播台词（生动自然） | 音效与互动提示 |
并在文末附上【本微课核心提炼导图】与【录制设备及教具建议】。`;

  return { prompt, systemInstruction };
}
