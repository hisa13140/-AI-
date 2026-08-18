import React, { useState } from 'react';
import { LayoutTemplate, Sparkles, Loader2, Wand2, Layers, Palette, Trees, ShieldCheck } from 'lucide-react';
import { KINDERGARTEN_AGE_GROUPS } from '../../data/presets';
import { requestAIGeneration, buildKindergartenEnvPrompt } from '../../services/aiService';
import { MarkdownViewer } from '../MarkdownViewer';
import { saveResource } from '../../utils/storage';

interface Props {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSavedChange?: () => void;
}

export function KindergartenEnvStudio({ onNotify, onSavedChange }: Props) {
  const [themeName, setThemeName] = useState('奇妙的大自然与秋天的落叶');
  const [ageGroup, setAgeGroup] = useState('中班 (4-5岁)');
  const [spaceType, setSpaceType] = useState('主题墙面 + 六大区角整体联动');
  const [style, setStyle] = useState('自然原木风·低饱和大地色·温馨自然生态');
  const [materialsPreference, setMaterialsPreference] = useState('纸箱麻绳改造、松果树枝等低结构自然物、幼儿亲子手工涂鸦');

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>(`# 中班主题环创设计方案：《奇妙的大自然与秋天的落叶》

## 一、 设计理念与空间美学
- **设计理念**：“让环境成为第三位老师”、“儿童是环境的主人”。拒绝成人化、死板的印刷贴纸装饰，将大自然的松果、落叶、树皮引入教室，打造可观察、可触摸、持续生长、充满生命力的儿童探究空间。
- **色彩与色系**：
  * **主色调**：温暖原木色、大地棕、米白色。
  * **点缀色**：落叶黄、枫叶红、橄榄绿。
  * **材质质感**：牛皮纸、原色麻绳、软木板、原木树桩片、透明玻璃广口瓶。

---

## 二、 主题墙面核心版块规划（高度 60cm-120cm 儿童视线平视区）

### 1. 【版块一：秋天的问号与前经验（大自然好奇信箱）】
- **版式呈现**：用瓦楞纸箱切割成大树轮廓，树干上悬挂幼儿用符号、绘画表达的“关于秋天的秘密”提问卡。
- **互动机制**：幼儿每天发现新的秋天现象，可以随时将落叶或画片投进“大自然信箱”。

### 2. 【版块二：落叶探秘大图表（我们的调查与分类）】
- **版式呈现**：牛皮纸大底图，设置三大透明亚克力收纳袋，分为：
  * 《叶子的形状》（掌形、卵形、扇形）
  * 《叶子的颜色》（黄、红、绿、渐变）
  * 《树叶叶脉拓印标本》
- **幼儿参与**：幼儿亲自用放大镜观察并将捡拾的落叶塑封后贴在对应分类口袋中。

### 3. 【版块三：互动游戏转盘（秋天的小动物去哪儿了）】
- **互动装置**：用废旧纸盘制作的旋转表盘，转动指针可匹配松鼠储粮、大雁南飞、刺猬冬眠的图卡，幼儿自由操作。

### 4. 【版块四：我的创意落叶秀（流动的艺术画廊）】
- **展示方式**：用麻绳和原木小夹子拉出三层展示线，悬挂幼儿创作的树叶贴画、叶拓印染小手帕。作品旁附有教师记录的“儿童创作自述小标签”。

---

## 三、 配套区角材料投放与进阶玩法

| 区角名称 | 主题材料投放清单 | 幼儿进阶探索玩法 |
|:---|:---|:---|
| **美工区** | 各色落叶、水粉颜料、滚轮、软陶泥、树叶压花器 | 1. 树叶拓印明信片；2. 黏土与叶脉肌理压印；3. 树叶面具制作 |
| **科学探究区** | 放大镜、显微镜标本片、天平称、干湿落叶对比盒 | 1. 称量干燥叶与新鲜叶重量；2. 叶脉网状结构细致观察 |
| **建构区** | 树桩切片、天然木条、松果、鹅卵石、森林动物模型 | 1. 为小松鼠搭建“过冬储粮树屋”；2. 树桩多米诺骨牌 |
| **阅读区** | 绘本《一片叶子落下来》《落叶跳舞》《风喜欢和我玩》 | 1. 听风的声音；2. 结合落叶道具进行绘本小剧场表演 |
| **自然角** | 银杏水培瓶、红薯小森林、松果干花插瓶 | 幼儿每日自主排班轮值照料并进行“植物生长记录打卡” |

---

## 四、 废旧物品低成本环保改造指南
- **废弃纸箱** ➔ 改造为“大树洞秘密阅读角”与“主题墙树干立体浮雕”。
- **奶粉铁罐 / 玻璃瓶** ➔ 缠绕黄麻绳，作为水培植物与干花插瓶。
- **快递气泡膜** ➔ 沾取黄色颜料，拓印出逼真的蜂巢与秋季麦田肌理。

---

## 五、 家园互动与亲子自然收集令
- 发放《我和爸爸妈妈的秋天自然寻宝袋》，鼓励家庭在周末公园散步时收集奇特形状的枯叶、松果、小石子带到班级，共同丰富主题环境。`);

  const [isSaved, setIsSaved] = useState(false);

  // Presets for Kindergarten theme walls
  const themePresets = [
    {
      name: '奇妙大自然与秋天落叶 (中班)',
      theme: '奇妙的大自然与秋天的落叶',
      age: '中班 (4-5岁)',
      space: '主题墙面 + 六大区角整体联动',
      style: '自然原木风·低饱和大地色·温馨自然生态',
      mat: '纸箱麻绳改造、松果树枝等低结构自然物、幼儿亲子手工'
    },
    {
      name: '健康小卫士与情绪小怪兽 (小班)',
      theme: '健康好习惯与情绪小怪兽',
      age: '小班 (3-4岁)',
      space: '主题互动墙 + 娃娃家生活区',
      style: '温暖活泼·马卡龙色系·柔和圆角',
      mat: '不织布表情拼贴、软垫镜子、洗手刷牙互动翻翻卡'
    },
    {
      name: '我要上小学啦 (大班幼小衔接)',
      theme: '再见了幼儿园，我要上小学啦！',
      age: '大班 (5-6岁)',
      space: '主题墙面 + 班级进门长廊',
      style: '清新书卷风·成长时间轴·自律计划表',
      mat: '我的小书包收纳模拟、小学生活一日作息钟表、自制倒计时日历'
    },
    {
      name: '传统节日·舌尖上的中国年 (全园/大班)',
      theme: '红红火火过大年（年俗文化探秘）',
      age: '大班 (5-6岁)',
      space: '班级主墙 + 民俗美食体验区',
      style: '中国红国潮风·剪纸瓦当·传统民俗',
      mat: '红包利是封灯笼、红宣纸窗花、面团饺子黏土模型'
    }
  ];

  const handleApplyPreset = (p: typeof themePresets[0]) => {
    setThemeName(p.theme);
    setAgeGroup(p.age);
    setSpaceType(p.space);
    setStyle(p.style);
    setMaterialsPreference(p.mat);
    onNotify('info', `已载入环创主题：${p.name}`);
  };

  const handleGenerate = async () => {
    if (!themeName.trim()) {
      onNotify('error', '请输入环创主题名称');
      return;
    }

    setLoading(true);
    setIsSaved(false);
    setGeneratedContent('');

    try {
      const { prompt, systemInstruction } = buildKindergartenEnvPrompt({
        themeName,
        ageGroup,
        spaceType,
        style,
        materialsPreference,
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
      onNotify('success', '班级环创与主题墙方案已生成！');
    } catch (err: any) {
      console.error(err);
      onNotify('error', err.message || '环创方案生成失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedContent) return;
    saveResource({
      title: `${themeName} - 班级环创与主题墙方案`,
      toolId: 'kindergarten-env',
      category: `${ageGroup.split(' ')[0]}班级环创`,
      tags: ['班级环创', '主题墙', ageGroup.split(' ')[0], '区角创设'],
      content: generatedContent,
    });
    setIsSaved(true);
    onNotify('success', '已将环创方案存入【我的备课库】');
    if (onSavedChange) onSavedChange();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-xs text-xs font-medium text-teal-100 mb-2">
            <LayoutTemplate className="w-3.5 h-3.5 text-teal-200" />
            <span>儿童视线平视 · 动静分区 · 废旧环保材料低成本改造</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">班级环创与主题墙设计工坊</h2>
          <p className="text-teal-100 text-sm mt-1 max-w-2xl">
            让环境成为“第三位老师”。生成符合儿童身高视线的主题墙布局、六大区角进阶材料投放表、可操作互动墙面与低成本废旧物品改造清单。
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 md:max-w-md">
          <span className="text-xs text-teal-200 w-full mb-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-300" /> 快速载入环创主题范例：
          </span>
          {themePresets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="text-xs px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-md text-white transition-colors border border-white/10 truncate max-w-[140px]"
            >
              {p.theme.split('（')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>环创主题与空间要素</span>
            </h3>

            {/* Theme & Age */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">班级年龄段</label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  {KINDERGARTEN_AGE_GROUPS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">空间创设范围</label>
                <select
                  value={spaceType}
                  onChange={(e) => setSpaceType(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="主题墙面 + 六大区角整体联动">主墙面 + 六大区角联动</option>
                  <option value="核心主墙面立体创设 (含互动装置)">核心主题墙面 (含互动装置)</option>
                  <option value="班级门廊/走廊/玄关家园共育墙">门廊走廊/家园互动墙</option>
                  <option value="自然角种植观察与动植物微生态">自然角/种植观察微生态</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                主题名称 / 季节时令 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                placeholder="例如：奇妙的大自然与落叶、海底世界、航天探秘..."
                className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">美学视觉风格</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="自然原木风·低饱和大地色·温馨自然生态">自然原木风 (原木/麻绳/牛皮纸)</option>
                <option value="绘本童话风·马卡龙暖色调·治愈童趣">绘本童话风 (柔和暖色/可爱插画)</option>
                <option value="极简留白风·幼儿作品为主角·干净清爽">极简留白风 (以幼儿作品为主)</option>
                <option value="国潮传统风·剪纸瓦当·节庆年俗">国潮传统风 (民俗元素/宣纸国画)</option>
                <option value="未来科技风·银白冷灰·太空科幻">未来科技风 (探索/星空/机械)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                材料与幼儿参与偏好
              </label>
              <textarea
                value={materialsPreference}
                onChange={(e) => setMaterialsPreference(e.target.value)}
                rows={3}
                placeholder="例如：主张纸箱和松果等废旧物改造；主题墙需留出大面积供幼儿随时贴画..."
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>儿童空间设计师正在规划主题墙与区角...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>一键生成班级环创全套方案</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Viewer */}
        <div className="lg:col-span-7">
          {generatedContent ? (
            <MarkdownViewer
              title={`《${themeName}》班级环创与主题墙设计方案`}
              content={generatedContent}
              onSaveToLibrary={handleSave}
              isSaved={isSaved}
              onContentChange={(newContent) => setGeneratedContent(newContent)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <LayoutTemplate className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-slate-800 text-base mb-1">环创方案就绪</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-4">
                输入环创主题与班级年龄，AI 将为您量身定制主墙面布局、区角材料清单与废旧物品改造策略。
              </p>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-xs font-semibold hover:bg-teal-100 transition-colors"
              >
                生成【{themeName}】环创方案
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
