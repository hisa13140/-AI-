import React, { useState } from 'react';
import { Sparkles, Loader2, Wand2, Eye, BookOpen, Layers, Heart, CheckCircle2 } from 'lucide-react';
import { KINDERGARTEN_DOMAINS, KINDERGARTEN_AGE_GROUPS, KINDERGARTEN_CENTERS } from '../../data/presets';
import { requestAIGeneration, buildChildObservationPrompt } from '../../services/aiService';
import { MarkdownViewer } from '../MarkdownViewer';
import { saveResource } from '../../utils/storage';

interface Props {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSavedChange?: () => void;
}

export function ChildObservationStudio({ onNotify, onSavedChange }: Props) {
  const [childName, setChildName] = useState('天天 (化名)');
  const [ageGroup, setAgeGroup] = useState('中班 (4-5岁)');
  const [domain, setDomain] = useState('科学领域 (科学探究/数学认知/自然探索)');
  const [observationContext, setObservationContext] = useState('建构区 (积木搭建/结构认知)');
  const [teacherFocus, setTeacherFocus] = useState('抗挫折能力、空间平衡感知与同伴合作协商');

  const [rawBehaviorDescription, setRawBehaviorDescription] = useState(`在今天下午的区域自主游戏时间，天天走进建构区，挑选了10块长条形实木积木和若干圆柱体积木。
他尝试搭建一座“高高的大桥”。第一次，他将三块长积木竖着叠放，放第四块时，积木晃动并倒塌了。天天皱了一下眉头，叹了口气，但没有离开。
第二次，他蹲下来观察地面的缝隙，换了底部的两块积木，改用两个较宽的立方体做桥墩，上面平铺长条积木。当大桥搭到大约30厘米高时，同组的浩浩走过来碰到了桌子，积木再次倒塌。
天天大声对浩浩说：“你慢一点，把我的桥碰倒了！”浩浩有些不好意思，说：“对不起，我帮你一起搭吧。”
天天点点头，指着身旁的圆柱积木说：“你帮我拿两个圆圆的柱子当柱子，我们搭一个不会倒的双层立交桥！”随后两人配合，天天负责调整平衡，浩浩负责传递积木，最终成功搭建了一座稳固的双层桥梁，天天高兴地拍手大笑。`);

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);

  // Sample observation scenarios
  const sampleObservations = [
    {
      title: '建构区《双层大桥不倒翁》(中班)',
      name: '天天',
      age: '中班 (4-5岁)',
      dom: '科学领域 (科学探究/数学认知/自然探索)',
      ctx: '建构区 (积木搭建/结构认知)',
      focus: '抗挫折能力、空间平衡感知与同伴合作协商',
      raw: `在今天下午的区域自主游戏时间，天天走进建构区，挑选了10块长条形实木积木和若干圆柱体积木。
他尝试搭建一座“高高的大桥”。第一次，他将三块长积木竖着叠放，放第四块时，积木晃动并倒塌了。天天皱了一下眉头，叹了口气，但没有离开。
第二次，他蹲下来观察地面的缝隙，换了底部的两块积木，改用两个较宽的立方体做桥墩，上面平铺长条积木。当大桥搭到大约30厘米高时，同组的浩浩走过来碰到了桌子，积木再次倒塌。
天天大声对浩浩说：“你慢一点，把我的桥碰倒了！”浩浩有些不好意思，说：“对不起，我帮你一起搭吧。”
天天点点头，指着身旁的圆柱积木说：“你帮我拿两个圆圆的柱子当柱子，我们搭一个不会倒的双层立交桥！”随后两人配合，天天负责调整平衡，浩浩负责传递积木，最终成功搭建了一座稳固的双层桥梁，天天高兴地拍手大笑。`
    },
    {
      title: '美工区《给妈妈做一朵不会谢的花》(小班)',
      name: '朵朵',
      age: '小班 (3-4岁)',
      dom: '艺术领域 (音乐律动/美术创作/戏剧表演)',
      ctx: '美工区 (涂鸦剪贴/黏土泥塑/自然物手工)',
      focus: '小肌肉精细动作、手眼协调与情感表达',
      raw: `在美工区自选活动中，朵朵选了粉色和绿色的超轻黏土。她先是用两只小手掌心用力搓出了一个圆球，但是黏土球掉在地上沾了灰尘。朵朵自己捡起来用湿纸巾擦拭，然后重新搓。
她尝试用手指捏出花瓣，一开始压得太扁黏在桌子上撕不下来，急得向老师求助：“老师，花瓣粘住了。”
老师回应：“试试用塑料小刮刀轻轻推一下。”朵朵拿到工具后，小心翼翼地把黏土铲起，然后把五片花瓣组合在一起，并在中间插了一根小冰棒棍。
朵朵举起作品对老师说：“这是送给我妈妈的魔法花，永远不会枯萎！”`
    },
    {
      title: '生活区进餐《我自己能剥虾仁了》(托班/小班)',
      name: '阳阳',
      age: '小班 (3-4岁)',
      dom: '健康领域 (身心健康/动作发展/生活自理)',
      ctx: '生活自理与一日生活环节 (进餐与盥洗)',
      focus: '生活自理能力、自信心与手部小肌肉发展',
      raw: `午餐时间，今天的菜谱有水煮海虾。以往阳阳遇到带壳的食物总是坐着不动或者说“老师我不会”。
今天在老师鼓励“试试看给大虾脱衣服”后，阳阳先是用小勺子按住虾尾，右手拇指和食指试着去抠虾头的壳。第一次壳碎了，虾肉还是出不来。
阳阳没有放弃，他观察旁边乐乐的手法，学着用两只手从虾背部慢慢剥开。经过近两分钟的努力，他完整地剥出了一颗完整的虾仁，一口吃掉并兴奋地对保育员阿姨说：“阿姨你看，我自己剥的大虾，好甜！”`
    }
  ];

  const handleApplySample = (s: typeof sampleObservations[0]) => {
    setChildName(s.name);
    setAgeGroup(s.age);
    setDomain(s.dom);
    setObservationContext(s.ctx);
    setTeacherFocus(s.focus);
    setRawBehaviorDescription(s.raw);
    onNotify('info', `已载入观察案例：${s.title}`);
  };

  const handleGenerate = async () => {
    if (!rawBehaviorDescription.trim()) {
      onNotify('error', '请输入幼儿的行为白描记录');
      return;
    }

    setLoading(true);
    setIsSaved(false);
    setGeneratedContent('');

    try {
      const { prompt, systemInstruction } = buildChildObservationPrompt({
        childName,
        ageGroup,
        domain,
        observationContext,
        rawBehaviorDescription,
        teacherFocus,
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
      onNotify('success', '幼儿观察记录与发展评估报告已生成！');
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
      title: `幼儿观察记录 - ${childName} (${ageGroup.split(' ')[0]})`,
      toolId: 'child-observation',
      category: `${ageGroup.split(' ')[0]}观察记录`,
      tags: ['幼儿观察', '学习故事', childName, ageGroup.split(' ')[0], domain.split(' ')[0]],
      content: generatedContent,
    });
    setIsSaved(true);
    onNotify('success', '已将观察记录存入【我的备课库】');
    if (onSavedChange) onSavedChange();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-700 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-xs text-xs font-medium text-pink-100 mb-2">
            <Eye className="w-3.5 h-3.5 text-pink-200" />
            <span>学习故事 (Learning Story) · 深度行为分析 · 支持策略提炼</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">幼儿观察记录与个案分析</h2>
          <p className="text-pink-100 text-sm mt-1 max-w-2xl">
            输入幼儿在区角游戏或一日生活中的行为白描，AI 自动对标《3-6岁儿童学习与发展指南》，生成包含“发生了什么、学习了什么、教师支持策略与家园共育”的专业个案报告。
          </p>
        </div>

        {/* Quick Samples */}
        <div className="flex flex-wrap items-center gap-1.5 md:max-w-md">
          <span className="text-xs text-pink-200 w-full mb-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-pink-300" /> 快速载入观察实录样例：
          </span>
          {sampleObservations.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleApplySample(s)}
              className="text-xs px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-md text-white transition-colors border border-white/10 truncate max-w-[140px]"
            >
              {s.title.split('《')[1]?.replace('》', '') || s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="w-4 h-4 text-pink-600" />
              <span>观察对象与场景信息</span>
            </h3>

            {/* Child Name & Age */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  幼儿姓名 / 化名 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="如：天天 / 朵朵"
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">年龄班级</label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                >
                  {KINDERGARTEN_AGE_GROUPS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Domain & Center Context */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">观察核心领域</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 px-2 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                >
                  {KINDERGARTEN_DOMAINS.map((d) => (
                    <option key={d} value={d}>{d.split(' ')[0]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">观察情境 / 区域</label>
                <select
                  value={observationContext}
                  onChange={(e) => setObservationContext(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 px-2 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                >
                  {KINDERGARTEN_CENTERS.map((c) => (
                    <option key={c} value={c}>{c.split(' ')[0]}</option>
                  ))}
                  <option value="一日生活环节 (进餐/午睡/盥洗)">生活环节 (进餐/自理)</option>
                  <option value="户外自主体能与安吉游戏">户外自主体能</option>
                  <option value="集体教学与同伴互动">集体教学/自由交谈</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                教师观察焦点与思考
              </label>
              <input
                type="text"
                value={teacherFocus}
                onChange={(e) => setTeacherFocus(e.target.value)}
                placeholder="例如：抗挫折坚持性、空间平衡感知、同伴冲突化解..."
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
              />
            </div>

            {/* Raw Behavior Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">
                  现场行为客观白描记录 <span className="text-rose-500">*</span>
                </label>
                <span className="text-2xs text-slate-400">字数: {rawBehaviorDescription.length}</span>
              </div>
              <textarea
                value={rawBehaviorDescription}
                onChange={(e) => setRawBehaviorDescription(e.target.value)}
                rows={7}
                placeholder="客观记录幼儿说了什么、做了什么、表情动作细节（避免'他很调皮'等主观标签词）..."
                className="w-full text-xs rounded-lg border border-slate-300 p-3 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 leading-relaxed"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>儿童发展专家正在对标《指南》深入剖析...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>一键生成专业观察分析报告</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Viewer */}
        <div className="lg:col-span-7">
          {generatedContent ? (
            <MarkdownViewer
              title={`【${childName}】幼儿观察与个案分析报告`}
              content={generatedContent}
              onSaveToLibrary={handleSave}
              isSaved={isSaved}
              onContentChange={(newContent) => setGeneratedContent(newContent)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-3">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-slate-800 text-base mb-1">观察分析报告就绪</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-4">
                在左侧输入或粘贴幼儿现场行为记录，AI 将自动提炼儿童关键经验、学习品质，并提供精准的后续环境材料支持与家园协同建议。
              </p>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-pink-50 text-pink-700 rounded-lg text-xs font-semibold hover:bg-pink-100 transition-colors"
              >
                生成【{childName}】的观察报告
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
