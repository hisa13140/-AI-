import React, { useState, useEffect } from 'react';
import { Layers, Sparkles, Edit3, ChevronDown, Check, BookOpen } from 'lucide-react';
import {
  STAGES_LIST,
  CURRICULUM_DATABASE,
  getGradesByStage,
  getSubjectsByGrade,
  getUnitsByGradeAndSubject,
  getTopicsByUnit,
  getAllTopicsByGradeAndSubject
} from '../data/curriculumData';

export interface CurriculumSelection {
  stage: string;
  grade: string;
  subject: string;
  unit: string;
  topic: string;
  competencyFocus?: string;
}

interface Props {
  initialStage?: string;
  initialGrade?: string;
  initialSubject?: string;
  initialUnit?: string;
  initialTopic?: string;
  accentColor?: 'indigo' | 'blue' | 'amber' | 'emerald' | 'cyan' | 'violet' | 'fuchsia';
  onSelectionChange: (selection: CurriculumSelection) => void;
  showCompetencyHint?: boolean;
}

export function CurriculumPicker({
  initialStage = 'junior',
  initialGrade = '初中八年级 (初二)',
  initialSubject = '语文',
  initialUnit = '第四单元：散文天地与情感哲思',
  initialTopic = '《背影》（朱自清）',
  accentColor = 'indigo',
  onSelectionChange,
  showCompetencyHint = true
}: Props) {
  const [selectedStage, setSelectedStage] = useState(initialStage);
  const [selectedGrade, setSelectedGrade] = useState(initialGrade);
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedUnit, setSelectedUnit] = useState(initialUnit);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [isCustomUnit, setIsCustomUnit] = useState(false);

  // Available grades in the selected stage
  const availableGrades = getGradesByStage(selectedStage);
  // Available subjects in the selected grade
  const availableSubjects = getSubjectsByGrade(selectedGrade);
  // Available units in the selected grade + subject
  const availableUnits = getUnitsByGradeAndSubject(selectedGrade, selectedSubject);
  // Available topics in the selected unit (or all in subject if unit is not found)
  const currentUnitTopics = getTopicsByUnit(selectedGrade, selectedSubject, selectedUnit);
  const allSubjectTopics = getAllTopicsByGradeAndSubject(selectedGrade, selectedSubject);

  // When Stage changes -> auto-select default grade and update subject
  const handleStageChange = (newStage: string) => {
    setSelectedStage(newStage);
    const stageObj = STAGES_LIST.find(s => s.id === newStage);
    const defaultGrade = stageObj ? stageObj.defaultGrade : getGradesByStage(newStage)[0] || '';
    setSelectedGrade(defaultGrade);

    const subjects = getSubjectsByGrade(defaultGrade);
    const defaultSubject = subjects[0] || '语文';
    setSelectedSubject(defaultSubject);

    const units = getUnitsByGradeAndSubject(defaultGrade, defaultSubject);
    const defaultUnit = units[0]?.unitName || '通用单元';
    setSelectedUnit(defaultUnit);

    const topics = units[0]?.topics || [];
    const defaultTopic = topics[0] || '';
    setSelectedTopic(defaultTopic);
    setIsCustomTopic(false);
    setIsCustomUnit(false);
  };

  // When Grade changes
  const handleGradeChange = (newGrade: string) => {
    setSelectedGrade(newGrade);
    const subjects = getSubjectsByGrade(newGrade);
    const sub = subjects.includes(selectedSubject) ? selectedSubject : subjects[0] || '语文';
    setSelectedSubject(sub);

    const units = getUnitsByGradeAndSubject(newGrade, sub);
    const unit = units[0]?.unitName || '第一单元';
    setSelectedUnit(unit);

    const topics = units[0]?.topics || [];
    const top = topics[0] || '';
    setSelectedTopic(top);
    setIsCustomTopic(false);
    setIsCustomUnit(false);
  };

  // When Subject changes
  const handleSubjectChange = (newSubject: string) => {
    setSelectedSubject(newSubject);
    const units = getUnitsByGradeAndSubject(selectedGrade, newSubject);
    const unit = units[0]?.unitName || '第一单元';
    setSelectedUnit(unit);

    const topics = units[0]?.topics || [];
    const top = topics[0] || '';
    setSelectedTopic(top);
    setIsCustomTopic(false);
    setIsCustomUnit(false);
  };

  // When Unit changes
  const handleUnitChange = (newUnit: string) => {
    setSelectedUnit(newUnit);
    if (newUnit === '__custom__') {
      setIsCustomUnit(true);
      return;
    }
    setIsCustomUnit(false);
    const topics = getTopicsByUnit(selectedGrade, selectedSubject, newUnit);
    if (topics.length > 0) {
      setSelectedTopic(topics[0]);
      setIsCustomTopic(false);
    }
  };

  // When Topic changes
  const handleTopicChange = (newTopic: string) => {
    if (newTopic === '__custom__') {
      setIsCustomTopic(true);
      return;
    }
    setIsCustomTopic(false);
    setSelectedTopic(newTopic);
  };

  // Find competency for current selection
  const foundTopicObj = allSubjectTopics.find(t => t.topic === selectedTopic);
  const foundUnitObj = availableUnits.find(u => u.unitName === selectedUnit);
  const activeCompetency = foundTopicObj?.competency || foundUnitObj?.competencyFocus || '';

  // Notify parent component on changes
  useEffect(() => {
    onSelectionChange({
      stage: selectedStage,
      grade: selectedGrade,
      subject: selectedSubject,
      unit: selectedUnit,
      topic: selectedTopic,
      competencyFocus: activeCompetency
    });
  }, [selectedStage, selectedGrade, selectedSubject, selectedUnit, selectedTopic, activeCompetency]);

  return (
    <div className="space-y-3.5 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
      {/* Stage Selector Tabs */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>学段与教学层级</span>
          </label>
          <span className="text-2xs text-slate-400">切换学段自动联动课程体系</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-200/60 rounded-lg">
          {STAGES_LIST.slice(0, 4).map((s) => {
            const isActive = selectedStage === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleStageChange(s.id)}
                className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all text-center truncate ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {s.label.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grade & Subject Selectors */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            具体年级 / 年龄段
          </label>
          <select
            value={selectedGrade}
            onChange={(e) => handleGradeChange(e.target.value)}
            className="w-full text-xs font-medium rounded-lg border border-slate-300 px-2.5 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            {availableGrades.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            学科 / 五大领域
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className="w-full text-xs font-medium rounded-lg border border-slate-300 px-2.5 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            {availableSubjects.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Unit Theme (Selectable + Custom Mode) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
            <span>单元主题 / 章节模块</span>
            <span className="text-rose-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setIsCustomUnit(!isCustomUnit)}
            className="text-2xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium transition-colors"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isCustomUnit ? '从课标题库选择' : '自定义单元'}</span>
          </button>
        </div>

        {isCustomUnit ? (
          <input
            type="text"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            placeholder="例如：第一单元 走进大自然与四季之美 / 第四章 一次函数"
            className="w-full text-xs rounded-lg border border-indigo-300 p-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        ) : (
          <select
            value={selectedUnit}
            onChange={(e) => handleUnitChange(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            {availableUnits.length > 0 ? (
              availableUnits.map((u) => (
                <option key={u.unitName} value={u.unitName}>
                  {u.unitName}
                </option>
              ))
            ) : (
              <option value="通用单元">标准综合教学单元</option>
            )}
          </select>
        )}
      </div>

      {/* Lesson Topic (Selectable from standard syllabus + Chips + Custom Input) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
            <span>课题名称 / 课文或实验</span>
            <span className="text-rose-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setIsCustomTopic(!isCustomTopic)}
            className="text-2xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium transition-colors"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isCustomTopic ? '从经典课表选择' : '自由手动输入'}</span>
          </button>
        </div>

        {isCustomTopic ? (
          <div className="space-y-1.5">
            <input
              type="text"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              placeholder="例如：《背影》《二次函数图像与性质》《光的反射定律》"
              className="w-full text-xs rounded-lg border border-indigo-300 p-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <select
              value={selectedTopic}
              onChange={(e) => handleTopicChange(e.target.value)}
              className="w-full text-xs font-medium rounded-lg border border-slate-300 px-2.5 py-2 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              {currentUnitTopics.length > 0 ? (
                currentUnitTopics.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))
              ) : allSubjectTopics.length > 0 ? (
                allSubjectTopics.map((item) => (
                  <option key={item.topic} value={item.topic}>{item.topic}</option>
                ))
              ) : (
                <option value={selectedTopic || '标准示范课'}>{selectedTopic || '标准示范课'}</option>
              )}
            </select>

            {/* Quick Topic Chips within current unit for 1-click preview */}
            {currentUnitTopics.length > 1 && (
              <div className="flex flex-wrap gap-1 pt-0.5">
                <span className="text-2xs text-slate-400 flex items-center gap-0.5 py-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  本单元课题：
                </span>
                {currentUnitTopics.map((t) => {
                  const isCur = selectedTopic === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setSelectedTopic(t);
                        setIsCustomTopic(false);
                      }}
                      className={`text-2xs px-2 py-0.5 rounded transition-all truncate max-w-[140px] border ${
                        isCur
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-300 font-semibold'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                      }`}
                      title={t}
                    >
                      {t.replace(/《|》/g, '')}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Competency Hint Box */}
      {showCompetencyHint && activeCompetency && (
        <div className="p-2.5 bg-indigo-50/80 rounded-lg text-2xs text-indigo-900 border border-indigo-100 flex items-start gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">课标素养锚定：</strong>
            <span>{activeCompetency}</span>
          </div>
        </div>
      )}
    </div>
  );
}
