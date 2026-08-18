import React from 'react';
import { Sparkles, FolderArchive, Wrench, Baby } from 'lucide-react';
import { ToolCategory, ToolId } from '../types';

interface NavbarProps {
  activeCategory: ToolCategory;
  onSelectCategory: (category: ToolCategory) => void;
  activeToolId: ToolId | null;
  onSelectTool: (id: ToolId) => void;
  savedCount: number;
}

export function Navbar({
  activeCategory,
  onSelectCategory,
  activeToolId,
  onSelectTool,
  savedCount,
}: NavbarProps) {
  const navCategories: { id: ToolCategory; label: string; highlight?: boolean }[] = [
    { id: 'all', label: '全部工具' },
    { id: 'kindergarten', label: '幼教专区', highlight: true },
    { id: 'design', label: '教学设计' },
    { id: 'assessment', label: '测评批改' },
    { id: 'evaluation', label: '育人评价' },
    { id: 'interaction', label: '课堂互动' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title (one line) */}
        <button
          onClick={() => {
            onSelectCategory('all');
            onSelectTool('lesson-plan');
          }}
          className="flex items-center gap-2.5 text-left focus:outline-hidden group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight whitespace-nowrap">
            EduSpark 智教星
          </span>
        </button>

        {/* Zone 2: Navigation Links (4-6 links, 1-2 words, single line) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navCategories.map((cat) => {
            const isActive = activeCategory === cat.id && activeToolId !== 'library' && activeToolId !== 'in-class-tools';
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  if (cat.id === 'kindergarten') {
                    onSelectTool('kindergarten-activity');
                  } else if (activeToolId === 'library' || activeToolId === 'in-class-tools') {
                    onSelectTool('lesson-plan');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? cat.id === 'kindergarten'
                      ? 'bg-rose-50 text-rose-700 font-semibold'
                      : 'bg-indigo-50 text-indigo-700 font-semibold'
                    : cat.id === 'kindergarten'
                    ? 'text-rose-600 hover:bg-rose-50/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {cat.id === 'kindergarten' && <Baby className="w-3.5 h-3.5 text-rose-500" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectTool('in-class-tools')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeToolId === 'in-class-tools'
                ? 'bg-sky-100 text-sky-800'
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200/80'
            }`}
            title="课堂随机点名、倒计时与随堂分组小工具"
          >
            <Wrench className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">随堂小工具</span>
            <span className="sm:hidden">工具</span>
          </button>

          <button
            onClick={() => onSelectTool('library')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeToolId === 'library'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FolderArchive className="w-4 h-4 text-indigo-500" />
            <span>我的备课库</span>
            {savedCount > 0 && (
              <span className={`ml-0.5 px-1.5 py-0.2 rounded-full text-xs font-semibold ${
                activeToolId === 'library' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
