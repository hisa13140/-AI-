import React, { useState, useEffect } from 'react';
import { Presentation, Sparkles, Loader2, Wand2, Play, Maximize2, ChevronLeft, ChevronRight, X, Copy, Check, Layers } from 'lucide-react';
import { requestAIGeneration, buildPptOutlinePrompt } from '../../services/aiService';
import { MarkdownViewer } from '../MarkdownViewer';
import { saveResource } from '../../utils/storage';
import { parseSlideMarkdown } from '../../utils/parser';
import { SlideItem } from '../../types';
import { CurriculumPicker, CurriculumSelection } from '../CurriculumPicker';

interface Props {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSavedChange?: () => void;
}

export function PptOutlineBuilder({ onNotify, onSavedChange }: Props) {
  const [stage, setStage] = useState('junior');
  const [subject, setSubject] = useState('物理');
  const [grade, setGrade] = useState('初中八年级 (初二)');
  const [unit, setUnit] = useState('第七章：力与运动 (力学核心)');
  const [topic, setTopic] = useState('《牛顿第一定律与惯性现象》');
  const [slideCount, setSlideCount] = useState(8);
  const [style, setStyle] = useState('启发探究式·图文互动·生动实验演示');
  const [specialRequests, setSpecialRequests] = useState('');

  const handleCurriculumChange = (sel: CurriculumSelection) => {
    setStage(sel.stage);
    setGrade(sel.grade);
    setSubject(sel.subject);
    setUnit(sel.unit);
    setTopic(sel.topic);
  };

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>(`### Slide 1: 《牛顿第一定律与惯性现象》
- **页面类型**：封面
- **画面核心视觉/板式建议**：深蓝极简科技感背景，左侧为伽利略与牛顿画像素描，右侧为航天员在空间站漂浮的微重力实拍图
- **课件展示核心要点**：
  * 人教版物理八年级下册 第八章 第一节
  * 探究阻力对物体运动的影响
  * 体验科学思维的演进历程
- **教师说课讲义 / 讲台提示词**：上课！同学们好。请大家看大屏幕上的两个画面：一个是亚里士多德在两千年前的思考，另一个是天宫空间站里航天员轻松抛接物体的奇景。物体的运动究竟需要力来维持吗？带着这个千古之问，今天我们一同走进《牛顿第一定律》。
- **课堂互动提问 / 互动活动**：推桌子，桌子动；停止推，桌子停。大家直觉认为“力是维持运动的原因”对不对？请快速举手表态。

### Slide 2: 历史争鸣：亚里士多德 VS 伽利略
- **页面类型**：概念精讲与对比
- **画面核心视觉/板式建议**：左右分栏对比卡片，亚里士多德（维持论）与伽利略（阻力论）论点气泡对比
- **课件展示核心要点**：
  * 亚里士多德观点：力是维持物体运动的原因（维持论，统治两千年）
  * 伽利略的质疑：物体的运动并不需要力来维持，运动变慢是因为受到了阻力！
  * 核心分歧点：如何用实验检验阻力的作用？
- **教师说课讲义 / 讲台提示词**：亚里士多德的观点符合我们生活中的直觉，但真理往往隐藏在表象之下。伽利略用斜面小车实验，开启了人类用实验+逻辑推理探索真理的大门。
- **课堂互动提问 / 互动活动**：思考：如果我们能让接触面绝对光滑，小车滑下后会怎样？

### Slide 3: 探究实验：阻力对小车运动的影响
- **页面类型**：实验演示
- **画面核心视觉/板式建议**：斜面小车在毛巾、棉布、木板三种表面运动距离的实测动图与数据记录表
- **课件展示核心要点**：
  * 控制变量法：小车必须从斜面【同一高度】由静止释放（确保初速度相同）
  * 接触面粗糙程度：毛巾 ➔ 棉布 ➔ 木板
  * 实验现象：阻力越小，小车滑行距离越【远】，速度减小越【慢】
- **教师说课讲义 / 讲台提示词**：大家注意观察实验台，为什么每次都要把小车放在同一个标记刻度处松手？请第一小组代表回答。对，控制到达水平面时的初速度完全相同。
- **课堂互动提问 / 互动活动**：请同桌两人一组，在导学案上记录三次滑行距离，并讨论实验结论。

### Slide 4: 科学推理与牛顿第一定律
- **页面类型**：概念精讲
- **画面核心视觉/板式建议**：醒目高光定理框，关键词“一切”、“不受力”、“静止或匀速直线运动”加粗闪烁
- **课件展示核心要点**：
  * 推理假设：若水平面绝对光滑（阻力为零），小车将【永远做匀速直线运动】
  * 定律内容：一切物体在没有受到力的作用时，总保持静止状态或匀速直线运动状态
  * 核心内涵：“不受力”是条件，“力是改变运动状态的原因”而非维持原因
- **教师说课讲义 / 讲台提示词**：牛顿在前人基础上，总结出了这一定律。请大家在笔记本上圈出“一切”和“总”这两个字。这一定律虽然无法由实验直接验证，但建立在坚实实验事实基础上的科学推理！
- **课堂互动提问 / 互动活动**：提问：正在飞行的足球如果所有外力突然全部消失，它会怎样？

### Slide 5: 揭开神秘面纱：什么是“惯性”？
- **页面类型**：概念剖析
- **画面核心视觉/板式建议**：公交车突然刹车时乘客前倾、突然启动时后仰的趣味卡通示意图
- **课件展示核心要点**：
  * 定义：一切物体都有保持原来运动状态不变的性质，叫做惯性
  * 固有属性：一切物体在任何时候、任何状态下都具有惯性
  * 决定因素：惯性大小【只与质量有关】，与速度无关！
- **教师说课讲义 / 讲台提示词**：大家常说“车速太快惯性太大”，这在物理学上是严格错误的！速度大只是动能大难刹停，但惯性只取决于质量。大卡车比小轿车难停，是因为大卡车质量大、惯性大。
- **课堂互动提问 / 互动活动**：随堂判断：静止在地面上的足球有没有惯性？

### Slide 6: 生活中的惯性现象：利用与防范
- **页面类型**：案例研讨
- **画面核心视觉/板式建议**：左右图文并茂：左侧为安全带、安全气囊、保持车距；右侧为拍打衣服除尘、跳远助跑、紧固锤头
- **课件展示核心要点**：
  * 【利用惯性】：跳远助跑腾空、将锤柄在石头上撞击使锤头紧套、甩干衣服
  * 【防范惯性危害】：系好安全带、雨雪天减速慢行、严禁超载
- **教师说课讲义 / 讲台提示词**：物理源于生活，用于生活。我们要善于利用惯性为生活带来便利，更要防范惯性带来的交通事故隐患。
- **课堂互动提问 / 互动活动**：请每位同学举一个生活中利用惯性或防范惯性危害的真实例子。

### Slide 7: 随堂变式闯关练习
- **页面类型**：随堂测验
- **画面核心视觉/板式建议**：两道中考经典真题，配选择题选项与倒计时钟表
- **课件展示核心要点**：
  * 题1：关于惯性，下列说法正确的是（B）
    A. 飞船离开地球后失去惯性   B. 质量大的物体惯性大
    C. 速度大的物体惯性大       D. 静止的物体没有惯性
  * 题2：汽车急刹车时，乘客身体向前倾的原因是（ ）
- **教师说课讲义 / 讲台提示词**：请大家用一分钟时间快速作答。重点关注题1中的易错选项C和D。
- **课堂互动提问 / 互动活动**：请全班同学用手势打出题1的选项编号（1代表A，2代表B）。

### Slide 8: 课堂小结与课后实践任务
- **页面类型**：总结拓展
- **画面核心视觉/板式建议**：结构化思维导图总结全课要点，右侧为家庭微实验任务卡
- **课件展示核心要点**：
  * 知识建构：牛顿第一定律（条件与结论） ➔ 惯性（定义、唯一决定因素：质量）
  * 思想方法：理想实验法、科学推理法、控制变量法
  * 课后探究：利用水杯、硬纸片和鸡蛋，亲手完成“惯性落蛋”家庭微实验并录制小视频
- **教师说课讲义 / 讲台提示词**：今天我们不仅学会了牛顿第一定律，更体会了物理学家如何通过实验和理性的翅膀飞向真理。课后请大家完成导学案对应习题和家庭微实验。下课！
- **课堂互动提问 / 互动活动**：齐读知识框架，整理随堂笔记。`);

  const [isSaved, setIsSaved] = useState(false);

  // Presentation Full-Screen Mode
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showNotesInPlayer, setShowNotesInPlayer] = useState(true);

  const slides: SlideItem[] = parseSlideMarkdown(generatedContent);

  // Keyboard navigation for presentation mode
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        setIsPlaying(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, slides.length]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      onNotify('error', '请输入课题名称');
      return;
    }

    setLoading(true);
    setIsSaved(false);
    setGeneratedContent('');

    try {
      const { prompt, systemInstruction } = buildPptOutlinePrompt({
        subject,
        grade,
        topic,
        slideCount,
        style,
        specialRequests,
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
      onNotify('success', `已成功生成 ${slideCount} 页课件大纲与说课讲义！`);
    } catch (err: any) {
      console.error(err);
      onNotify('error', err.message || '课件大纲生成失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedContent) return;
    saveResource({
      title: `${topic} - PPT课件大纲与讲义`,
      toolId: 'ppt-outline',
      category: `${grade.split(' ')[0]}${subject}`,
      tags: [subject, grade.split(' ')[0], 'PPT课件', '说课讲义'],
      content: generatedContent,
    });
    setIsSaved(true);
    onNotify('success', '已将课件大纲保存至【我的备课库】');
    if (onSavedChange) onSavedChange();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-700 to-blue-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs text-xs font-medium text-cyan-100 mb-2">
            <Presentation className="w-3.5 h-3.5 text-cyan-300" />
            <span>结构化幻灯片·教师台词备忘·在线全屏放映</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">课件大纲与说课讲义工坊</h2>
          <p className="text-cyan-100 text-sm mt-1 max-w-2xl">
            自动规划每一页幻灯片的视觉排版、核心要点、教师说课台词及随堂互动提问，并支持网页端直接全屏演示放映。
          </p>
        </div>

        {/* Action Button: Start Presentation */}
        {slides.length > 0 && (
          <button
            onClick={() => {
              setCurrentSlideIndex(0);
              setIsPlaying(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-900 rounded-xl font-bold text-sm shadow-md hover:bg-cyan-50 transition-transform active:scale-95 shrink-0"
          >
            <Play className="w-4 h-4 fill-blue-900" />
            <span>进入全屏放映模式</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-600" />
                <span>课件课题与大纲智能联动选择</span>
              </div>
              <span className="text-2xs text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded font-medium">
                新课标课件库
              </span>
            </h3>

            {/* Cascading Curriculum Picker */}
            <CurriculumPicker
              initialStage="junior"
              initialGrade={grade}
              initialSubject={subject}
              initialUnit={unit}
              initialTopic={topic}
              accentColor="cyan"
              onSelectionChange={handleCurriculumChange}
            />

            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  幻灯片页数: <span className="font-semibold text-cyan-700">{slideCount} 页</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={15}
                  value={slideCount}
                  onChange={(e) => setSlideCount(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">课件视觉风格</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                >
                  <option value="启发探究式·图文互动·生动实验演示">生动互动·实验演示</option>
                  <option value="学术简约·逻辑严密·思维导图清晰">学术简约·思维导图</option>
                  <option value="情境故事化·趣味活泼·童真童趣">趣味故事·活泼插画</option>
                  <option value="中高考备考复习·题型精析·考点直击">中高考复习·题型精析</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                特别说明与要求 (选填)
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={2}
                placeholder="例如：需包含一个5分钟的分组讨论环节；设计一道易错中考真题..."
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI 课件设计师正在规划幻灯片与说课讲义...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>一键生成课件大纲与说课讲义</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Viewer */}
        <div className="lg:col-span-7 space-y-4">
          {generatedContent ? (
            <MarkdownViewer
              title={`《${topic}》PPT课件大纲与说课讲义`}
              content={generatedContent}
              onSaveToLibrary={handleSave}
              isSaved={isSaved}
              onContentChange={(newContent) => setGeneratedContent(newContent)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3">
                <Presentation className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-slate-800 text-base mb-1">课件大纲就绪</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-4">
                输入课题与页数，AI 将为您生成包含页面视觉建议、要点、说课台词与课堂提问的完整课件大纲。
              </p>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-semibold hover:bg-cyan-100 transition-colors"
              >
                立即生成大纲
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Presentation Mode Overlay */}
      {isPlaying && slides.length > 0 && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col select-none animate-in fade-in">
          {/* Top Control Bar */}
          <div className="h-14 px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-cyan-400 truncate max-w-md">{topic}</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-400">
                {currentSlideIndex + 1} / {slides.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNotesInPlayer(!showNotesInPlayer)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  showNotesInPlayer ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                教师说课备忘与台词
              </button>

              <button
                onClick={() => setIsPlaying(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                title="退出放映 (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Slide Canvas */}
          <div className="flex-1 flex flex-col lg:flex-row p-6 md:p-12 gap-8 items-center justify-center overflow-hidden">
            {/* Slide Stage Area */}
            <div className="w-full max-w-4xl aspect-16/9 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              {/* Background ambient accent */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/60">
                    Slide {currentSlideIndex + 1}
                  </span>
                  <span className="text-xs text-slate-500">EduSpark 智教星</span>
                </div>

                <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-6">
                  {slides[currentSlideIndex]?.title}
                </h1>

                <div className="space-y-4">
                  {slides[currentSlideIndex]?.keyPoints.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-3 text-slate-200 text-base md:text-xl font-normal leading-relaxed">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive prompt bottom badge if exists */}
              {slides[currentSlideIndex]?.interactivePrompt && (
                <div className="mt-6 p-4 rounded-2xl bg-indigo-950/80 border border-indigo-700/50 flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-xs font-bold shrink-0">
                    随堂互动提问
                  </span>
                  <span className="text-xs md:text-sm text-indigo-100 font-medium truncate">
                    {slides[currentSlideIndex]?.interactivePrompt}
                  </span>
                </div>
              )}
            </div>

            {/* Teacher Speaker Notes Side Panel */}
            {showNotesInPlayer && (
              <div className="w-full lg:w-80 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 max-h-[500px] overflow-y-auto">
                <div className="border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">教师说课讲义 / 讲台台词</h4>
                </div>

                <div className="text-xs md:text-sm text-slate-300 leading-relaxed space-y-2">
                  <p>{slides[currentSlideIndex]?.teacherNotes}</p>
                </div>

                {slides[currentSlideIndex]?.interactivePrompt && (
                  <div className="pt-3 border-t border-slate-800">
                    <h5 className="text-xs font-semibold text-indigo-300 mb-1">互动探究指引：</h5>
                    <p className="text-xs text-slate-400">{slides[currentSlideIndex]?.interactivePrompt}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Nav Controls */}
          <div className="h-16 px-8 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              提示：可使用键盘方向键 <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">←</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">→</kbd> 或空格键翻页
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentSlideIndex === 0}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>上一页</span>
              </button>

              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))}
                disabled={currentSlideIndex === slides.length - 1}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>下一页</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
