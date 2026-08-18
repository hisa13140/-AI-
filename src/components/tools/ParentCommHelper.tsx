import React, { useState } from 'react';
import { MessageSquareShare, Sparkles, Loader2, Wand2, ShieldAlert, HeartHandshake, Layers } from 'lucide-react';
import { requestAIGeneration, buildParentCommPrompt } from '../../services/aiService';
import { MarkdownViewer } from '../MarkdownViewer';
import { saveResource } from '../../utils/storage';

interface Props {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSavedChange?: () => void;
}

export function ParentCommHelper({ onNotify, onSavedChange }: Props) {
  const [scenario, setScenario] = useState('家长会发言稿 (期中/期末总结与家校协同)');
  const [targetStudent, setTargetStudent] = useState('');
  const [topicSummary, setTopicSummary] = useState('期中考试后家长会：如何正确看待分数，指导孩子建立良好作息与内驱力');
  const [tone, setTone] = useState('真诚共情、科学专业、建设性与携手共育');
  const [specialContext, setSpecialContext] = useState('');

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>(`# 期中家校共育家长会班主任发言稿

## 尊敬的各位家长朋友：
大家好！首先非常感谢各位在百忙之中抽出宝贵时间参加我们八年级（3）班的期中家长会。

---

## 一、 读懂期中：成绩是“体检单”，而非“判决书”
期中考试刚刚落下帷幕，有些家长可能看着成绩单欣喜，也有一些家长心里难免着急甚至焦虑。
在这里，我想和大家分享第一句话：**“初二的分数是用来发现问题的，而不是用来定义孩子的。”**
期中考试就像一次全面的学情“体检”。我们要看的不是单纯的名次，而是孩子在丢分背后暴露出的真实问题：
1. 是基础概念理解不够透彻？
2. 是审题习惯粗心大意？
3. 还是考试时间分配不合理？

---

## 二、 破解青春期“隐形焦虑”：家校协同三点建议

### 1. 关上批评的门，打开倾听的窗
初二的孩子正处于生理和心理的飞速发展期，自尊心极强。当孩子考得不理想时，他们内心其实比谁都失落。此时家长如果第一句话是“你怎么又考成这样”，孩子的大门就会瞬间关闭。
**高情商沟通公式**：“孩子，这次没考好你一定挺难过的。妈妈/爸爸看到你这段时间的努力了，我们一起来看看哪道题还可以抢救，好吗？”

### 2. 规律作息，帮孩子筑牢“手机防线”
很多孩子晚间作业拖延，根本原因是电子产品的干扰。建议家长：
- 晚上9点后，全家共同将手机统一放置在客厅充电。
- 营造安静专注的学习氛围，以身作则减少刷短视频。

### 3. 多肯定微小进步，用“具体表扬”点燃自驱力
多夸“过程与细节”（例如“你今天主动整理了错题本，非常有条理”），少夸“虚假天赋”。

---

## 三、 结语：教育是一场温暖的静候
教育不是流水线上的零件加工，而是一棵树摇动另一棵树，一朵云推动另一朵云。
作为班主任，我和所有的科任老师会一如既往地倾尽全力关注每一个孩子的成长。让我们家校携手，做孩子最温暖、最坚定的引路人！

谢谢大家！`);

  const [isSaved, setIsSaved] = useState(false);

  const scenarioPresets = [
    {
      name: '期中家长会发言稿',
      sc: '家长会发言稿 (期中/期末总结与家校协同)',
      ts: '期中考试后家长会：如何正确看待分数，指导孩子建立良好作息与内驱力',
      tone: '真诚共情、科学专业、建设性与携手共育',
      ctx: '重点化解家长的焦虑情绪，提出家庭作息与手机管理的具体落地建议。'
    },
    {
      name: '学生沉迷手机沟通锦囊',
      sc: '个别沟通锦囊 (学生沉迷手机/游戏与作息紊乱)',
      stu: '李同学',
      ts: '孩子最近上课频繁打瞌睡，作业拖延，家长反馈在家长时间玩手机引发严重亲子冲突',
      tone: '共情家长焦虑、先肯定孩子闪光点、提供不激发对抗的阶梯式管理方案',
      ctx: '家长脾气急躁容易摔手机，需要提供科学心理学技巧。'
    },
    {
      name: '成绩突降/厌学情绪沟通',
      sc: '个别沟通锦囊 (成绩突降/心理情绪波动)',
      stu: '王同学',
      ts: '近期理科成绩出现较大滑坡，课后独来独往，有消极厌学苗头',
      tone: '温和关切、探寻深层诱因、建立心理安全感',
      ctx: '需协同家长关注孩子人际关系与自我期望过高的问题。'
    },
    {
      name: '节假日安全与温馨提示通知',
      sc: '家校群通知 (安全提醒/节假日温馨提示)',
      ts: '国庆/寒暑假假期安全温馨提示（防溺水、交通安全、网络安全、规律作息）',
      tone: '亲切温馨、条理清晰、重点突出',
      ctx: '便于家长一目了然，包含家校联络方式。'
    },
  ];

  const handleApplyPreset = (p: typeof scenarioPresets[0]) => {
    setScenario(p.sc);
    setTargetStudent(p.stu || '');
    setTopicSummary(p.ts);
    setTone(p.tone);
    setSpecialContext(p.ctx || '');
    onNotify('info', `已载入沟通情境：【${p.name}】`);
  };

  const handleGenerate = async () => {
    if (!topicSummary.trim()) {
      onNotify('error', '请输入沟通核心主题或背景');
      return;
    }

    setLoading(true);
    setIsSaved(false);
    setGeneratedContent('');

    try {
      const { prompt, systemInstruction } = buildParentCommPrompt({
        scenario,
        targetStudent,
        topicSummary,
        tone,
        specialContext,
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
      onNotify('success', '家校沟通文案与心理话术已生成！');
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
      title: `${scenario.split(' ')[0]} - 家校沟通文案`,
      toolId: 'parent-comm',
      category: '家校共育',
      tags: ['家校沟通', scenario.split(' ')[0], targetStudent || '全班'],
      content: generatedContent,
    });
    setIsSaved(true);
    onNotify('success', '已将沟通锦囊存入【我的备课库】');
    if (onSavedChange) onSavedChange();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-700 to-red-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs text-xs font-medium text-rose-100 mb-2">
            <MessageSquareShare className="w-3.5 h-3.5 text-rose-300" />
            <span>高情商共情·化解对立·协同共育</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">家校沟通与班主任锦囊</h2>
          <p className="text-rose-100 text-sm mt-1 max-w-2xl">
            涵盖家长会发言稿、群发温馨通知，以及学生早恋、沉迷手机、成绩滑坡等敏感问题的高情商对话技巧与避坑指南。
          </p>
        </div>

        {/* Quick Scenario Chips */}
        <div className="flex flex-wrap items-center gap-1.5 md:max-w-md">
          <span className="text-xs text-rose-200 w-full mb-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" /> 快速载入常见沟通场景：
          </span>
          {scenarioPresets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="text-xs px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-md text-white transition-colors border border-white/10 truncate max-w-[140px]"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="w-4 h-4 text-rose-600" />
              <span>沟通情境与诉求要素</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">沟通场景类型</label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              >
                <option value="家长会发言稿 (期中/期末总结与家校协同)">家长会发言稿 (期中/期末总结)</option>
                <option value="家长会发言稿 (新学期开学/中高考动员)">家长会发言稿 (开学/升学动员)</option>
                <option value="个别沟通锦囊 (学生沉迷手机/游戏与作息紊乱)">个别沟通：沉迷手机/网络游戏</option>
                <option value="个别沟通锦囊 (成绩突降/心理情绪波动/厌学)">个别沟通：成绩突降/厌学情绪</option>
                <option value="个别沟通锦囊 (早恋倾向/青春期异性交往过密)">个别沟通：青春期异性交往过密</option>
                <option value="个别沟通锦囊 (同学矛盾冲突/违纪行为引导)">个别沟通：同学冲突/课堂纪律</option>
                <option value="家校群通知 (安全提醒/节假日温馨提示)">家校群通知：安全提醒与假期须知</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                涉及学生姓名 (群发或通用发言稿可不填)
              </label>
              <input
                type="text"
                value={targetStudent}
                onChange={(e) => setTargetStudent(e.target.value)}
                placeholder="如：张同学 或 全班家长"
                className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                核心沟通主题 / 事件背景 <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={topicSummary}
                onChange={(e) => setTopicSummary(e.target.value)}
                rows={3}
                placeholder="例如：孩子近期上课打瞌睡，作业频繁拖拉，需与家长商讨晚间手机使用规则..."
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">期望语气与基调</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              >
                <option value="真诚共情、科学专业、建设性与携手共育">真诚共情·赋能家长 (推荐)</option>
                <option value="温馨亲切、春风化雨、饱含教育温情">温馨亲切·春风化雨</option>
                <option value="客观坚定、明确底线规则、注重家校协同">明确底线·严爱相济</option>
                <option value="鼓舞人心、富有号召力与感染力">鼓舞人心·催人奋进</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                特殊背景与顾虑 (选填)
              </label>
              <input
                type="text"
                value={specialContext}
                onChange={(e) => setSpecialContext(e.target.value)}
                placeholder="例如：家长工作繁忙/平时多为祖辈照料..."
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>资深德育名师正在构思高情商文案...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>一键生成高情商沟通文案与话术</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Viewer */}
        <div className="lg:col-span-7">
          {generatedContent ? (
            <MarkdownViewer
              title={`家校沟通锦囊 - ${scenario.split(' ')[0]}`}
              content={generatedContent}
              onSaveToLibrary={handleSave}
              isSaved={isSaved}
              onContentChange={(newContent) => setGeneratedContent(newContent)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-slate-800 text-base mb-1">家校沟通锦囊就绪</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-4">
                选择场景与事件，AI 班主任将为您生成直接可用的发言文案、面谈备忘清单与高情商避坑指南。
              </p>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors"
              >
                立即生成沟通方案
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
