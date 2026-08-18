import React, { useState } from 'react';
import { BookOpen, Sparkles, Loader2, RefreshCw, BookmarkPlus, Layers, Wand2 } from 'lucide-react';
import { SAMPLE_SAVED_RESOURCES } from '../../data/presets';
import { requestAIGeneration, buildLessonPlanPrompt } from '../../services/aiService';
import { MarkdownViewer } from '../MarkdownViewer';
import { saveResource } from '../../utils/storage';
import { CurriculumPicker, CurriculumSelection } from '../CurriculumPicker';

interface Props {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSavedChange?: () => void;
}

export function LessonPlanStudio({ onNotify, onSavedChange }: Props) {
  const [stage, setStage] = useState('junior');
  const [subject, setSubject] = useState('语文');
  const [grade, setGrade] = useState('初中八年级 (初二)');
  const [unit, setUnit] = useState('第四单元：散文天地与情感哲思');
  const [topic, setTopic] = useState('《背影》（朱自清）');
  const [duration, setDuration] = useState('1课时 (45分钟)');
  const [pedagogicalStyle, setPedagogicalStyle] = useState('启发探究式与情境建构法');
  const [competencyFocus, setCompetencyFocus] = useState('动词细节品读、托物言志、深沉父爱与平淡见真味');
  const [customRequirements, setCustomRequirements] = useState('');

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>(SAMPLE_SAVED_RESOURCES[0]?.content || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleCurriculumChange = (sel: CurriculumSelection) => {
    setStage(sel.stage);
    setGrade(sel.grade);
    setSubject(sel.subject);
    setUnit(sel.unit);
    setTopic(sel.topic);
    if (sel.competencyFocus) {
      setCompetencyFocus(sel.competencyFocus);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      onNotify('error', '请选择或输入课题名称');
      return;
    }

    setLoading(true);
    setIsSaved(false);
    setGeneratedContent('');

    try {
      const { prompt, systemInstruction } = buildLessonPlanPrompt({
        subject,
        grade,
        topic: `${unit ? unit + ' - ' : ''}${topic}`,
        duration,
        pedagogicalStyle,
        competencyFocus,
        customRequirements,
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
      onNotify('success', '特级教师详案生成完毕！');
    } catch (err: any) {
      console.error(err);
      onNotify('error', err.message || '生成失败，请检查网络或配置');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedContent) return;
    saveResource({
      title: `${topic} - ${grade}${subject}教学设计`,
      toolId: 'lesson-plan',
      category: `${grade.split(' ')[0]}${subject}`,
      tags: [subject, grade.split(' ')[0], '教学设计', '详案', unit],
      content: generatedContent,
    });
    setIsSaved(true);
    onNotify('success', '已将教案保存到【我的备课库】');
    if (onSavedChange) onSavedChange();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs text-xs font-medium text-blue-100 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-blue-300" />
            <span>全国主流教材新课标智能联动</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">智能教案与教学设计工坊</h2>
          <p className="text-blue-100 text-sm mt-1 max-w-2xl">
            涵盖幼儿园五大领域、小学、初中、高中全学段教材大纲。切换学段即可下拉选择标准单元主题与经典课文课题。
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl text-xs backdrop-blur-xs border border-white/10 text-blue-100">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>当前选定：<strong>{grade} · {subject} · {topic}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>课程大纲与课题智能联动选择</span>
              </div>
              <span className="text-2xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-medium">
                新课标大纲题库
              </span>
            </h3>

            {/* Cascading Curriculum Picker */}
            <CurriculumPicker
              initialStage="junior"
              initialGrade={grade}
              initialSubject={subject}
              initialUnit={unit}
              initialTopic={topic}
              accentColor="indigo"
              onSelectionChange={handleCurriculumChange}
            />

            {/* Duration & Style */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">课时安排</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  <option value="1课时 (40分钟)">1课时 (40分钟-小学)</option>
                  <option value="1课时 (45分钟)">1课时 (45分钟-中学)</option>
                  <option value="2课时 (90分钟)">2课时 (90分钟连堂)</option>
                  <option value="大单元整体设计 (3-5课时)">大单元规划 (3-5课时)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">教学教法策略</label>
                <select
                  value={pedagogicalStyle}
                  onChange={(e) => setPedagogicalStyle(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  <option value="启发探究式与情境建构法">启发探究式 (情境设问)</option>
                  <option value="大概念大任务驱动教学法">大概念任务驱动 (项目式)</option>
                  <option value="小组合作研讨与互动探究">合作研讨式 (生生互动)</option>
                  <option value="翻转课堂与分层进阶精讲">翻转课堂与精练点拨</option>
                  <option value="实验操作与STEM探究法">实验操作与STEM探究</option>
                </select>
              </div>
            </div>

            {/* Competency Focus */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                核心素养侧重 / 教学重点预设
              </label>
              <input
                type="text"
                value={competencyFocus}
                onChange={(e) => setCompetencyFocus(e.target.value)}
                placeholder="例如：空间想象观念、高阶思维、逻辑严密性"
                className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                教师特殊个性化要求 (选填)
              </label>
              <textarea
                value={customRequirements}
                onChange={(e) => setCustomRequirements(e.target.value)}
                rows={2}
                placeholder="例如：需包含一个5分钟的随堂辩论环节；增加信息化白板希沃互动..."
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI 正在研读课标并构思详案...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>一键生成特级教师标准详案</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Viewer: Generated Lesson Plan */}
        <div className="lg:col-span-7">
          {generatedContent ? (
            <MarkdownViewer
              title={`《${topic}》${grade}${subject}教学设计详案`}
              content={generatedContent}
              onSaveToLibrary={handleSave}
              isSaved={isSaved}
              onContentChange={(newContent) => setGeneratedContent(newContent)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-slate-800 text-base mb-1">教学设计就绪</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-4">
                在左侧选择学段、学科，下拉选择单元与课题，AI 将为您生成符合新课标要求的名师示范教案。
              </p>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
              >
                立即开始备课
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
