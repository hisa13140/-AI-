import React from 'react';
import { BookOpen, HelpCircle, FileCheck2, Award, Presentation, MessageSquareShare, Sparkles, Clock, Video, FolderArchive, ArrowRight, Baby, LayoutTemplate } from 'lucide-react';
import { TOOLS_LIST } from '../data/presets';
import { ToolCategory, ToolId } from '../types';

interface Props {
  activeCategory: ToolCategory;
  onSelectTool: (id: ToolId) => void;
}

export function ToolGrid({ activeCategory, onSelectTool }: Props) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby': return <Baby className="w-5 h-5 text-rose-500" />;
      case 'LayoutTemplate': return <LayoutTemplate className="w-5 h-5 text-teal-600" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'HelpCircle': return <HelpCircle className="w-5 h-5 text-emerald-600" />;
      case 'FileCheck2': return <FileCheck2 className="w-5 h-5 text-amber-600" />;
      case 'Award': return <Award className="w-5 h-5 text-purple-600" />;
      case 'Presentation': return <Presentation className="w-5 h-5 text-cyan-600" />;
      case 'MessageSquareShare': return <MessageSquareShare className="w-5 h-5 text-rose-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-violet-600" />;
      case 'Clock': return <Clock className="w-5 h-5 text-sky-600" />;
      case 'Video': return <Video className="w-5 h-5 text-fuchsia-600" />;
      case 'FolderArchive': return <FolderArchive className="w-5 h-5 text-slate-700" />;
      default: return <BookOpen className="w-5 h-5 text-indigo-600" />;
    }
  };

  const filteredTools = TOOLS_LIST.filter(
    tool => activeCategory === 'all' || tool.category === activeCategory
  );

  return (
    <div className="space-y-6">
      {/* Category Intro Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {activeCategory === 'all' && '教师与幼教全场景 AI 赋能工作台'}
            {activeCategory === 'kindergarten' && '🧸 幼儿园老师专用 AI 工具箱'}
            {activeCategory === 'design' && '教学设计与教案课件工坊'}
            {activeCategory === 'assessment' && '智能命题与作业批阅中心'}
            {activeCategory === 'evaluation' && '学生发展评价与家校共育'}
            {activeCategory === 'interaction' && '课堂互动与游戏化教学'}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            {activeCategory === 'kindergarten'
              ? '对标《3-6岁儿童学习与发展指南》，涵盖健康/语言/社会/科学/艺术五大领域活动、学习故事观察与班级环创。'
              : '涵盖新课标备课、幼教五大领域、命题测评、多维评语、课件大纲到随堂实用的全流程教育智能化工具。'}
          </p>
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className={`group bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
              tool.category === 'kindergarten'
                ? 'border-rose-100 hover:border-rose-300'
                : 'border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 ${
                  tool.category === 'kindergarten' ? 'bg-rose-50' : 'bg-slate-100'
                }`}>
                  {getIcon(tool.iconName)}
                </div>
                {tool.badge && (
                  <span className={`px-2.5 py-0.5 rounded-full text-2xs font-semibold shrink-0 border ${
                    tool.category === 'kindergarten'
                      ? 'bg-rose-50 text-rose-700 border-rose-100'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                  }`}>
                    {tool.badge}
                  </span>
                )}
              </div>

              <h3 className={`font-bold text-base text-slate-900 transition-colors ${
                tool.category === 'kindergarten' ? 'group-hover:text-rose-600' : 'group-hover:text-indigo-600'
              }`}>
                {tool.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {tool.shortDesc}
              </p>
            </div>

            <div className={`mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold group-hover:translate-x-0.5 transition-transform ${
              tool.category === 'kindergarten' ? 'text-rose-600' : 'text-indigo-600'
            }`}>
              <span>立即进入使用</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
