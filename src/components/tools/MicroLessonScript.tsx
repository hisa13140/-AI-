import React, { useState } from 'react';
import { Video, Sparkles, Loader2, Wand2, Film, Layers } from 'lucide-react';
import { requestAIGeneration, buildMicroLessonPrompt } from '../../services/aiService';
import { MarkdownViewer } from '../MarkdownViewer';
import { saveResource } from '../../utils/storage';
import { CurriculumPicker, CurriculumSelection } from '../CurriculumPicker';

interface Props {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSavedChange?: () => void;
}

export function MicroLessonScript({ onNotify, onSavedChange }: Props) {
  const [stage, setStage] = useState('junior');
  const [subject, setSubject] = useState('化学');
  const [grade, setGrade] = useState('初中九年级 (初三)');
  const [unit, setUnit] = useState('第五单元：化学方程式与质量守恒');
  const [topic, setTopic] = useState('《如何秒懂“质量守恒定律”与微观本质》');
  const [duration, setDuration] = useState('5-8分钟精品微课');
  const [visualStyle, setVisualStyle] = useState('动画演示+真人出镜解说+实时手写板书');

  const handleCurriculumChange = (sel: CurriculumSelection) => {
    setStage(sel.stage);
    setGrade(sel.grade);
    setSubject(sel.subject);
    setUnit(sel.unit);
    setTopic(sel.topic);
  };

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>(`# 微课录制分镜脚本：《如何秒懂“质量守恒定律”与微观本质》

## 一、 微课基本信息
- **微课主题**：质量守恒定律的微观本质
- **适用年级**：九年级化学上册 第五单元
- **视频总时长**：6分30秒
- **制作形式**：希沃白板微课 / 录屏 + 动画分镜

---

## 二、 视频分镜与脚本台词表

| 序号 | 预计时间 | 画面呈现 / 视觉板书 | 教师口播讲解词 | 音效与互动特效 |
|:---|:---|:---|:---|:---|
| 01 | 00:00 - 00:45 | **【片头与问题引入】**<br>大屏幕显示蜡烛燃烧变短、铁钉生锈变重的对比动图。教师半身出镜。 | 同学们好！欢迎来到化学微课堂。蜡烛越烧越轻，铁钉生锈却越变越重，化学反应前后的物质总质量真的变了吗？今天我们用6分钟，彻底搞懂“质量守恒定律”！ | 轻快片头音乐淡出；蜡烛旁出现醒目的“？”气泡 |
| 02 | 00:45 - 02:00 | **【宏观实验证据】**<br>播放“红磷在密闭锥形瓶中燃烧”的高清实验微视频。天平指针始终稳稳指向中央。 | 我们看这个经典实验：白磷在密闭容器里剧烈燃烧，产生大量白烟。注意看天平的指针——纹丝不动！无数科学家通过精密实验证实：**参加化学反应的各物质质量总和，等于反应后生成的各物质质量总和。** | 天平平衡时配“叮”提示音；定律核心字加粗高亮 |
| 03 | 02:00 - 04:15 | **【微观动画揭秘：水电解】**<br>3D微观分子模型动画：水分子（$H_2O$）拆分成氢原子和氧原子，再重新组合成氢分子（$H_2$）和氧分子（$O_2$）。 | 为什么质量必然守恒？让我们戴上“微观显微镜”！看，化学变化的本质，是分子分裂成原子，原子重新组合。大家看，原子在这个过程中有没有凭空消失？没有！有没有凭空产生新的原子？也没有！ | 原子拆分与重组动画；出现【六不变】口诀闪烁 |
| 04 | 04:15 - 05:30 | **【经典考点避坑指南】**<br>屏幕弹出中考易错题：“为什么蜡烛在空气中燃烧后质量减少了？”红笔圈出“未收集生成的二氧化碳和水蒸气”。 | 重点避坑提示：定律中的“总质量”，必须包含所有反应物与生成物！蜡烛燃烧产生的气体飞入空气中，若在密闭容器中称量，质量绝对分毫不差！ | 警示三角叹号闪烁；红线圈画关键词“密闭” |
| 05 | 05:30 - 06:30 | **【思维导图总结与课后闯关】**<br>屏幕生成结构化思维导图：宏观（总质量/元素种类）+ 微观（原子种类/数目/质量）。留出随堂思考题。 | 总结口诀：反应前后“原子的种类不变、数目不变、质量不变”！课后请尝试用微观角度解释：高锰酸钾受热分解为什么固体质量减小？我们下节微课见！ | 舒缓片尾音乐淡入，显示下期预告 |

---

## 三、 本微课核心提炼记忆口诀
- **宏观两不变**：反应物与生成物总质量不变、元素种类不变。
- **微观三不变**：原子种类不变、原子数目不变、原子质量不变。
- **必然改变**：分子的种类必然改变、物质的种类必然改变。`);

  const [isSaved, setIsSaved] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      onNotify('error', '请输入微课主题');
      return;
    }

    setLoading(true);
    setIsSaved(false);
    setGeneratedContent('');

    try {
      const { prompt, systemInstruction } = buildMicroLessonPrompt({
        subject,
        grade,
        topic,
        duration,
        visualStyle,
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
      onNotify('success', '微课分镜脚本已生成！');
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
      title: `${topic} - 微课视频分镜脚本`,
      toolId: 'micro-lesson',
      category: `${grade.split(' ')[0]}${subject}`,
      tags: [subject, '微课脚本', '录课分镜'],
      content: generatedContent,
    });
    setIsSaved(true);
    onNotify('success', '已将微课脚本存入【我的备课库】');
    if (onSavedChange) onSavedChange();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-fuchsia-700 to-pink-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs text-xs font-medium text-pink-100 mb-2">
            <Film className="w-3.5 h-3.5 text-pink-300" />
            <span>精品微课大赛标准·分秒台词·画面分镜</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">微课视频与录课分镜工坊</h2>
          <p className="text-pink-100 text-sm mt-1 max-w-2xl">
            生成5-8分钟紧凑生动的微课脚本，包含精确时间轴、画面分镜呈现、教师口播台词、特效音效与板书记忆口诀。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-fuchsia-600" />
                <span>联动课标大纲选择微课课题</span>
              </div>
              <span className="text-2xs text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded font-medium">
                微课知识图谱
              </span>
            </h3>

            {/* Cascading Curriculum Picker */}
            <CurriculumPicker
              initialStage="junior"
              initialGrade={grade}
              initialSubject={subject}
              initialUnit={unit}
              initialTopic={topic}
              accentColor="fuchsia"
              onSelectionChange={handleCurriculumChange}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">视频目标时长</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-600"
                >
                  <option value="3-5分钟碎片精炼微课">3-5分钟精炼短微课</option>
                  <option value="5-8分钟精品微课">5-8分钟标准精品微课</option>
                  <option value="8-10分钟深度专题突破">8-10分钟深度专题</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">录课视觉呈现风格</label>
                <select
                  value={visualStyle}
                  onChange={(e) => setVisualStyle(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-600"
                >
                  <option value="动画演示+真人出镜解说+实时手写板书">动画+出镜+手写板书</option>
                  <option value="PPT课件录屏+画外音精讲">PPT录屏+画外音精讲</option>
                  <option value="手绘思维导图+实物教具演示">手绘导图+实物演示</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>国家级微课名师正在编写分镜脚本...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>一键生成专业微课分镜脚本</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Viewer */}
        <div className="lg:col-span-7">
          {generatedContent ? (
            <MarkdownViewer
              title={`《${topic}》微课分镜脚本`}
              content={generatedContent}
              onSaveToLibrary={handleSave}
              isSaved={isSaved}
              onContentChange={(newContent) => setGeneratedContent(newContent)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center mb-3">
                <Video className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-slate-800 text-base mb-1">微课脚本就绪</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-4">
                输入微课主题，AI 将为您生成精准到秒的分镜头脚本表、口播解说词及记忆口诀。
              </p>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-fuchsia-50 text-fuchsia-700 rounded-lg text-xs font-semibold hover:bg-fuchsia-100 transition-colors"
              >
                立即编写脚本
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
