import React, { useState } from 'react';
import { Copy, Check, Eye, Download, FileText, Sparkles, Wand2, RotateCcw, Send, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { exportAsDoc, exportAsMarkdown } from '../utils/storage';
import { requestAIGeneration } from '../services/aiService';

interface MarkdownViewerProps {
  content: string;
  title?: string;
  onSaveToLibrary?: () => void;
  isSaved?: boolean;
  onContentChange?: (newContent: string) => void;
  toolType?: string;
}

export function MarkdownViewer({
  content,
  title = '教学教研材料',
  onSaveToLibrary,
  isSaved,
  onContentChange,
}: MarkdownViewerProps) {
  const [copied, setCopied] = useState(false);
  const [showAiRefine, setShowAiRefine] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [originalContent, setOriginalContent] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            h1 { font-size: 24px; border-bottom: 2px solid #2563eb; padding-bottom: 8px; margin-bottom: 20px; }
            h2 { font-size: 18px; margin-top: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
            h3 { font-size: 16px; margin-top: 16px; }
            pre { background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 13px; }
            table { border-collapse: collapse; width: 100%; margin: 16px 0; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            th { background-color: #f8fafc; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          ${content
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\n\n/gim, '<br><br>')
            .replace(/\n/gim, '<br>')}
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Quick Refine Presets
  const refineChips = [
    { label: '🎯 强化师生提问链与预设生成', prompt: '请在现有方案的教学过程中，深度补充教师的高阶提问链（追问与诱思）以及学生的多种可能回答与针对性点拨话术。' },
    { label: '🧩 增设分层作业与后进生辅导', prompt: '请在文末增设更细致的“分层作业设计”（基础达标星、能力提升星、创新探究星）以及针对不同学习水平学生的差异化辅导建议。' },
    { label: '⏱️ 提炼为15分钟说课/试讲速览版', prompt: '请将现有教学材料提炼浓缩为一份条理清晰、亮点突出的“15分钟示范课说课/试讲速览稿”，包含说教材、说学情、说教法、说核心教学流程与特色亮点。' },
    { label: '🎨 增设直观板书图与活动道具表', prompt: '请在文末增加一份精美直观的“微结构板书设计图示”以及详细的“课堂教具与多媒体准备清单”。' },
    { label: '🧸 细化《指南》五大领域区角延伸', prompt: '请结合教育部《3-6岁儿童学习与发展指南》，增设配套的六大区角进阶材料投放与幼儿自主探究玩法指导。' },
  ];

  const handleExecuteRefine = async (customPrompt?: string) => {
    const instruction = customPrompt || refinePrompt;
    if (!instruction.trim() || isRefining) return;

    if (!originalContent) {
      setOriginalContent(content);
    }

    setIsRefining(true);

    try {
      const promptText = `你是一位特级名师与资深教育专家。请根据教师的修改指令，对以下现有的教育教学材料进行精准二次修改、润色或补充扩充。

【原始材料内容】：
${content}

【教师修改指令】：
${instruction}

【输出要求】：
1. 保持原有的专业排版格式（Markdown 标题、分段、表格、粗体等）。
2. 在保留原版核心优点的基础上，精准落实修改指令，直接输出修改后的完整 Markdown 全文，无需寒暄。`;

      let updated = '';
      await requestAIGeneration({
        prompt: promptText,
        systemInstruction: '你是一名经验丰富的特级骨干教师与教学教研专家。请以严谨专业的 Markdown 格式直接输出修改优化后的完整教案/教学材料。',
        temperature: 0.6,
        onChunk: (accumulated) => {
          updated = accumulated;
          if (onContentChange) {
            onContentChange(accumulated);
          }
        },
      });

      if (onContentChange && updated) {
        onContentChange(updated);
      }
      setRefinePrompt('');
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleUndoRefine = () => {
    if (originalContent && onContentChange) {
      onContentChange(originalContent);
      setOriginalContent(null);
    }
  };

  // Simple clean markdown-to-elements renderer
  const renderFormattedMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let tableBuffer: string[] = [];

    lines.forEach((line, idx) => {
      // Code block handling
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${idx}`} className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs md:text-sm my-3 overflow-x-auto border border-slate-800">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Table row handling
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        tableBuffer.push(line);
        return;
      } else if (tableBuffer.length > 0) {
        elements.push(renderTable(tableBuffer, `table-${idx}`));
        tableBuffer = [];
      }

      // Header 1
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${idx}`} className="text-xl md:text-2xl font-bold text-slate-900 border-b border-indigo-100 pb-3 mt-6 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
            {line.replace('# ', '')}
          </h1>
        );
        return;
      }

      // Header 2
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${idx}`} className="text-lg md:text-xl font-semibold text-indigo-950 mt-6 mb-3 pt-2 border-b border-slate-100 pb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-400 rounded-full inline-block"></span>
            {line.replace('## ', '')}
          </h2>
        );
        return;
      }

      // Header 3
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${idx}`} className="text-base md:text-lg font-semibold text-slate-800 mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
        return;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={`quote-${idx}`} className="border-l-4 border-indigo-400 bg-indigo-50/60 text-slate-700 px-4 py-2 my-2 rounded-r-lg text-sm">
            {line.replace('> ', '')}
          </blockquote>
        );
        return;
      }

      // Horizontal rule
      if (line.trim() === '---' || line.trim() === '***') {
        elements.push(<hr key={`hr-${idx}`} className="my-4 border-slate-200" />);
        return;
      }

      // Unordered List item
      if (/^\s*[\*\-•]\s+/.test(line)) {
        const itemText = line.replace(/^\s*[\*\-•]\s+/, '');
        elements.push(
          <li key={`li-${idx}`} className="ml-5 list-disc text-slate-700 my-1 text-sm md:text-base leading-relaxed">
            {renderInlineMarkdown(itemText)}
          </li>
        );
        return;
      }

      // Ordered list item
      if (/^\s*\d+[\.\、]\s+/.test(line)) {
        const itemText = line.replace(/^\s*\d+[\.\、]\s+/, '');
        elements.push(
          <div key={`oli-${idx}`} className="flex gap-2 text-slate-700 my-1.5 text-sm md:text-base leading-relaxed pl-1">
            <span className="font-semibold text-indigo-600 shrink-0">{line.match(/^\s*(\d+[\.\、])/)?.[1]}</span>
            <span>{renderInlineMarkdown(itemText)}</span>
          </div>
        );
        return;
      }

      // Empty line
      if (!line.trim()) {
        elements.push(<div key={`empty-${idx}`} className="h-2" />);
        return;
      }

      // Standard paragraph
      elements.push(
        <p key={`p-${idx}`} className="text-slate-700 my-1.5 text-sm md:text-base leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    });

    if (tableBuffer.length > 0) {
      elements.push(renderTable(tableBuffer, `table-end`));
    }

    return elements;
  };

  const renderTable = (rows: string[], key: string) => {
    const parsedRows = rows
      .map(r => r.split('|').map(c => c.trim()).filter((_, i, arr) => i !== 0 && i !== arr.length - 1))
      .filter(r => r.length > 0 && !r.every(c => /^[-:]+$/.test(c)));

    if (parsedRows.length === 0) return null;
    const header = parsedRows[0];
    const body = parsedRows.slice(1);

    return (
      <div key={key} className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
        <table className="w-full text-left text-xs md:text-sm text-slate-700">
          <thead className="bg-slate-100 font-semibold text-slate-800 border-b border-slate-200">
            <tr>
              {header.map((col, cIdx) => (
                <th key={cIdx} className="p-3 border-r border-slate-200 last:border-r-0">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {body.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-3 border-r border-slate-200 last:border-r-0">
                    {renderInlineMarkdown(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\$.*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="italic text-slate-800">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-xs md:text-sm font-mono border border-indigo-100">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        return <span key={index} className="font-serif italic font-medium text-indigo-900 bg-indigo-50/40 px-1 rounded">{part.slice(1, -1)}</span>;
      }
      return part;
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Top Action Bar */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium text-slate-700 truncate max-w-[200px] md:max-w-md">{title}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* AI Refine Toggle */}
          <button
            onClick={() => setShowAiRefine(!showAiRefine)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors shadow-2xs ${
              showAiRefine ? 'bg-indigo-100 text-indigo-800' : 'bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50'
            }`}
            title="对当前方案进行智能二次修改与润色"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI 二次润色</span>
            {showAiRefine ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
            title="复制全部内容"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? '已复制' : '复制'}</span>
          </button>

          <button
            onClick={() => exportAsDoc(title, content)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
            title="导出 Word (.doc) 格式"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">导出 Word</span>
            <span className="sm:hidden">Word</span>
          </button>

          <button
            onClick={() => exportAsMarkdown(title, content)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
            title="导出 Markdown (.md) 格式"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">导出 MD</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
            title="直接打印或保存为 PDF"
          >
            <Eye className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">打印/PDF</span>
          </button>

          {onSaveToLibrary && (
            <button
              onClick={onSaveToLibrary}
              disabled={isSaved}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors shadow-2xs ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaved ? '已收藏' : '存入备课库'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive AI Refine Panel */}
      {showAiRefine && (
        <div className="bg-indigo-50/70 border-b border-indigo-100 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI 教学导师定向二次修改与扩写</span>
            </span>
            {originalContent && (
              <button
                onClick={handleUndoRefine}
                className="text-2xs text-indigo-700 hover:text-indigo-900 underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>撤销回退到修改前</span>
              </button>
            )}
          </div>

          {/* Quick Refine Chips */}
          <div className="flex flex-wrap gap-1.5">
            {refineChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleExecuteRefine(chip.prompt)}
                disabled={isRefining}
                className="text-2xs px-2.5 py-1 bg-white hover:bg-indigo-100/80 text-indigo-900 rounded-lg border border-indigo-200 transition-colors shadow-2xs disabled:opacity-50"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Custom Prompt Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={refinePrompt}
              onChange={(e) => setRefinePrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExecuteRefine()}
              placeholder="输入您的具体修改需求（例如：把第二部分的实验环节改为就地取材的随堂小实验...）"
              className="flex-1 text-xs rounded-xl border border-indigo-200 bg-white px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              disabled={isRefining}
            />
            <button
              onClick={() => handleExecuteRefine()}
              disabled={isRefining || !refinePrompt.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
            >
              {isRefining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{isRefining ? '正在修改中...' : '提交修改'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Content Rendering Area */}
      <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto font-normal text-slate-800 antialiased selection:bg-indigo-100">
        {renderFormattedMarkdown(content)}
      </div>
    </div>
  );
}
