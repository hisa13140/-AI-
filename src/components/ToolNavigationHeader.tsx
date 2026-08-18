import React from 'react';
import { ChevronLeft, BookOpen, HelpCircle, FileCheck2, Award, Presentation, MessageSquareShare, Sparkles, Clock, Video, FolderArchive, Baby, LayoutTemplate } from 'lucide-react';
import { TOOLS_LIST } from '../data/presets';
import { ToolId } from '../types';

interface Props {
  activeToolId: ToolId;
  onSelectTool: (id: ToolId) => void;
  onBackToGrid: () => void;
}

export function ToolNavigationHeader({ activeToolId, onSelectTool, onBackToGrid }: Props) {
  const getSmallIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby': return <Baby className="w-3.5 h-3.5" />;
      case 'LayoutTemplate': return <LayoutTemplate className="w-3.5 h-3.5" />;
      case 'BookOpen': return <BookOpen className="w-3.5 h-3.5" />;
      case 'HelpCircle': return <HelpCircle className="w-3.5 h-3.5" />;
      case 'FileCheck2': return <FileCheck2 className="w-3.5 h-3.5" />;
      case 'Award': return <Award className="w-3.5 h-3.5" />;
      case 'Presentation': return <Presentation className="w-3.5 h-3.5" />;
      case 'MessageSquareShare': return <MessageSquareShare className="w-3.5 h-3.5" />;
      case 'Sparkles': return <Sparkles className="w-3.5 h-3.5" />;
      case 'Clock': return <Clock className="w-3.5 h-3.5" />;
      case 'Video': return <Video className="w-3.5 h-3.5" />;
      case 'FolderArchive': return <FolderArchive className="w-3.5 h-3.5" />;
      default: return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs flex items-center justify-between gap-2 overflow-x-auto">
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onBackToGrid}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>全部功能一览</span>
        </button>
        <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />
      </div>

      {/* Horizontal Tool Switcher Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-thin">
        {TOOLS_LIST.map((tool) => {
          const isActive = activeToolId === tool.id;
          const isKindergarten = tool.category === 'kindergarten';
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? isKindergarten
                    ? 'bg-rose-600 text-white font-semibold shadow-2xs'
                    : 'bg-indigo-600 text-white font-semibold shadow-2xs'
                  : isKindergarten
                  ? 'text-rose-700 hover:bg-rose-50'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {getSmallIcon(tool.iconName)}
              <span>{tool.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
