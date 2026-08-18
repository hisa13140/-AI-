/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ToolGrid } from './components/ToolGrid';
import { ToolNavigationHeader } from './components/ToolNavigationHeader';
import { KindergartenActivityStudio } from './components/tools/KindergartenActivityStudio';
import { ChildObservationStudio } from './components/tools/ChildObservationStudio';
import { KindergartenEnvStudio } from './components/tools/KindergartenEnvStudio';
import { LessonPlanStudio } from './components/tools/LessonPlanStudio';
import { QuizGenerator } from './components/tools/QuizGenerator';
import { EssayAssignmentGrader } from './components/tools/EssayAssignmentGrader';
import { StudentCommentAssistant } from './components/tools/StudentCommentAssistant';
import { PptOutlineBuilder } from './components/tools/PptOutlineBuilder';
import { ParentCommHelper } from './components/tools/ParentCommHelper';
import { ClassActivityGenerator } from './components/tools/ClassActivityGenerator';
import { InClassWidgets } from './components/tools/InClassWidgets';
import { MicroLessonScript } from './components/tools/MicroLessonScript';
import { ResourceLibrary } from './components/tools/ResourceLibrary';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ToolCategory, ToolId } from './types';
import { getSavedResources } from './utils/storage';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');
  const [activeToolId, setActiveToolId] = useState<ToolId | null>('lesson-plan');
  const [showOverviewGrid, setShowOverviewGrid] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [savedCount, setSavedCount] = useState(0);

  const updateSavedCount = () => {
    const list = getSavedResources();
    setSavedCount(list.length);
  };

  useEffect(() => {
    updateSavedCount();
  }, []);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSelectTool = (id: ToolId) => {
    setActiveToolId(id);
    setShowOverviewGrid(false);
  };

  const handleSelectCategory = (cat: ToolCategory) => {
    setActiveCategory(cat);
    if (cat === 'kindergarten') {
      setActiveToolId('kindergarten-activity');
      setShowOverviewGrid(false);
    } else {
      setShowOverviewGrid(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Bar Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        activeToolId={activeToolId}
        onSelectTool={handleSelectTool}
        savedCount={savedCount}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tool Switcher Header */}
        {!showOverviewGrid && activeToolId && (
          <ToolNavigationHeader
            activeToolId={activeToolId}
            onSelectTool={handleSelectTool}
            onBackToGrid={() => setShowOverviewGrid(true)}
          />
        )}

        {/* View Switcher */}
        {showOverviewGrid ? (
          <ToolGrid
            activeCategory={activeCategory}
            onSelectTool={handleSelectTool}
          />
        ) : (
          <div>
            {/* Kindergarten Suite */}
            {activeToolId === 'kindergarten-activity' && (
              <KindergartenActivityStudio onNotify={addToast} onSavedChange={updateSavedCount} />
            )}
            {activeToolId === 'child-observation' && (
              <ChildObservationStudio onNotify={addToast} onSavedChange={updateSavedCount} />
            )}
            {activeToolId === 'kindergarten-env' && (
              <KindergartenEnvStudio onNotify={addToast} onSavedChange={updateSavedCount} />
            )}

            {/* K-12 & Higher Ed Suite */}
            {activeToolId === 'lesson-plan' && (
              <LessonPlanStudio onNotify={addToast} onSavedChange={updateSavedCount} />
            )}
            {activeToolId === 'quiz-gen' && (
              <QuizGenerator onNotify={addToast} onSavedChange={updateSavedCount} />
            )}
            {activeToolId === 'essay-grade' && (
              <EssayAssignmentGrader onNotify={addToast} onSavedChange={updateSavedCount} />
            )}
            {activeToolId === 'student-comment' && (
              <StudentCommentAssistant onNotify={addToast} onSavedChange={updateSavedCount} />
            )}
            {activeToolId === 'ppt-outline' && (
              <PptOutlineBuilder onNotify={addToast} onSavedChange={updateSavedCount} />
            )}
            {activeToolId === 'parent-comm' && (
              <ParentCommHelper onNotify={addToast} onSavedChange={updateSavedCount} />
            )}
            {activeToolId === 'class-activity' && (
              <ClassActivityGenerator onNotify={addToast} onSavedChange={updateSavedCount} />
            )}
            {activeToolId === 'in-class-tools' && (
              <InClassWidgets onNotify={addToast} />
            )}
            {activeToolId === 'micro-lesson' && (
              <MicroLessonScript onNotify={addToast} onSavedChange={updateSavedCount} />
            )}
            {activeToolId === 'library' && (
              <ResourceLibrary onNotify={addToast} onOpenTool={handleSelectTool} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">EduSpark 智教星</span>
            <span>— 赋能中小学及幼教教师减负增效的智能教育工作台</span>
          </div>
          <div>
            <span>对标《3-6岁儿童学习与发展指南》与义务教育新课标 · 一键导出 Word / MD / 打印</span>
          </div>
        </div>
      </footer>

      {/* Global Toast Alerts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
