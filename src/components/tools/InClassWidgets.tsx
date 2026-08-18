import React, { useState, useEffect, useRef } from 'react';
import { Clock, Users, Shuffle, Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2, Plus, Trash2, Award, Trophy, Star, Sparkles, Heart } from 'lucide-react';
import { STUDENT_ROSTER_SAMPLE } from '../../data/presets';

interface Props {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
}

// Web Audio API Sound Synthesizer (Zero external dependencies)
function playSynthesizedSound(type: 'ding' | 'cheer' | 'tick' | 'star') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'ding') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } else if (type === 'star' || type === 'cheer') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.4);
      });
    } else if (type === 'tick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch (e) {
    // Ignore audio permission restrictions
  }
}

interface TeamScore {
  id: number;
  name: string;
  points: number;
  stars: number;
  flowers: number;
  color: string;
}

export function InClassWidgets({ onNotify }: Props) {
  const [activeTab, setActiveTab] = useState<'picker' | 'timer' | 'grouper' | 'scoreboard'>('picker');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Student Picker State
  const [studentNames, setStudentNames] = useState<string[]>(
    STUDENT_ROSTER_SAMPLE.map(s => s.name).concat(['林子墨', '孙艺涵', '黄宇轩', '吴若晴', '周雨萱', '徐晨希', '郭雨泽', '马梓萌'])
  );
  const [newStudentInput, setNewStudentInput] = useState('');
  const [isPicking, setIsPicking] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [pickedHistory, setPickedHistory] = useState<string[]>([]);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 mins default
  const [initialSeconds, setInitialSeconds] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<any>(null);

  // Group Maker State
  const [groupCount, setGroupCount] = useState(4);
  const [generatedGroups, setGeneratedGroups] = useState<{ id: number; members: string[]; captain: string }[]>([]);

  // Scoreboard / Praise Board State
  const [teams, setTeams] = useState<TeamScore[]>([
    { id: 1, name: '领航一队 (超越组)', points: 15, stars: 3, flowers: 2, color: 'from-blue-500 to-indigo-600' },
    { id: 2, name: '创新二队 (探索组)', points: 20, stars: 4, flowers: 3, color: 'from-emerald-500 to-teal-600' },
    { id: 3, name: '飞扬三队 (智慧组)', points: 12, stars: 2, flowers: 4, color: 'from-amber-500 to-orange-600' },
    { id: 4, name: '晨曦四队 (卓越组)', points: 18, stars: 3, flowers: 5, color: 'from-rose-500 to-pink-600' },
  ]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Timer interval handling
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            if (soundEnabled) playSynthesizedSound('ding');
            onNotify('success', '🔔 随堂倒计时结束！请同学们坐正停笔。');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, soundEnabled]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = (seconds: number) => {
    setInitialSeconds(seconds);
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  // Random Student Pick Animation
  const handleRandomPick = () => {
    if (studentNames.length === 0) {
      onNotify('error', '名单为空，请先添加学生姓名');
      return;
    }

    setIsPicking(true);
    let counter = 0;
    const maxCycles = 24;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * studentNames.length);
      setSelectedStudent(studentNames[randomIndex]);
      if (soundEnabled) playSynthesizedSound('tick');
      counter++;

      if (counter >= maxCycles) {
        clearInterval(interval);
        const finalStudent = studentNames[Math.floor(Math.random() * studentNames.length)];
        setSelectedStudent(finalStudent);
        setIsPicking(false);
        setPickedHistory(prev => [finalStudent, ...prev.slice(0, 9)]);
        if (soundEnabled) playSynthesizedSound('cheer');
        onNotify('info', `🎯 抽中学生：【${finalStudent}】请起立发表见解！`);
      }
    }, 70);
  };

  const handleAddStudent = () => {
    if (!newStudentInput.trim()) return;
    const added = newStudentInput.trim().split(/[\s,，、]+/).filter(Boolean);
    setStudentNames([...studentNames, ...added]);
    setNewStudentInput('');
    onNotify('success', `已添加 ${added.length} 名学生`);
  };

  // Class Roster Presets
  const loadRosterPreset = (presetName: string) => {
    if (presetName === 'kindergarten') {
      setStudentNames(['乐乐', '朵朵', '轩轩', '依依', '涵涵', '天天', '果果', '悦悦', '桐桐', '晨晨', '安安', '优优', '米粒', '皮皮', '豆豆']);
      onNotify('info', '已载入幼儿园萌宝小班/中班名单 (15人)');
    } else if (presetName === 'primary') {
      setStudentNames(STUDENT_ROSTER_SAMPLE.map(s => s.name).concat(['林子墨', '孙艺涵', '黄宇轩', '吴若晴', '周雨萱', '徐晨希', '郭雨泽', '马梓萌']));
      onNotify('info', '已载入小学标准示范班名单 (20人)');
    } else if (presetName === 'middle') {
      const more = ['陆子轩', '何静怡', '郑浩天', '谢思琪', '韩语嫣', '冯博文', '董馨月', '沈思睿', '曾梓涵', '彭俊杰'];
      setStudentNames(STUDENT_ROSTER_SAMPLE.map(s => s.name).concat(more));
      onNotify('info', '已载入中学大班制名单 (30人)');
    }
  };

  // Random Group Maker
  const handleMakeGroups = () => {
    if (studentNames.length === 0) return;
    const shuffled = [...studentNames].sort(() => Math.random() - 0.5);
    const groups: { id: number; members: string[]; captain: string }[] = [];

    for (let i = 0; i < groupCount; i++) {
      groups.push({ id: i + 1, members: [], captain: '' });
    }

    shuffled.forEach((name, index) => {
      groups[index % groupCount].members.push(name);
    });

    groups.forEach(g => {
      g.captain = g.members[0] || '组长待定';
    });

    setGeneratedGroups(groups);
    if (soundEnabled) playSynthesizedSound('star');
    onNotify('success', `已随机生成 ${groupCount} 个随堂探究小组！`);
  };

  // Scoreboard points update
  const handleUpdateTeamScore = (teamId: number, deltaPoints: number, type?: 'star' | 'flower') => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        if (soundEnabled) playSynthesizedSound(deltaPoints > 0 ? 'star' : 'tick');
        return {
          ...t,
          points: Math.max(0, t.points + deltaPoints),
          stars: type === 'star' ? Math.max(0, t.stars + 1) : t.stars,
          flowers: type === 'flower' ? Math.max(0, t.flowers + 1) : t.flowers,
        };
      }
      return t;
    }));
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-teal-800 to-indigo-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs text-xs font-medium text-sky-100 mb-2">
            <Clock className="w-3.5 h-3.5 text-sky-300" />
            <span>课堂互动控场 · 随机点名 · 限时倒计时 · 积分争霸榜</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">随堂实用互动工具箱</h2>
          <p className="text-sky-100 text-sm mt-1 max-w-2xl">
            专为多媒体白板与投影大屏打造：极速随机抽问点名、沉浸式专注倒计时、小组随机分派与课堂积分红花榜。
          </p>
        </div>

        {/* Global Controls & Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                soundEnabled ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title={soundEnabled ? '音效开启' : '音效静音'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-xs text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              title="投屏全屏模式"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center gap-1 p-1 bg-white/15 backdrop-blur-md rounded-xl border border-white/20">
            <button
              onClick={() => setActiveTab('picker')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'picker' ? 'bg-white text-sky-900 shadow-xs font-semibold' : 'text-sky-100 hover:bg-white/10'
              }`}
            >
              🎲 随机点名
            </button>
            <button
              onClick={() => setActiveTab('timer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'timer' ? 'bg-white text-sky-900 shadow-xs font-semibold' : 'text-sky-100 hover:bg-white/10'
              }`}
            >
              ⏱️ 随堂计时
            </button>
            <button
              onClick={() => setActiveTab('scoreboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'scoreboard' ? 'bg-white text-sky-900 shadow-xs font-semibold' : 'text-sky-100 hover:bg-white/10'
              }`}
            >
              🏆 积分争霸榜
            </button>
            <button
              onClick={() => setActiveTab('grouper')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'grouper' ? 'bg-white text-sky-900 shadow-xs font-semibold' : 'text-sky-100 hover:bg-white/10'
              }`}
            >
              👥 随机分组
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Random Student Picker */}
      {activeTab === 'picker' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Picker Stage */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-wider text-sky-600 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-100">
                班级点名大舞台 · {studentNames.length} 人在册
              </span>
              <h3 className="text-lg font-semibold text-slate-800">谁是本轮闪亮答题星？</h3>
            </div>

            {/* Lucky Card */}
            <div className="w-full max-w-md h-48 rounded-3xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex flex-col items-center justify-center text-white shadow-xl relative overflow-hidden border-4 border-white/40">
              <div className="absolute inset-0 bg-radial from-white/20 to-transparent pointer-events-none" />
              <div className={`text-4xl md:text-5xl font-black tracking-tight transition-transform duration-75 ${
                isPicking ? 'scale-115 blur-2xs' : 'scale-100'
              }`}>
                {selectedStudent || '准备点名'}
              </div>
              <div className="text-xs text-sky-100 mt-2.5 font-medium">
                {isPicking ? '🎲 命运大转盘正在高速旋转...' : selectedStudent ? '✨ 请起立分享你的思考见解 ✨' : '点击下方按钮一键随机点名'}
              </div>
            </div>

            {/* Big Action Button */}
            <button
              onClick={handleRandomPick}
              disabled={isPicking || studentNames.length === 0}
              className="px-8 py-3.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white rounded-2xl font-bold text-base shadow-lg transition-transform active:scale-95 flex items-center gap-2.5 disabled:opacity-50"
            >
              <Shuffle className={`w-5 h-5 ${isPicking ? 'animate-spin' : ''}`} />
              <span>{isPicking ? '正在高速抽选中...' : '🎲 随机抽取一位同学'}</span>
            </button>

            {/* Recent Picked History */}
            {pickedHistory.length > 0 && (
              <div className="w-full max-w-md pt-4 border-t border-slate-100 flex items-center justify-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-medium">近期回答：</span>
                {pickedHistory.map((name, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Roster Management */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-semibold text-slate-800">
                学生花名册 ({studentNames.length} 人)
              </h4>
              <button
                onClick={() => setStudentNames([])}
                className="text-xs text-rose-500 hover:underline"
              >
                清空
              </button>
            </div>

            {/* Quick Presets for Rosters */}
            <div className="space-y-1.5">
              <span className="text-2xs text-slate-400">快速导入班级预设：</span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => loadRosterPreset('kindergarten')}
                  className="text-2xs px-2 py-1 bg-rose-50 text-rose-700 rounded hover:bg-rose-100"
                >
                  🧸 幼教小班(15人)
                </button>
                <button
                  onClick={() => loadRosterPreset('primary')}
                  className="text-2xs px-2 py-1 bg-sky-50 text-sky-700 rounded hover:bg-sky-100"
                >
                  🏫 小学班级(20人)
                </button>
                <button
                  onClick={() => loadRosterPreset('middle')}
                  className="text-2xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100"
                >
                  📚 中学大班(30人)
                </button>
              </div>
            </div>

            {/* Add names input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newStudentInput}
                onChange={(e) => setNewStudentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddStudent()}
                placeholder="输入学生姓名（支持空格/逗号批量粘贴）"
                className="flex-1 text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
              />
              <button
                onClick={handleAddStudent}
                className="px-3 py-2 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-700 shrink-0"
              >
                添加
              </button>
            </div>

            {/* Student Chips */}
            <div className="flex flex-wrap gap-1.5 max-h-60 overflow-y-auto p-1.5 border border-slate-100 rounded-xl bg-slate-50/50">
              {studentNames.map((name, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-white text-slate-700 rounded-lg border border-slate-200"
                >
                  <span>{name}</span>
                  <button
                    onClick={() => setStudentNames(studentNames.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-rose-500 ml-0.5 text-xs"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Focus Classroom Timer */}
      {activeTab === 'timer' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col items-center justify-center text-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-100">
              随堂限时 · 抢答 · 研讨 · 测验专注钟
            </span>
          </div>

          {/* Giant Timer Clock Display */}
          <div className={`text-6xl md:text-8xl font-black font-mono tracking-tight py-4 px-12 rounded-3xl transition-colors ${
            timerSeconds === 0 ? 'text-rose-600 bg-rose-50 animate-pulse' :
            timerSeconds <= 60 && timerSeconds > 0 ? 'text-amber-600 bg-amber-50' : 'text-slate-900 bg-slate-50'
          }`}>
            {formatTime(timerSeconds)}
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: '30秒 (限时速答)', s: 30 },
              { label: '1分钟 (结对交流)', s: 60 },
              { label: '3分钟 (小组研讨)', s: 180 },
              { label: '5分钟 (随堂小测)', s: 300 },
              { label: '10分钟 (合作实验)', s: 600 },
              { label: '15分钟 (大题精练)', s: 900 },
              { label: '20分钟 (阶段自测)', s: 1200 },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleStartTimer(p.s)}
                className="text-xs font-medium px-3.5 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 rounded-xl transition-colors border border-slate-200"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`px-8 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-transform active:scale-95 flex items-center gap-2 ${
                isTimerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-sky-600 hover:bg-sky-700'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isTimerRunning ? '暂停计时' : '开始倒计时'}</span>
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(initialSeconds);
              }}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重置</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Scoreboard & Praise Board */}
      {activeTab === 'scoreboard' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>课堂小组争霸积分榜 & 小红花星光榜</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                用于随堂小组对抗、纪律激励与积极发言表扬，点击卡片即刻加分与点亮勋章。
              </p>
            </div>

            <button
              onClick={() => {
                setTeams(prev => prev.map(t => ({ ...t, points: 0, stars: 0, flowers: 0 })));
                onNotify('info', '已重置全班积分榜');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              一键重置积分
            </button>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {teams.map((team, idx) => (
              <div
                key={team.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">{team.name}</span>
                  <span className="text-2xs px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-full">
                    第 {idx + 1} 梯队
                  </span>
                </div>

                {/* Score Number Display */}
                <div className="text-center py-2">
                  <div className="text-4xl font-black text-slate-900 font-mono tracking-tight">
                    {team.points} <span className="text-xs font-normal text-slate-400">分</span>
                  </div>
                  {/* Badges / Stars */}
                  <div className="flex items-center justify-center gap-1.5 mt-2 text-xs">
                    <span className="text-amber-500 flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> ×{team.stars}
                    </span>
                    <span className="text-rose-500 flex items-center gap-0.5">
                      🌸 ×{team.flowers}
                    </span>
                  </div>
                </div>

                {/* Quick Add Buttons */}
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => handleUpdateTeamScore(team.id, 1)}
                    className="py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg text-xs font-bold text-indigo-700 transition-colors"
                  >
                    +1分
                  </button>
                  <button
                    onClick={() => handleUpdateTeamScore(team.id, 2, 'star')}
                    className="py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-bold text-amber-800 transition-colors"
                  >
                    +🌟(2分)
                  </button>
                  <button
                    onClick={() => handleUpdateTeamScore(team.id, 3, 'flower')}
                    className="py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold text-rose-800 transition-colors"
                  >
                    +🌸(3分)
                  </button>
                </div>

                <div className="flex justify-between items-center text-2xs text-slate-400">
                  <button
                    onClick={() => handleUpdateTeamScore(team.id, -1)}
                    className="hover:text-rose-600"
                  >
                    -1分
                  </button>
                  <button
                    onClick={() => handleUpdateTeamScore(team.id, 5)}
                    className="text-emerald-600 font-semibold hover:underline"
                  >
                    +5分 (大突破)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Group Maker */}
      {activeTab === 'grouper' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-600" />
                <span>随堂随机分组与轮值组长指定 ({studentNames.length} 人)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                支持设置 2-8 组，一键将全班随机打乱分配，并自动指派组长。
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-700">组数:</label>
                <select
                  value={groupCount}
                  onChange={(e) => setGroupCount(parseInt(e.target.value, 10))}
                  className="text-xs rounded-lg border border-slate-300 px-2 py-1.5 bg-white"
                >
                  <option value={2}>2 个大组</option>
                  <option value={3}>3 个大组</option>
                  <option value={4}>4 个小组</option>
                  <option value={6}>6 个小组</option>
                  <option value={8}>8 个小组</option>
                </select>
              </div>

              <button
                onClick={handleMakeGroups}
                className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-700 transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Shuffle className="w-4 h-4" />
                <span>一键随机分组</span>
              </button>
            </div>
          </div>

          {generatedGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {generatedGroups.map((g) => (
                <div key={g.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-800 text-sm">第 {g.id} 探究小组</span>
                    <span className="text-2xs px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full font-medium">
                      {g.members.length} 人
                    </span>
                  </div>

                  <div className="text-xs text-indigo-700 font-medium flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-md">
                    <Award className="w-3.5 h-3.5 text-indigo-600" />
                    <span>本轮组长：{g.captain}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {g.members.map((m, mIdx) => (
                      <span
                        key={mIdx}
                        className={`text-xs px-2 py-1 rounded-md border ${
                          m === g.captain
                            ? 'bg-indigo-600 text-white font-semibold border-indigo-600'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm">
              点击右上角【一键随机分组】，自动为全班学生均匀打乱分配。
            </div>
          )}
        </div>
      )}
    </div>
  );
}
