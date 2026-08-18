import React, { useState } from 'react';
import { HelpCircle, Sparkles, Loader2, Wand2, FileText, CheckCircle2, XCircle, Printer, Eye, Layers } from 'lucide-react';
import { SAMPLE_SAVED_RESOURCES } from '../../data/presets';
import { requestAIGeneration, buildQuizPrompt } from '../../services/aiService';
import { MarkdownViewer } from '../MarkdownViewer';
import { saveResource } from '../../utils/storage';
import { parseQuizMarkdown } from '../../utils/parser';
import { CurriculumPicker, CurriculumSelection } from '../CurriculumPicker';

interface Props {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSavedChange?: () => void;
}

export function QuizGenerator({ onNotify, onSavedChange }: Props) {
  const [stage, setStage] = useState('junior');
  const [subject, setSubject] = useState('数学');
  const [grade, setGrade] = useState('初中九年级 (初三)');
  const [unit, setUnit] = useState('第二十一章：一元二次方程');
  const [topic, setTopic] = useState('一元二次方程根与系数的关系 (韦达定理)');
  const [difficulty, setDifficulty] = useState('中等标准巩固 (基础60% + 综合30% + 拔高10%)');
  const [count, setCount] = useState(6);
  const [includeExplanations, setIncludeExplanations] = useState(true);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleCurriculumChange = (sel: CurriculumSelection) => {
    setStage(sel.stage);
    setGrade(sel.grade);
    setSubject(sel.subject);
    setUnit(sel.unit);
    setTopic(sel.topic);
  };

  // Selected Question Types
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    '单选题', '填空题', '解答与综合探究题'
  ]);

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>(SAMPLE_SAVED_RESOURCES[1]?.content || '');
  const [isSaved, setIsSaved] = useState(false);

  // View Mode: 'full' (Markdown + Answers), 'student' (Clean Paper without answers), 'interactive' (Test taking practice)
  const [viewMode, setViewMode] = useState<'full' | 'student' | 'interactive'>('full');

  // Interactive Quiz State
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showInteractiveResults, setShowInteractiveResults] = useState(false);

  const parsedQuiz = parseQuizMarkdown(generatedContent);

  const questionTypeOptions = ['单选题', '多选题', '填空题', '判断题', '简答计算题', '解答与综合探究题'];

  const toggleType = (t: string) => {
    if (selectedTypes.includes(t)) {
      if (selectedTypes.length === 1) {
        onNotify('info', '至少保留一种题型');
        return;
      }
      setSelectedTypes(selectedTypes.filter(x => x !== t));
    } else {
      setSelectedTypes([...selectedTypes, t]);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      onNotify('error', '请输入考察知识点或试卷主题');
      return;
    }

    setLoading(true);
    setIsSaved(false);
    setGeneratedContent('');
    setUserAnswers({});
    setShowInteractiveResults(false);

    try {
      const { prompt, systemInstruction } = buildQuizPrompt({
        subject,
        grade,
        topic,
        difficulty,
        types: selectedTypes,
        count,
        includeExplanations,
        specialInstructions,
      });

      const result = await requestAIGeneration({
        prompt,
        systemInstruction,
        temperature: 0.6,
        onChunk: (accumulated) => {
          setGeneratedContent(accumulated);
        },
      });

      setGeneratedContent(result);
      onNotify('success', '考题与试卷已成功命制生成！');
    } catch (err: any) {
      console.error(err);
      onNotify('error', err.message || '命题失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedContent) return;
    saveResource({
      title: `《${topic}》${grade}${subject}练习测验卷`,
      toolId: 'quiz-gen',
      category: `${grade.split(' ')[0]}${subject}`,
      tags: [subject, grade.split(' ')[0], '试卷测验', difficulty.split(' ')[0]],
      content: generatedContent,
    });
    setIsSaved(true);
    onNotify('success', '已将试卷及解析保存至【我的备课库】');
    if (onSavedChange) onSavedChange();
  };

  // Generate clean student version (strip answer and explanations)
  const getStudentVersionText = () => {
    return generatedContent
      .replace(/【?答案】?[：:\s]*[^\n]+/gi, '')
      .replace(/【?解析】?[：:\s]*([\s\S]*?)(?=(?:【?考点】?|【?易错】?|\n\d+[\.、]|$|#))/gi, '')
      .replace(/【?考点梳理】?[：:\s]*[^\n]+/gi, '')
      .replace(/【?易错警示】?[：:\s]*[^\n]+/gi, '');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs text-xs font-medium text-emerald-100 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-300" />
            <span>智能命题·分层检测·解析直出</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">智能考题与试卷工坊</h2>
          <p className="text-emerald-100 text-sm mt-1 max-w-2xl">
            自定义题型配比、难度梯度与分值，一键生成符合课标命题规范的标准试卷、参考答案与易错点深度解析。
          </p>
        </div>

        {/* View mode switcher */}
        {generatedContent && (
          <div className="flex items-center gap-1.5 p-1 bg-white/15 backdrop-blur-md rounded-xl border border-white/20">
            <button
              onClick={() => setViewMode('full')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'full' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              教师备课版 (含解析)
            </button>
            <button
              onClick={() => setViewMode('student')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'student' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              学生测验版 (纯试卷)
            </button>
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'interactive' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              互动演练模式
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>配置命题范围与课程大纲</span>
              </div>
              <span className="text-2xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                新课标命题库
              </span>
            </h3>

            {/* Cascading Curriculum Picker */}
            <CurriculumPicker
              initialStage="junior"
              initialGrade={grade}
              initialSubject={subject}
              initialUnit={unit}
              initialTopic={topic}
              accentColor="emerald"
              onSelectionChange={handleCurriculumChange}
            />

            {/* Difficulty Level */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">试卷难度梯度</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="基础达标 (70%基础 + 20%中档 + 10%拓展)">基础达标 (70%基础 + 20%中档 + 10%拓展)</option>
                <option value="中等标准巩固 (基础60% + 综合30% + 拔高10%)">中等标准巩固 (基础60% + 综合30% + 拔高10%)</option>
                <option value="期末/中高考模拟高区分度 (40%基础 + 40%中档 + 20%压轴)">期末/模拟高区分度 (40%基础 + 40%中档 + 20%压轴)</option>
                <option value="培优拔尖竞赛级 (高难度探究与压轴题)">培优拔尖竞赛级 (高难度探究与压轴题)</option>
              </select>
            </div>

            {/* Question Types Checkbox */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">题型组合配置 (多选)</label>
              <div className="grid grid-cols-3 gap-2">
                {questionTypeOptions.map((t) => {
                  const isChecked = selectedTypes.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleType(t)}
                      className={`text-xs px-2 py-2 rounded-lg border transition-all text-center truncate ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Count & Explanations */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  题目总数: <span className="font-semibold text-emerald-700">{count} 题</span>
                </label>
                <input
                  type="range"
                  min={3}
                  max={15}
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="pt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeExplanations}
                    onChange={(e) => setIncludeExplanations(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="text-xs font-medium text-slate-700">生成分步详细解析</span>
                </label>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                命题特别要求 (选填)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={2}
                placeholder="例如：第1题结合当下航天热点情境；第3题需包含一题多解法..."
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI 命题组正在研判考点并命制试卷...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>一键生成试题与标准解析</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Viewer */}
        <div className="lg:col-span-7">
          {viewMode === 'full' && (
            <MarkdownViewer
              title={`《${topic}》${grade}${subject}练习测验卷 (教师备课版)`}
              content={generatedContent}
              onSaveToLibrary={handleSave}
              isSaved={isSaved}
              onContentChange={(newContent) => setGeneratedContent(newContent)}
            />
          )}

          {viewMode === 'student' && (
            <MarkdownViewer
              title={`《${topic}》${grade}${subject}学生随堂考卷`}
              content={getStudentVersionText()}
              onSaveToLibrary={handleSave}
              isSaved={isSaved}
              onContentChange={(newContent) => setGeneratedContent(newContent)}
            />
          )}

          {viewMode === 'interactive' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">{parsedQuiz.title || '试卷演练与自测'}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">在线模拟答题，即时检测对错与考点掌握情况</p>
                </div>
                <button
                  onClick={() => setShowInteractiveResults(!showInteractiveResults)}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-2xs"
                >
                  {showInteractiveResults ? '隐藏解析与答案' : '提交核对答案与解析'}
                </button>
              </div>

              {parsedQuiz.questions.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  请切换回【教师备课版】查看完整试卷排版。
                </div>
              ) : (
                <div className="space-y-6">
                  {parsedQuiz.questions.map((q, idx) => {
                    const isAnswered = !!userAnswers[q.id];
                    return (
                      <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                        <div className="flex items-start gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="text-sm font-medium text-slate-800 leading-relaxed">
                            {q.question}
                          </div>
                        </div>

                        {/* Options if available */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                            {q.options.map((opt, oIdx) => {
                              const optLetter = opt.charAt(0);
                              const isSelected = userAnswers[q.id] === optLetter;
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => setUserAnswers({ ...userAnswers, [q.id]: optLetter })}
                                  className={`text-left p-2.5 rounded-lg text-xs md:text-sm border transition-all flex items-center gap-2 ${
                                    isSelected
                                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-medium'
                                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {optLetter}
                                  </span>
                                  <span>{opt.substring(2).trim()}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* If text/qa question */}
                        {(!q.options || q.options.length === 0) && (
                          <div className="pl-8">
                            <textarea
                              value={userAnswers[q.id] || ''}
                              onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                              placeholder="在此键入作答思路或核心答案..."
                              rows={2}
                              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                            />
                          </div>
                        )}

                        {/* Show Result Details */}
                        {showInteractiveResults && (
                          <div className="ml-8 mt-3 p-3 bg-emerald-50/80 rounded-lg border border-emerald-200 text-xs space-y-1.5 animate-in fade-in">
                            <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>参考标准答案：{q.answer || '详见解析'}</span>
                            </div>
                            <div className="text-slate-700 leading-relaxed">
                              <strong>考点与深度解析：</strong> {q.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
