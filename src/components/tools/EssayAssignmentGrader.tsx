import React, { useState } from 'react';
import { FileCheck2, Sparkles, Loader2, Wand2, BookCheck, ThumbsUp, AlertTriangle, Layers } from 'lucide-react';
import { GRADES_LIST } from '../../data/presets';
import { requestAIGeneration, buildEssayGradePrompt } from '../../services/aiService';
import { MarkdownViewer } from '../MarkdownViewer';
import { saveResource } from '../../utils/storage';

interface Props {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSavedChange?: () => void;
}

export function EssayAssignmentGrader({ onNotify, onSavedChange }: Props) {
  const [essayType, setEssayType] = useState('初中记叙文 (满分60分制)');
  const [gradeLevel, setGradeLevel] = useState('初中八年级 (初二)');
  const [topicTitle, setTopicTitle] = useState('《那一刻，我长大了》');
  const [rubricFocus, setRubricFocus] = useState('细节描写、真情实感、立意深度与语言文采');

  const [studentContent, setStudentContent] = useState(`记得那是初秋的一个傍晚，放学时天空突然下起了倾盆大雨。我没有带伞，站在校门口的屋檐下焦急地张望。
同学们一个个都被家长接走了，只剩下我一个人在瑟瑟发抖。天渐渐黑了，雨越下越大。
就在我快要哭出来的时候，远处出现了一个熟悉的身影。是妈妈！她骑着那辆旧自行车，身上穿着单薄的雨衣，一路艰难地逆着风雨赶来。
到了校门口，妈妈停下车，喘着粗气，连忙把手里那把干燥的大伞递给我，还不停地说：“对不起孩子，妈妈下班路上车链子掉了，来晚了，你冻坏了吧？”
我看着妈妈被雨水打湿的头发，还有湿透了的大半边衣服，那一刻，我心里酸酸的，突然意识到妈妈不再年轻了，她一直在为我默默遮风挡雨。
我接过伞，主动撑在妈妈头顶，说：“妈妈，我不冷，我们一起回家。”
那一刻，我觉得自己不再是一个只知道索取的小孩，我长大了。`);

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);

  const sampleEssays = [
    {
      title: '《那一刻，我长大了》 (初中记叙文)',
      type: '初中记叙文 (满分60分制)',
      grade: '初中八年级 (初二)',
      topic: '《那一刻，我长大了》',
      rubric: '细节刻画、真情实感、立意深度与动词运用',
      content: `记得那是初秋的一个傍晚，放学时天空突然下起了倾盆大雨。我没有带伞，站在校门口的屋檐下焦急地张望。
同学们一个个都被家长接走了，只剩下我一个人在瑟瑟发抖。天渐渐黑了，雨越下越大。
就在我快要哭出来的时候，远处出现了一个熟悉的身影。是妈妈！她骑着那辆旧自行车，身上穿着单薄的雨衣，一路艰难地逆着风雨赶来。
到了校门口，妈妈停下车，喘着粗气，连忙把手里那把干燥的大伞递给我，还不停地说：“对不起孩子，妈妈下班路上车链子掉了，来晚了，你冻坏了吧？”
我看着妈妈被雨水打湿的头发，还有湿透了的大半边衣服，那一刻，我心里酸酸的，突然意识到妈妈不再年轻了，她一直在为我默默遮风挡雨。
我接过伞，主动撑在妈妈头顶，说：“妈妈，我不冷，我们一起回家。”
那一刻，我觉得自己不再是一个只知道索取的小孩，我长大了。`
    },
    {
      title: '高中议论文《科技向善与人文之光》',
      type: '高中议论文 (满分60分高考标准)',
      grade: '高中二年级 (高二)',
      topic: '《科技向善与人文之光》',
      rubric: '论点明确性、论据充实度、逻辑思辨性与论证结构',
      content: `在人工智能与算法浪潮席卷全球的当下，科技正以不可逆转之势重塑人类社会的各个维度。然而，当算法精准预测人类喜好、甚至代替人类思考时，我们必须叩问：技术的终极彼岸究竟通向何方？
不可否认，科技极大拓展了人类认知的边界。从深海探索到太空探测，科技赋予了人类改造世界的强大工具。但若缺乏人文理性的指引，科技亦可能沦为异化人类的冰冷利刃。例如信息茧房让思想日趋极化，大数据杀熟侵蚀人际信任。
因此，真正的科技繁荣必然需要人文之光的烛照。爱因斯坦曾言：“科学是一种强有力的工具，怎样用它，究竟是给人带来幸福还是带来灾难，全取决于人自己。”
青年一代应当在拥抱技术创新的同时，筑牢人文精神的压舱石，让科技始终流淌向善的温度。`
    },
    {
      title: 'English Writing: "My Favorite Traditional Festival"',
      type: '初高中英语作文 (满分25分标准)',
      grade: '初中九年级 (初三)',
      topic: 'My Favorite Traditional Festival',
      rubric: 'Grammar accuracy, vocabulary richness, coherence, and cultural expression',
      content: `Among all the traditional Chinese festivals, the Mid-Autumn Festival is my favorite. It usually falls on the 15th day of the eighth lunar month.
On this special day, all my family members get together to have a big dinner. We eat delicious mooncakes, which are round and symbolize completeness and reunion. At night, we sit in the yard, enjoying the bright full moon and sharing interesting stories.
I love this festival not only because of the delicious food, but also because it brings family love and harmony. It makes me feel warm and proud of our traditional culture.`
    }
  ];

  const handleApplySample = (sample: typeof sampleEssays[0]) => {
    setTopicTitle(sample.topic);
    setEssayType(sample.type);
    setGradeLevel(sample.grade);
    setRubricFocus(sample.rubric);
    setStudentContent(sample.content);
    onNotify('info', `已载入范文：《${sample.title}》`);
  };

  const handleGrade = async () => {
    if (!studentContent.trim()) {
      onNotify('error', '请输入或粘贴需要批改的学生作业/作文');
      return;
    }

    setLoading(true);
    setIsSaved(false);
    setGeneratedContent('');

    try {
      const { prompt, systemInstruction } = buildEssayGradePrompt({
        essayType,
        gradeLevel,
        topicTitle,
        content: studentContent,
        rubricFocus,
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
      onNotify('success', '作业作文智能精批报告已生成！');
    } catch (err: any) {
      console.error(err);
      onNotify('error', err.message || '批阅失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedContent) return;
    saveResource({
      title: `${topicTitle} - 智能批阅报告`,
      toolId: 'essay-grade',
      category: '作业批改',
      tags: ['作文批改', essayType.split(' ')[0], gradeLevel.split(' ')[0]],
      content: generatedContent,
    });
    setIsSaved(true);
    onNotify('success', '已将批改报告存入【我的备课库】');
    if (onSavedChange) onSavedChange();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-700 to-orange-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs text-xs font-medium text-amber-100 mb-2">
            <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
            <span>中高考阅卷标准·逐句润色·升格示范</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">作文与作业智能精批工坊</h2>
          <p className="text-amber-100 text-sm mt-1 max-w-2xl">
            提供综合评分、亮点点赞、扣分诊断、逐句润色批注与满分升格示范，帮助学生精准提升表达与思辨能力。
          </p>
        </div>

        {/* Quick Sample Essay Chips */}
        <div className="flex flex-wrap items-center gap-1.5 md:max-w-md">
          <span className="text-xs text-amber-200 w-full mb-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" /> 快速载入待批改范文样例：
          </span>
          {sampleEssays.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleApplySample(s)}
              className="text-xs px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-md text-white transition-colors border border-white/10 truncate max-w-[140px]"
              title={s.title}
            >
              {s.topic.replace(/《|》/g, '')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>作文信息与待批改文本</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">学段</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                >
                  {GRADES_LIST.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">作业/作文类别</label>
                <select
                  value={essayType}
                  onChange={(e) => setEssayType(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                >
                  <option value="小学写人记事记叙文 (100分制)">小学写人记事 (100分制)</option>
                  <option value="初中记叙文 (满分60分制)">初中记叙文 (60分中考制)</option>
                  <option value="高中议论文 (满分60分高考标准)">高中议论文 (60分高考制)</option>
                  <option value="初高中英语作文 (满分25分标准)">初高中英语作文 (25分标准)</option>
                  <option value="文科综合材料简答分析">文科主观简答分析</option>
                  <option value="理科大题解题步骤诊断">理科解题步骤逻辑诊断</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                作文题目 / 要求
              </label>
              <input
                type="text"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                placeholder="例如：《那一刻，我长大了》"
                className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                评分侧重标准
              </label>
              <input
                type="text"
                value={rubricFocus}
                onChange={(e) => setRubricFocus(e.target.value)}
                placeholder="例如：结构严密、修辞丰富、立意深刻、论据充分"
                className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">
                  学生提交内容 / 习作原文 <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-slate-400">字数: {studentContent.length}</span>
              </div>
              <textarea
                value={studentContent}
                onChange={(e) => setStudentContent(e.target.value)}
                rows={8}
                placeholder="在此粘贴学生作文、随笔或解答过程..."
                className="w-full text-xs rounded-lg border border-slate-300 p-3 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 leading-relaxed font-sans"
              />
            </div>

            <button
              onClick={handleGrade}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>特级教师阅卷组正在逐句深度批阅...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>一键生成多维度批阅与升格建议</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Viewer: Graded Report */}
        <div className="lg:col-span-7">
          {generatedContent ? (
            <MarkdownViewer
              title={`《${topicTitle}》智能精批报告`}
              content={generatedContent}
              onSaveToLibrary={handleSave}
              isSaved={isSaved}
              onContentChange={(newContent) => setGeneratedContent(newContent)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <BookCheck className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-slate-800 text-base mb-1">等待批改</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-4">
                在左侧粘贴学生作文或点击上方快捷范文，AI 将提供分数判定、闪光点点赞、逐句修改与升格段落。
              </p>
              <button
                onClick={handleGrade}
                className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors"
              >
                立即开始批阅
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
