import React, { useState, useEffect } from 'react';
import { FolderArchive, Search, Star, Trash2, Download, Eye, FileText, Plus, BookOpen, HelpCircle, FileCheck2, Award, Presentation, MessageSquareShare, Sparkles, Video, Baby, LayoutTemplate } from 'lucide-react';
import { SavedResource, ToolId } from '../../types';
import { getSavedResources, deleteResource, toggleFavoriteResource, exportAsDoc, exportAsMarkdown } from '../../utils/storage';
import { MarkdownViewer } from '../MarkdownViewer';

interface Props {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onOpenTool?: (toolId: ToolId) => void;
}

export function ResourceLibrary({ onNotify, onOpenTool }: Props) {
  const [resources, setResources] = useState<SavedResource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTool, setFilterTool] = useState<string>('all');
  const [filterFavoriteOnly, setFilterFavoriteOnly] = useState(false);
  const [activeResource, setActiveResource] = useState<SavedResource | null>(null);

  const loadResources = () => {
    const list = getSavedResources();
    setResources(list);
    if (!activeResource && list.length > 0) {
      setActiveResource(list[0]);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这份备课材料吗？')) {
      deleteResource(id);
      loadResources();
      if (activeResource?.id === id) {
        setActiveResource(null);
      }
      onNotify('info', '已删除该备课资源');
    }
  };

  const handleToggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = toggleFavoriteResource(id);
    loadResources();
    onNotify('info', nextState ? '已加入特别收藏' : '已取消收藏');
  };

  const getToolIcon = (toolId: ToolId) => {
    switch (toolId) {
      case 'kindergarten-activity': return <Baby className="w-4 h-4 text-rose-500" />;
      case 'child-observation': return <Sparkles className="w-4 h-4 text-pink-600" />;
      case 'kindergarten-env': return <LayoutTemplate className="w-4 h-4 text-teal-600" />;
      case 'lesson-plan': return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'quiz-gen': return <HelpCircle className="w-4 h-4 text-emerald-600" />;
      case 'essay-grade': return <FileCheck2 className="w-4 h-4 text-amber-600" />;
      case 'student-comment': return <Award className="w-4 h-4 text-purple-600" />;
      case 'ppt-outline': return <Presentation className="w-4 h-4 text-cyan-600" />;
      case 'parent-comm': return <MessageSquareShare className="w-4 h-4 text-rose-600" />;
      case 'class-activity': return <Sparkles className="w-4 h-4 text-violet-600" />;
      case 'micro-lesson': return <Video className="w-4 h-4 text-fuchsia-600" />;
      default: return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const getToolName = (toolId: ToolId) => {
    switch (toolId) {
      case 'kindergarten-activity': return '幼教活动';
      case 'child-observation': return '幼儿观察';
      case 'kindergarten-env': return '班级环创';
      case 'lesson-plan': return '教案设计';
      case 'quiz-gen': return '考题试卷';
      case 'essay-grade': return '作文精批';
      case 'student-comment': return '学生评语';
      case 'ppt-outline': return '课件大纲';
      case 'parent-comm': return '家校沟通';
      case 'class-activity': return '课堂活动';
      case 'micro-lesson': return '微课脚本';
      default: return '教学材料';
    }
  };

  // Filtered resources
  const filteredList = resources.filter((item) => {
    if (filterFavoriteOnly && !item.isFavorite) return false;
    if (filterTool !== 'all' && item.toolId !== filterTool) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
      const matchContent = item.content.toLowerCase().includes(q);
      return matchTitle || matchTags || matchContent;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs text-xs font-medium text-slate-200 mb-2">
            <FolderArchive className="w-3.5 h-3.5 text-indigo-300" />
            <span>个人云备课库·安全持久化·一键检索导出</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">我的教学备课库</h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            集中管理您已生成的幼教活动、中小学教案、试卷、批改报告、期末评语与环创方案，支持随时查阅、二次编辑与导出。
          </p>
        </div>

        <div className="text-xs text-slate-300 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
          已收录备课资产：<span className="text-white font-bold text-base">{resources.length}</span> 篇
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Resource List & Filter */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索标题、学科、知识点标签..."
                className="w-full text-xs rounded-xl border border-slate-200 pl-9 pr-3 py-2 bg-slate-50 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setFilterTool('all')}
                className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                  filterTool === 'all' ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                全部
              </button>

              {['kindergarten-activity', 'child-observation', 'kindergarten-env', 'lesson-plan', 'quiz-gen', 'student-comment'].map((tid) => (
                <button
                  key={tid}
                  onClick={() => setFilterTool(tid)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                    filterTool === tid ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {getToolName(tid as ToolId)}
                </button>
              ))}

              <button
                onClick={() => setFilterFavoriteOnly(!filterFavoriteOnly)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ml-auto ${
                  filterFavoriteOnly ? 'bg-amber-500 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Star className={`w-3 h-3 ${filterFavoriteOnly ? 'fill-white' : ''}`} />
                <span>收藏</span>
              </button>
            </div>
          </div>

          {/* List Items */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                没有找到符合条件的备课材料
              </div>
            ) : (
              filteredList.map((item) => {
                const isSelected = activeResource?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveResource(item)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer bg-white relative group ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500/10 shadow-xs'
                        : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-100 shrink-0">
                          {getToolIcon(item.toolId)}
                        </div>
                        <div>
                          <span className="text-2xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                            {getToolName(item.toolId)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleToggleFav(item.id, e)}
                          className="p-1 text-slate-400 hover:text-amber-500"
                          title="收藏"
                        >
                          <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1 text-slate-400 hover:text-rose-500"
                          title="删除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xs md:text-sm font-semibold text-slate-900 mt-2 line-clamp-1">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-2 mt-2 text-2xs text-slate-400 flex-wrap">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      {item.tags.slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx} className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Item Preview */}
        <div className="lg:col-span-7">
          {activeResource ? (
            <MarkdownViewer
              title={activeResource.title}
              content={activeResource.content}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <FolderArchive className="w-10 h-10 text-slate-400 mb-3" />
              <h3 className="font-semibold text-slate-700 text-sm">选择左侧材料进行预览</h3>
              <p className="text-xs text-slate-400 mt-1">支持直接复制、打印与导出 Word 格式</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
