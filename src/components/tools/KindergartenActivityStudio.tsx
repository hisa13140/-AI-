import React, { useState } from 'react';
import { Baby, Sparkles, Loader2, Wand2, Layers, BookOpen, Heart, Shield, Puzzle, Trees } from 'lucide-react';
import { SAMPLE_SAVED_RESOURCES } from '../../data/presets';
import { requestAIGeneration, buildKindergartenActivityPrompt } from '../../services/aiService';
import { MarkdownViewer } from '../MarkdownViewer';
import { saveResource } from '../../utils/storage';
import { CurriculumPicker, CurriculumSelection } from '../CurriculumPicker';

interface Props {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSavedChange?: () => void;
}

export function KindergartenActivityStudio({ onNotify, onSavedChange }: Props) {
  const [stage, setStage] = useState('kindergarten');
  const [domain, setDomain] = useState('科学领域');
  const [ageGroup, setAgeGroup] = useState('幼儿园中班 (4-5岁)');
  const [unit, setUnit] = useState('大自然的奥秘与物理探究');
  const [topic, setTopic] = useState('《沉与浮的秘密（水性与密度初探）》');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [gameElements, setGameElements] = useState('趣味实验操作 + 符号记录表 + 游戏化儿歌总结');
  const [specialRequirements, setSpecialRequirements] = useState('');

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>(
    SAMPLE_SAVED_RESOURCES[0]?.content || ''
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleCurriculumChange = (sel: CurriculumSelection) => {
    setStage(sel.stage);
    setAgeGroup(sel.grade);
    setDomain(sel.subject);
    setUnit(sel.unit);
    setTopic(sel.topic);

    if (sel.grade.includes('小班') || sel.grade.includes('托班')) {
      setDurationMinutes(15);
    } else if (sel.grade.includes('中班')) {
      setDurationMinutes(25);
    } else if (sel.grade.includes('大班')) {
      setDurationMinutes(30);
    }
  };

  // Quick activity presets for Kindergarten teachers
  const activityPresets = [
    {
      name: '中班科学《沉与浮的秘密》',
      dom: '科学领域 (科学探究/数学认知/自然探索)',
      age: '中班 (4-5岁)',
      top: '《沉与浮的秘密》',
      dur: 25,
      game: '动手沉浮实验 + 符号记录卡 + 沉浮小鸭情境故事',
      req: '注重幼儿的自主猜想与符号记录，融入家庭洗澡玩水生活经验。'
    },
    {
      name: '小班健康《小手真干净 (洗手七步法)》',
      dom: '健康领域 (身心健康/动作发展/生活自理)',
      age: '小班 (3-4岁)',
      top: '《小手真干净（细菌大作战与洗手七步儿歌）》',
      dur: 15,
      game: '荧光粉/肥皂泡泡游戏 + 动作律动儿歌 + 拟人化细菌怪兽',
      req: '语言极简生动，儿歌朗朗上口，重点掌握指缝和手腕的清洗。'
    },
    {
      name: '大班语言绘本《猜猜我有多爱你》',
      dom: '语言领域 (倾听与表达/早期阅读与前书写)',
      age: '大班 (5-6岁)',
      top: '绘本深读与表达《猜猜我有多爱你》',
      dur: 30,
      game: '绘本分角色精读 + “爱可以比作什么”句式创编 + 动作比划表达',
      req: '引导大班幼儿用“我爱你有从这里到……那么远”进行大胆创造性表述。'
    },
    {
      name: '中班社会《好朋友，抱一抱 (情绪与交往)》',
      dom: '社会领域 (人际交往/社会适应/情绪认知)',
      age: '中班 (4-5岁)',
      top: '《好朋友，抱一抱（学会分享与同伴交往）》',
      dur: 25,
      game: '找朋友音乐游戏 + 情绪脸谱拼图 + 分享玩具情境模拟',
      req: '针对争抢玩具现象，引导幼儿学习礼貌商量与轮流玩。'
    },
    {
      name: '大班艺术《奇妙的树叶拓印画》',
      dom: '艺术领域 (音乐律动/美术创作/戏剧表演)',
      age: '大班 (5-6岁)',
      top: '创意美术《秋天的树叶奇遇记（拓印与拼贴）》',
      dur: 30,
      game: '大自然捡落叶探索 + 颜料滚轮拓印 + 故事性拼贴创作',
      req: '低结构自然材料利用，鼓励幼儿自由创作，不提供死板范画。'
    },
  ];

  const handleApplyPreset = (p: typeof activityPresets[0]) => {
    setDomain(p.dom);
    setAgeGroup(p.age);
    setTopic(p.top);
    setDurationMinutes(p.dur);
    setGameElements(p.game);
    setSpecialRequirements(p.req);
    onNotify('info', `已载入活动范例：${p.name}`);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      onNotify('error', '请输入活动主题');
      return;
    }

    setLoading(true);
    setIsSaved(false);
    setGeneratedContent('');

    try {
      const { prompt, systemInstruction } = buildKindergartenActivityPrompt({
        domain,
        ageGroup,
        topic,
        durationMinutes,
        gameElements,
        specialRequirements,
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
      onNotify('success', '五大领域幼教活动方案已生成！');
    } catch (err: any) {
      console.error(err);
      onNotify('error', err.message || '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedContent) return;
    saveResource({
      title: `${ageGroup.split(' ')[0]}${domain.split(' ')[0]} - ${topic}`,
      toolId: 'kindergarten-activity',
      category: `${ageGroup.split(' ')[0]}${domain.split(' ')[0]}`,
      tags: ['幼教教案', ageGroup.split(' ')[0], domain.split(' ')[0], '五大领域'],
      content: generatedContent,
    });
    setIsSaved(true);
    onNotify('success', '已将幼教活动方案保存至【我的备课库】');
    if (onSavedChange) onSavedChange();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-pink-600 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-xs text-xs font-medium text-amber-100 mb-2">
            <Baby className="w-3.5 h-3.5 text-amber-200" />
            <span>教育部《3-6岁儿童学习与发展指南》对标 · 游戏化教学</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">幼教五大领域活动设计工坊</h2>
          <p className="text-rose-100 text-sm mt-1 max-w-2xl">
            专为幼儿园小中大班量身定制。涵盖健康、语言、社会、科学、艺术五大领域，包含情境导入、探究游戏、区域延伸与家园共育方案。
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 md:max-w-md">
          <span className="text-xs text-amber-200 w-full mb-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" /> 快速载入五大领域经典示范课：
          </span>
          {activityPresets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="text-xs px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-md text-white transition-colors border border-white/10 truncate max-w-[150px]"
            >
              {p.name.replace(/幼儿园|班|领域/g, '')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-500" />
                <span>五大领域与活动主题智能选择</span>
              </div>
              <span className="text-2xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-medium">
                3-6岁指南题库
              </span>
            </h3>

            {/* Cascading Curriculum Picker */}
            <CurriculumPicker
              initialStage="kindergarten"
              initialGrade={ageGroup}
              initialSubject={domain}
              initialUnit={unit}
              initialTopic={topic}
              accentColor="amber"
              onSelectionChange={handleCurriculumChange}
            />

            {/* Duration & Game elements */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  活动时长: <span className="font-semibold text-rose-600">{durationMinutes} 分钟</span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={40}
                  step={5}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500"
                />
                <span className="text-2xs text-slate-400 block mt-0.5">托小班15m · 中班20-25m · 大班30m</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">游戏化载体形式</label>
                <select
                  value={gameElements}
                  onChange={(e) => setGameElements(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 px-2 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="动手实验操作 + 符号记录表 + 游戏化儿歌总结">动手实验 + 符号记录</option>
                  <option value="情境角色扮演 + 任务闯关打卡">情境扮演 + 任务闯关</option>
                  <option value="音乐身体律动 + 听觉节奏互动">音乐律动 + 节奏互动</option>
                  <option value="绘本沉浸阅读 + 戏剧表演表达">绘本沉浸 + 戏剧表演</option>
                  <option value="户外体能障碍赛 + 安吉游戏自主探索">体能闯关 + 自主游戏</option>
                </select>
              </div>
            </div>

            {/* Special requirements */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                特别要求与保育重点 (选填)
              </label>
              <textarea
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                rows={2}
                placeholder="例如：需包含一个低结构材料操作环节；针对个别胆怯幼儿的启发话术..."
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>学前特级名师正在设计五大领域活动...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>一键生成游戏化幼教活动详案</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Viewer */}
        <div className="lg:col-span-7">
          {generatedContent ? (
            <MarkdownViewer
              title={`【${ageGroup.split(' ')[0]}】${domain.split(' ')[0]} - ${topic} 活动设计`}
              content={generatedContent}
              onSaveToLibrary={handleSave}
              isSaved={isSaved}
              onContentChange={(newContent) => setGeneratedContent(newContent)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                <Baby className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-slate-800 text-base mb-1">幼教活动设计就绪</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-4">
                选择五大领域与班级学段，AI 将依据《3-6岁指南》为您输出目标明确、以游戏为核心的高质量公开课与一日活动教案。
              </p>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors"
              >
                立即生成活动教案
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
