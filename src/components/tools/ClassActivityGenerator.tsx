import React, { useState } from 'react';
import { Sparkles, Loader2, Wand2, Gamepad2, Users, Layers } from 'lucide-react';
import { requestAIGeneration, buildClassActivityPrompt } from '../../services/aiService';
import { MarkdownViewer } from '../MarkdownViewer';
import { saveResource } from '../../utils/storage';
import { CurriculumPicker, CurriculumSelection } from '../CurriculumPicker';

interface Props {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSavedChange?: () => void;
}

export function ClassActivityGenerator({ onNotify, onSavedChange }: Props) {
  const [stage, setStage] = useState('junior');
  const [activityType, setActivityType] = useState('5分钟课前破冰与知识抢答游戏');
  const [subject, setSubject] = useState('英语');
  const [grade, setGrade] = useState('初中七年级 (初一)');
  const [unit, setUnit] = useState('Unit 5: Do you have a soccer ball?');
  const [topic, setTopic] = useState('一般现在时与日常活动词汇 (Daily Routines)');
  const [durationMinutes, setDurationMinutes] = useState(8);
  const [groupSize, setGroupSize] = useState('4-6人学习小组合作PK');

  const handleCurriculumChange = (sel: CurriculumSelection) => {
    setStage(sel.stage);
    setGrade(sel.grade);
    setSubject(sel.subject);
    setUnit(sel.unit);
    setTopic(sel.topic);
  };

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>(`# 课堂趣味互动方案：《日常作息超级侦探 (Time Detective)》

## 一、 活动目标与素养建构
- **核心知识**：熟练运用一般现在时第三人称单数表达（e.g. He gets up at 7:00. Does she brush her teeth?）
- **核心素养**：在真实交际与推理解谜中提高口语表达流利度，培养团队协作与倾听归纳能力。

---

## 二、 所需简易教具
- 教师准备：PPT倒计时钟表、4套“嫌疑人作息卡片”（A4打印即可剪裁）。
- 学生准备：每组一张“侦探推理解密单”与一支笔。

---

## 三、 极简游戏规则（3句话说明）
1. 每组抽到一张“神秘嫌疑人的一天”作息卡（只有组长可见）。
2. 其他小组成员通过提问一般疑问句（如 "Does he eat lunch at 12:00?"），组长只能回答 "Yes, he does." 或 "No, he doesn't."。
3. 最先还原嫌疑人完整作息表的小组获得“王牌神探”积分勋章！

---

## 四、 课堂实施分步流程（共 8 分钟）

### 1. 任务发布与情境导入（1.5分钟）
- **教师主持词**：“Attention, detectives! 伦敦大英博物馆的一块古代日晷失窃了，嫌疑人留下了一份密电码作息表！现在各组化身苏格兰场特警，限时5分钟通过英文问答破译密码！”
- 屏幕开启 5 分钟倒计时与紧张轻快的探案配乐。

### 2. 小组接力探案 PK（5分钟）
- 组员依次用英语提问，并在推理解密单上打勾或打叉。
- 教师巡视各组，在黑板积分榜上为全程使用英语、发音准确的小组贴上“金币贴纸”。

### 3. 破案揭晓与语法精练（1.5分钟）
- 邀请最快完成的第2小组代表上台展示推理解密单，并用完整的英文句子汇报：
  *"He brushes his teeth at 6:30 am, eats breakfast at 7:00 am..."*
- 全班核对，教师带领齐读重点动词三单变位（get ➔ gets, brush ➔ brushes）。

---

## 五、 积分与激励机制
- **速度分**：前三名破译小组分别积 3分、2分、1分。
- **素养分**：全员参与无掉队、全程纯英文交流的小组额外加 2分。
- 累计积分计入本周“班级领航小组”流动红旗评比。

---

## 六、 教师控场小锦囊
- 若有学困生不敢开口，提醒组长分配固定句型卡（如 "Does he...?" 句式条），让每位同学都能自信参与！`);

  const [isSaved, setIsSaved] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      onNotify('error', '请输入结合的教学主题或知识点');
      return;
    }

    setLoading(true);
    setIsSaved(false);
    setGeneratedContent('');

    try {
      const { prompt, systemInstruction } = buildClassActivityPrompt({
        activityType,
        subject,
        grade,
        topic,
        durationMinutes,
        groupSize,
      });

      const result = await requestAIGeneration({
        prompt,
        systemInstruction,
        temperature: 0.7,
        onChunk: (accumulated) => {
          setGeneratedContent(accumulated);
        },
      });

      setGeneratedContent(result);
      onNotify('success', '课堂互动与游戏方案已生成！');
    } catch (err: any) {
      console.error(err);
      onNotify('error', err.message || '生成失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedContent) return;
    saveResource({
      title: `${topic} - 课堂互动活动设计`,
      toolId: 'class-activity',
      category: `${grade.split(' ')[0]}${subject}`,
      tags: [subject, '课堂活动', activityType.split(' ')[0]],
      content: generatedContent,
    });
    setIsSaved(true);
    onNotify('success', '已将活动方案保存至【我的备课库】');
    if (onSavedChange) onSavedChange();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-700 to-indigo-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs text-xs font-medium text-violet-100 mb-2">
            <Gamepad2 className="w-3.5 h-3.5 text-violet-300" />
            <span>游戏化教学·全员参与·高效控场</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">课堂互动与趣味活动设计</h2>
          <p className="text-violet-100 text-sm mt-1 max-w-2xl">
            快速生成5分钟课前破冰、知识抢答接力、小组微辩论与STEM探究活动，激发学生自驱力与课堂活跃度。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-600" />
                <span>联动学科大纲与课题选择</span>
              </div>
              <span className="text-2xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded font-medium">
                新课标互动库
              </span>
            </h3>

            {/* Cascading Curriculum Picker */}
            <CurriculumPicker
              initialStage="junior"
              initialGrade={grade}
              initialSubject={subject}
              initialUnit={unit}
              initialTopic={topic}
              accentColor="violet"
              onSelectionChange={handleCurriculumChange}
            />

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">活动模式与类型</label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
              >
                <option value="5分钟课前破冰与知识抢答游戏">5分钟课前破冰抢答游戏</option>
                <option value="小组合作拼图互教 (Jigsaw 互学)">小组互教互评 (Jigsaw 拼图法)</option>
                <option value="微型课堂辩论赛与思维风暴">微型课堂辩论赛 (思维碰撞)</option>
                <option value="情境角色扮演与模拟体验">情境角色扮演 (沉浸体验)</option>
                <option value="STEM动手实践与任务卡闯关">STEM动手探究与任务卡闯关</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  活动耗时: <span className="font-semibold text-violet-700">{durationMinutes} 分钟</span>
                </label>
                <input
                  type="range"
                  min={3}
                  max={20}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                  className="w-full accent-violet-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">组织形式</label>
                <select
                  value={groupSize}
                  onChange={(e) => setGroupSize(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                >
                  <option value="4-6人学习小组合作PK">4-6人小组合作PK</option>
                  <option value="同桌两人结对互相提问 (Pair Work)">同桌两人结对 (Pair Work)</option>
                  <option value="全班大轮换式抢答互动">全班抢答大轮换</option>
                  <option value="两大阵营正反方对垒">两大阵营正反方对垒</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>正在设计妙趣横生的课堂互动...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>一键生成趣味互动活动方案</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Viewer */}
        <div className="lg:col-span-7">
          {generatedContent ? (
            <MarkdownViewer
              title={`《${topic}》课堂互动方案`}
              content={generatedContent}
              onSaveToLibrary={handleSave}
              isSaved={isSaved}
              onContentChange={(newContent) => setGeneratedContent(newContent)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-slate-800 text-base mb-1">互动方案就绪</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-4">
                输入学科课题，AI 将为您量身设计规则简单、易于控场、充满趣味的高效课堂互动游戏。
              </p>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-violet-50 text-violet-700 rounded-lg text-xs font-semibold hover:bg-violet-100 transition-colors"
              >
                立即生成活动
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
