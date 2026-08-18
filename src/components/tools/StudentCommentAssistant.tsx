import React, { useState } from 'react';
import { Award, Sparkles, Loader2, Wand2, Users, UserCheck, Copy, Check, Plus, Trash2, Download, Layers } from 'lucide-react';
import { GRADES_LIST, STUDENT_ROSTER_SAMPLE } from '../../data/presets';
import { requestAIGeneration, buildStudentCommentPrompt } from '../../services/aiService';
import { MarkdownViewer } from '../MarkdownViewer';
import { saveResource } from '../../utils/storage';

interface Props {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSavedChange?: () => void;
}

export function StudentCommentAssistant({ onNotify, onSavedChange }: Props) {
  // Active Tab: 'single' (Individual Deep Comment) or 'batch' (Batch Whole Class Generation)
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');

  // Single Mode State
  const [name, setName] = useState('张子轩');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [grade, setGrade] = useState('初中八年级 (初二)');
  const [performanceLevel, setPerformanceLevel] = useState('综合优秀 (品学兼优)');
  const [selectedTraits, setSelectedTraits] = useState<string[]>(['思维敏捷', '班长/责任心强', '理科拔尖', '乐于助人']);
  const [strengths, setStrengths] = useState('上课发言积极有深度，班级管理有条不紊，组织协调能力突出。');
  const [improvements, setImprovements] = useState('偶有作业书写略显潦草，解题需进一步注重严密性与规范性。');
  const [tone, setTone] = useState('温暖励志与期望成长型');

  const [loadingSingle, setLoadingSingle] = useState(false);
  const [singleGeneratedContent, setSingleGeneratedContent] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);

  // Batch Mode State
  const [roster, setRoster] = useState(STUDENT_ROSTER_SAMPLE);
  const [batchGrade, setBatchGrade] = useState('初中八年级 (初二)');
  const [batchTone, setBatchTone] = useState('温暖而有力量的励志型');
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchResults, setBatchResults] = useState<{ name: string; comment: string; shortComment: string }[]>([]);
  const [batchCopiedIndex, setBatchCopiedIndex] = useState<number | null>(null);

  const traitPool = [
    '思维敏捷', '踏实沉静', '责任心强', '乐于助人', '班级干部', '体育健将',
    '艺术特长', '善于思考', '文笔细腻', '阳光开朗', '专注力高', '动手能力强',
    '自律自觉', '偶有分心', '需多鼓励', '书写工整', '发言积极', '勤奋刻苦'
  ];

  const toggleTrait = (t: string) => {
    if (selectedTraits.includes(t)) {
      setSelectedTraits(selectedTraits.filter(x => x !== t));
    } else {
      setSelectedTraits([...selectedTraits, t]);
    }
  };

  const handleApplySampleStudent = (s: typeof STUDENT_ROSTER_SAMPLE[0]) => {
    setName(s.name);
    setGender(s.gender);
    setPerformanceLevel(s.level === '优秀' ? '综合优秀 (品学兼优)' : s.level === '良好' ? '良好稳定 (稳中有进)' : '有较大潜能 (需持续鼓励)');
    setSelectedTraits(s.tags);
    setStrengths(`展现出${s.tags.slice(0, 2).join('、')}等良好特质，性格深受师生喜爱。`);
    setImprovements(s.note);
    onNotify('info', `已载入学生档案：【${s.name}】`);
  };

  const handleGenerateSingle = async () => {
    if (!name.trim()) {
      onNotify('error', '请输入学生姓名');
      return;
    }

    setLoadingSingle(true);
    setIsSaved(false);
    setSingleGeneratedContent('');

    try {
      const { prompt, systemInstruction } = buildStudentCommentPrompt({
        name,
        gender,
        grade,
        performanceLevel,
        traits: selectedTraits,
        strengths,
        improvements,
        tone,
      });

      const result = await requestAIGeneration({
        prompt,
        systemInstruction,
        temperature: 0.7,
        onChunk: (accumulated) => {
          setSingleGeneratedContent(accumulated);
        },
      });

      setSingleGeneratedContent(result);
      onNotify('success', `【${name}】的个性化评语已生成！`);
    } catch (err: any) {
      console.error(err);
      onNotify('error', err.message || '评语生成失败');
    } finally {
      setLoadingSingle(false);
    }
  };

  const handleSaveSingle = () => {
    if (!singleGeneratedContent) return;
    saveResource({
      title: `学生评语 - ${name} (${grade})`,
      toolId: 'student-comment',
      category: '学生评语',
      tags: [name, grade.split(' ')[0], '期末评语', performanceLevel.split(' ')[0]],
      content: singleGeneratedContent,
    });
    setIsSaved(true);
    onNotify('success', `已将【${name}】评语存入【我的备课库】`);
    if (onSavedChange) onSavedChange();
  };

  // Batch Generation Logic
  const handleGenerateBatch = async () => {
    if (roster.length === 0) {
      onNotify('error', '班级名单为空，请先添加学生');
      return;
    }

    setBatchLoading(true);
    setBatchResults([]);

    try {
      const studentBriefs = roster.map((s, idx) => 
        `${idx + 1}. 姓名：${s.name}，性别：${s.gender === 'male' ? '男' : '女'}，学业表现：${s.level}，特征标签：${s.tags.join('/')}，改进建议：${s.note}`
      ).join('\n');

      const prompt = `请为以下初中/小学班级 ${roster.length} 名学生，批量生成【期末学生评语库】：

年级：${batchGrade}
整体基调：${batchTone}
杜绝千人一面，要求每一位学生的评语都紧扣其个性特征与细节。

学生名单及特征：
${studentBriefs}

请以清晰的 Markdown 格式输出，每一位学生单独一个区块，包含：
### [学生姓名] (期末评语)
- **【完整报告册评语 (180-220字)】**：[包含优点点赞 + 独特品格 + 期望建议 + 励志寄语]
- **【精简短评 (60-80字)】**：[精悍有力，适合微信发送或小卡片]
---`;

      const result = await requestAIGeneration({
        prompt,
        systemInstruction: '你是一位资深名班主任，写出的评语温暖有光、观察敏锐、辞藻优美、句句走心。',
        temperature: 0.7,
      });

      // Parse output into results array
      const parsedList: { name: string; comment: string; shortComment: string }[] = [];
      const sections = result.split(/###?\s*/).filter(Boolean);

      for (const sec of sections) {
        const lines = sec.trim().split('\n');
        const studentName = lines[0].replace(/[\(\)（）期末评语\s]/g, '').trim();
        const fullCommentMatch = sec.match(/【完整报告册评语[\s\S]*?】[：:\s]*([\s\S]*?)(?=【精简短评|---|$)/);
        const shortCommentMatch = sec.match(/【精简短评[\s\S]*?】[：:\s]*([\s\S]*?)(?=---|###|$)/);

        if (studentName) {
          parsedList.push({
            name: studentName,
            comment: fullCommentMatch ? fullCommentMatch[1].trim() : sec.trim(),
            shortComment: shortCommentMatch ? shortCommentMatch[1].trim() : '踏实进取，未来可期。',
          });
        }
      }

      if (parsedList.length > 0) {
        setBatchResults(parsedList);
      } else {
        // Fallback fallback simple mapping
        setBatchResults(roster.map(r => ({
          name: r.name,
          comment: result,
          shortComment: '严于律己，笃学善思。',
        })));
      }

      onNotify('success', `已批量生成 ${roster.length} 名学生的专属评语！`);
    } catch (err: any) {
      console.error(err);
      onNotify('error', err.message || '批量生成失败');
    } finally {
      setBatchLoading(false);
    }
  };

  const handleCopyBatchComment = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setBatchCopiedIndex(index);
    onNotify('success', '评语已复制到剪贴板！');
    setTimeout(() => setBatchCopiedIndex(null), 2000);
  };

  const handleExportBatchCSV = () => {
    if (batchResults.length === 0) return;
    let csv = '序号,学生姓名,期末完整评语,精简短评\n';
    batchResults.forEach((r, idx) => {
      csv += `"${idx + 1}","${r.name}","${r.comment.replace(/"/g, '""')}","${r.shortComment.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `班级期末评语汇总表_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify('success', '评语表格 (.csv) 导出成功！');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-pink-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs text-xs font-medium text-purple-100 mb-2">
            <Award className="w-3.5 h-3.5 text-pink-300" />
            <span>走心不套路·闪光点提炼·支持全班批量</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">个性化学生评语与成长档案</h2>
          <p className="text-purple-100 text-sm mt-1 max-w-2xl">
            告别千篇一律的教条模板，基于学生闪光点、性格特征与成长期待，生成温暖有力量的素质报告册评语。
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 bg-white/15 backdrop-blur-md rounded-xl border border-white/20">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'single' ? 'bg-white text-purple-900 shadow-xs' : 'text-purple-100 hover:bg-white/10'
            }`}
          >
            单人深度定制
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'batch' ? 'bg-white text-purple-900 shadow-xs' : 'text-purple-100 hover:bg-white/10'
            }`}
          >
            全班一键批量生成
          </button>
        </div>
      </div>

      {activeTab === 'single' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>学生档案与性格画像</span>
                </h3>
                <span className="text-xs text-slate-400">快速载入样例:</span>
              </div>

              {/* Quick student chips */}
              <div className="flex flex-wrap gap-1.5 pb-2">
                {STUDENT_ROSTER_SAMPLE.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplySampleStudent(s)}
                    className="text-xs px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md border border-purple-200 transition-colors"
                  >
                    {s.name} ({s.level})
                  </button>
                ))}
              </div>

              {/* Name & Gender */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    学生姓名 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="如：张子轩"
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">性别</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  >
                    <option value="male">男生</option>
                    <option value="female">女生</option>
                  </select>
                </div>
              </div>

              {/* Grade & Level */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">年级</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  >
                    {GRADES_LIST.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">总体表现梯度</label>
                  <select
                    value={performanceLevel}
                    onChange={(e) => setPerformanceLevel(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  >
                    <option value="综合优秀 (品学兼优·领头羊)">综合优秀 (品学兼优)</option>
                    <option value="良好稳定 (稳中有进·踏实认真)">良好稳定 (踏实认真)</option>
                    <option value="个性特长鲜明 (文体突出·思维活跃)">个性特长突出 (文体活跃)</option>
                    <option value="有较大潜能 (偶有分心·需持续激励)">有较大潜能 (需持续激励)</option>
                    <option value="偏科待提升 (某一学科需突破)">偏科待突破 (需个别指引)</option>
                  </select>
                </div>
              </div>

              {/* Traits tag selector */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  性格与表现标签 (可多选)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 border border-slate-200 rounded-lg bg-slate-50/50">
                  {traitPool.map((t) => {
                    const isSelected = selectedTraits.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTrait(t)}
                        className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                          isSelected
                            ? 'bg-purple-600 text-white font-medium shadow-2xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  闪光点与具体表现细节
                </label>
                <textarea
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  rows={2}
                  placeholder="如：担任班长尽职尽责，运动会上为班级争光..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  改进期望与成长突破点
                </label>
                <textarea
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  rows={2}
                  placeholder="如：书写需更加规范工整，课堂发言不妨更自信..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">评语语言风格</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                >
                  <option value="温暖励志与期望成长型">温暖励志·充满期待 (推荐)</option>
                  <option value="儒雅诗意与文采斐然型">儒雅诗意·金句迭出</option>
                  <option value="幽默风趣与朋友式亲近型">风趣幽默·拉近距离</option>
                  <option value="客观严谨与指引明确型">客观严谨·直击要害</option>
                </select>
              </div>

              <button
                onClick={handleGenerateSingle}
                disabled={loadingSingle}
                className="w-full py-2.5 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loadingSingle ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>特级班主任正在用心撰写评语...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>一键生成多版本走心评语</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Viewer */}
          <div className="lg:col-span-7">
            {singleGeneratedContent ? (
              <MarkdownViewer
                title={`【${name}】期末素质报告册评语`}
                content={singleGeneratedContent}
                onSaveToLibrary={handleSaveSingle}
                isSaved={isSaved}
                onContentChange={(newContent) => setSingleGeneratedContent(newContent)}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-slate-800 text-base mb-1">评语生成器就绪</h3>
                <p className="text-sm text-slate-500 max-w-sm mb-4">
                  选择学生标签与闪光点，AI 班主任将为您生成标准期末报告册评语、精练短评与家校沟通金句。
                </p>
                <button
                  onClick={handleGenerateSingle}
                  className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors"
                >
                  为【{name}】生成评语
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Batch Whole Class Mode */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>全班学生名单管理 ({roster.length} 人)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  输入或调整学生名单与特征，AI 将为全班同学批量生成互不重样的个性化期末评语。
                </p>
              </div>

              <div className="flex items-center gap-2">
                {batchResults.length > 0 && (
                  <button
                    onClick={handleExportBatchCSV}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>导出全班评语 Excel/CSV</span>
                  </button>
                )}

                <button
                  onClick={handleGenerateBatch}
                  disabled={batchLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition-colors shadow-2xs disabled:opacity-50"
                >
                  {batchLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>正在批量生成全班评语...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>一键批量生成全班评语</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Roster Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">序号</th>
                    <th className="p-3">姓名</th>
                    <th className="p-3">性别</th>
                    <th className="p-3">学业水平</th>
                    <th className="p-3">特质标签</th>
                    <th className="p-3">成长建议点</th>
                    <th className="p-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {roster.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-semibold text-slate-900">{s.name}</td>
                      <td className="p-3">{s.gender === 'male' ? '男' : '女'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          s.level === '优秀' ? 'bg-emerald-50 text-emerald-700 font-medium' :
                          s.level === '良好' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {s.level}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {s.tags.map((t, ti) => (
                            <span key={ti} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-2xs">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-slate-500 max-w-[200px] truncate">{s.note}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setRoster(roster.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="移除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Batch Generated Results Cards */}
          {batchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center justify-between">
                <span>生成结果预览 (共 {batchResults.length} 篇)</span>
                <span className="text-xs text-slate-500">点击卡片右上角可一键复制</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {batchResults.map((res, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 relative group">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{res.name}</span>
                      </div>
                      <button
                        onClick={() => handleCopyBatchComment(res.comment, idx)}
                        className="text-xs px-2.5 py-1 rounded bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 transition-colors flex items-center gap-1"
                      >
                        {batchCopiedIndex === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                        <span>{batchCopiedIndex === idx ? '已复制' : '复制评语'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {res.comment}
                    </p>

                    {res.shortComment && (
                      <div className="p-2 bg-purple-50/60 rounded-lg text-2xs text-purple-900 border border-purple-100">
                        <strong>寄语短评：</strong> {res.shortComment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
