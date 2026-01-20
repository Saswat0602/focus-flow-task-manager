import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  LayoutDashboard, 
  ListTodo, 
  Plus, 
  Settings, 
  Clock, 
  Trash2, 
  CalendarDays, 
  Target,
  TrendingUp,
  Columns,
  MessageSquare,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Send,
  Calendar,
  Filter,
  BarChart3
} from 'lucide-react';

const App = () => {
  const [view, setView] = useState('dashboard'); // dashboard, week-detail
  const [activeWeek, setActiveWeek] = useState(1);
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      text: 'Finalize UI Mockups', 
      status: 'in-progress', 
      priority: 'high', 
      week: 1, 
      date: '2026-01-03',
      comments: [{ id: 101, user: 'Alex', text: 'Looking good, need to check mobile spacing.', time: '2h ago' }]
    },
    { 
      id: 2, 
      text: 'Monthly Budget Review', 
      status: 'completed', 
      priority: 'medium', 
      week: 1, 
      date: '2026-01-05',
      comments: []
    },
    { 
      id: 3, 
      text: 'Client Workshop Prep', 
      status: 'needs-improvement', 
      priority: 'high', 
      week: 2, 
      date: '2026-01-12',
      comments: [{ id: 102, user: 'Sarah', text: 'Agenda is still a bit vague.', time: '1h ago' }]
    },
    { 
      id: 4, 
      text: 'Database Migration', 
      status: 'todo', 
      priority: 'high', 
      week: 3, 
      date: '2026-01-20',
      comments: []
    }
  ]);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({ text: '', week: 1, priority: 'medium', status: 'todo' });
  const [activeTaskForComments, setActiveTaskForComments] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Fixed Date Ranges for January 2026
  const weekData = [
    { id: 1, label: 'Week 1', range: 'Jan 01 - Jan 07' },
    { id: 2, label: 'Week 2', range: 'Jan 08 - Jan 14' },
    { id: 3, label: 'Week 3', range: 'Jan 15 - Jan 21' },
    { id: 4, label: 'Week 4', range: 'Jan 22 - Jan 31' },
  ];

  const statuses = [
    { id: 'todo', label: 'To Do', icon: Circle, color: 'text-slate-400', bg: 'bg-slate-50' },
    { id: 'in-progress', label: 'In Progress', icon: Loader2, color: 'text-amber-500', bg: 'bg-amber-50/30' },
    { id: 'needs-improvement', label: 'Improve', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50/30' },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50/30' }
  ];

  // Stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const progressCount = tasks.filter(t => t.status === 'in-progress').length;
    const improveCount = tasks.filter(t => t.status === 'needs-improvement').length;
    
    const monthlyProgress = total ? Math.round((completedCount / total) * 100) : 0;
    
    const weeklyBreakdown = weekData.map(w => {
      const weekTasks = tasks.filter(t => t.week === w.id);
      const done = weekTasks.filter(t => t.status === 'completed').length;
      return {
        ...w,
        count: weekTasks.length,
        progress: weekTasks.length ? Math.round((done / weekTasks.length) * 100) : 0
      };
    });

    return { monthlyProgress, total, completedCount, progressCount, improveCount, weeklyBreakdown };
  }, [tasks]);

  const updateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (activeTaskForComments?.id === id) setActiveTaskForComments(null);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.text.trim()) return;
    const task = {
      ...newTask,
      id: Date.now(),
      date: new Date('2026-01-01').toISOString().split('T')[0], // Mock date for Jan
      comments: []
    };
    setTasks([task, ...tasks]);
    setNewTask({ text: '', week: activeWeek, priority: 'medium', status: 'todo' });
    setIsAddingTask(false);
  };

  const addComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !activeTaskForComments) return;
    const newComment = { id: Date.now(), user: 'You', text: commentText, time: 'Just now' };
    setTasks(tasks.map(t => t.id === activeTaskForComments.id ? { ...t, comments: [...t.comments, newComment] } : t));
    setCommentText('');
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-slate-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <BarChart3 size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">FocusFlow</span>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          <button 
            onClick={() => setView('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <LayoutDashboard size={18} />
            <span className="text-sm font-semibold">Dashboard</span>
          </button>
          <button 
            onClick={() => { setView('week-detail'); setActiveWeek(1); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'week-detail' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Columns size={18} />
            <span className="text-sm font-semibold">Weekly Planner</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
           <div className="p-4 bg-slate-50 rounded-2xl">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Month View</p>
             <p className="text-sm font-bold text-slate-700">January 2026</p>
           </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-row overflow-hidden">
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="px-8 py-6 flex justify-between items-center bg-white border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                {view === 'dashboard' ? (
                  <>January Roadmap <span className="text-slate-300 font-light">/</span> 2026</>
                ) : (
                  <>Weekly Execution <span className="text-slate-300 font-light">/</span> Week {activeWeek}</>
                )}
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">
                {view === 'dashboard' ? 'Review your month-long strategy and total progress.' : weekData.find(w => w.id === activeWeek)?.range}
              </p>
            </div>
            
            <button 
              onClick={() => setIsAddingTask(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg"
            >
              <Plus size={20} />
              <span className="font-semibold text-sm">Add Global Task</span>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
            {view === 'dashboard' && (
              <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Monthly Health Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Big Progress Card */}
                  <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 flex items-center gap-10 shadow-sm relative overflow-hidden">
                    <div className="relative shrink-0">
                       <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * stats.monthlyProgress) / 100} className="text-indigo-600 transition-all duration-1000" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-800">{stats.monthlyProgress}%</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">Monthly Completion</h3>
                      <p className="text-slate-500 leading-relaxed text-sm max-w-md">
                        You have finished <span className="font-bold text-indigo-600">{stats.completedCount}</span> tasks out of <span className="font-bold">{stats.total}</span> planned for January. 
                        Keep moving to reach your goals.
                      </p>
                      <div className="mt-6 flex gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="text-xs font-bold text-slate-600">{stats.progressCount} In Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-rose-500" />
                          <span className="text-xs font-bold text-slate-600">{stats.improveCount} Needs Work</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Breakdown Mini Cards */}
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 flex justify-between items-center shadow-sm">
                       <div>
                         <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Goals</p>
                         <p className="text-2xl font-bold">{stats.total}</p>
                       </div>
                       <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><Target size={20} /></div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 flex justify-between items-center shadow-sm">
                       <div>
                         <p className="text-xs font-bold text-emerald-500 uppercase mb-1">Success Rate</p>
                         <p className="text-2xl font-bold text-emerald-600">High</p>
                       </div>
                       <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl"><TrendingUp size={20} /></div>
                    </div>
                  </div>
                </div>

                {/* Week Grid Navigator */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {stats.weeklyBreakdown.map(wd => (
                    <button 
                      key={wd.id}
                      onClick={() => { setActiveWeek(wd.id); setView('week-detail'); }}
                      className="group bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50/50 transition-all text-left"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <Calendar size={20} />
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Week 0{wd.id}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-lg">{wd.label}</h4>
                      <p className="text-xs text-slate-400 mb-6 font-medium">{wd.range}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                          <span>Progress</span>
                          <span className="text-indigo-600">{wd.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${wd.progress}%` }} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Combined Monthly List */}
                <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                   <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                     <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <ListTodo size={18} className="text-indigo-600" />
                       Comprehensive Monthly Log
                     </h3>
                     <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase">All Weeks</span>
                   </div>
                   <div className="p-6">
                     <div className="space-y-10">
                       {weekData.map(w => (
                         <div key={w.id}>
                           <div className="flex items-center gap-3 mb-4">
                             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{w.label}</span>
                             <div className="h-[1px] flex-1 bg-slate-100" />
                             <span className="text-[10px] text-slate-300 font-bold">{w.range}</span>
                           </div>
                           <div className="grid gap-3">
                             {tasks.filter(t => t.week === w.id).map(task => {
                               const status = statuses.find(s => s.id === task.status);
                               return (
                                 <div key={task.id} onClick={() => { setActiveTaskForComments(task); setActiveWeek(task.week); setView('week-detail'); }} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer group">
                                   <div className="flex items-center gap-4">
                                     <div className={`w-2 h-2 rounded-full ${status ? status.color.replace('text', 'bg') : 'bg-slate-400'}`} />
                                     <span className="font-bold text-sm text-slate-700">{task.text}</span>
                                   </div>
                                   <div className="flex items-center gap-6">
                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{status ? status.label : 'Unknown'}</span>
                                     <ChevronRight size={16} className="text-slate-200 group-hover:text-indigo-400 transition-all" />
                                   </div>
                                 </div>
                               );
                             })}
                             {tasks.filter(t => t.week === w.id).length === 0 && (
                               <p className="text-xs text-slate-300 italic text-center py-4 border-2 border-dashed border-slate-50 rounded-2xl">No tasks scheduled for this week.</p>
                             )}
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                </div>
              </div>
            )}

            {view === 'week-detail' && (
              <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-500">
                {/* Week Tab Switcher */}
                <div className="px-8 pt-6 pb-2 bg-white flex items-center gap-1 border-b border-slate-100">
                  {weekData.map(w => (
                    <button 
                      key={w.id}
                      onClick={() => setActiveWeek(w.id)}
                      className={`px-6 py-3 rounded-t-xl text-sm font-bold transition-all relative ${activeWeek === w.id ? 'text-indigo-600 bg-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {w.label}
                      {activeWeek === w.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full" />}
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-8 flex gap-6 overflow-x-auto pb-10">
                  {statuses.map(status => (
                    <div key={status.id} className="flex flex-col min-w-[320px] h-full">
                      <div className="flex items-center justify-between mb-5 px-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${status.bg} ${status.color}`}>
                            <status.icon size={16} />
                          </div>
                          <h4 className="font-black text-slate-800 uppercase text-[11px] tracking-widest">{status.label}</h4>
                        </div>
                        <span className="bg-white border border-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {tasks.filter(t => t.week === activeWeek && t.status === status.id).length}
                        </span>
                      </div>

                      <div className={`flex-1 space-y-4 ${status.bg} p-4 rounded-3xl border border-slate-100 overflow-y-auto`}>
                        {tasks.filter(t => t.week === activeWeek && t.status === status.id).map(task => (
                          <div 
                            key={task.id} 
                            onClick={() => setActiveTaskForComments(task)}
                            className={`group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/30 transition-all cursor-pointer relative ${activeTaskForComments?.id === task.id ? 'ring-2 ring-indigo-500' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <p className="text-sm font-bold text-slate-700 leading-snug pr-4">{task.text}</p>
                              <div className={`shrink-0 w-3 h-3 rounded-full border-4 border-white shadow-sm ${task.priority === 'high' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-lg">
                                  <MessageSquare size={12} /> {task.comments.length}
                                </div>
                              </div>
                              
                              <select 
                                onClick={e => e.stopPropagation()}
                                onChange={e => updateTaskStatus(task.id, e.target.value)}
                                value={task.status}
                                className="text-[10px] font-black uppercase bg-white border border-slate-100 rounded-lg p-1.5 text-slate-500 cursor-pointer focus:ring-1 focus:ring-indigo-500 transition-all"
                              >
                                {statuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                              </select>
                            </div>
                          </div>
                        ))}
                        
                        <button 
                           onClick={() => {
                            setNewTask({ ...newTask, week: activeWeek, status: status.id });
                            setIsAddingTask(true);
                          }}
                          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-white transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest"
                        >
                          <Plus size={16} /> New Entry
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel: Discussion */}
        <aside className={`w-[400px] bg-white border-l border-slate-200 flex flex-col transition-all duration-300 z-20 ${activeTaskForComments ? 'translate-x-0' : 'translate-x-full absolute right-0'}`}>
          {activeTaskForComments ? (
            <>
              <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Workspace Discussion</span>
                  <button onClick={() => setActiveTaskForComments(null)} className="p-2 hover:bg-white rounded-xl text-slate-400 border border-transparent hover:border-slate-200">
                    <Trash2 size={16} className="text-slate-300 hover:text-rose-500" onClick={(e) => { e.stopPropagation(); deleteTask(activeTaskForComments.id); }} />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-6">{activeTaskForComments.text}</h3>
                <div className="flex flex-wrap gap-3">
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
                      <CalendarDays size={14} className="text-indigo-600" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase">Week {activeTaskForComments.week}</span>
                   </div>
                   <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-full shadow-sm ${activeTaskForComments.priority === 'high' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                     <AlertCircle size={14} />
                     <span className="text-[10px] font-bold uppercase">{activeTaskForComments.priority} Priority</span>
                   </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {activeTaskForComments.comments.map(comment => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0 font-bold text-xs shadow-lg">
                      {comment.user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-slate-800">{comment.user}</span>
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter">{comment.time}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100">
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {activeTaskForComments.comments.length === 0 && (
                  <div className="py-20 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare size={24} className="text-slate-200" />
                    </div>
                    <p className="text-sm font-bold text-slate-400">No active feedback</p>
                    <p className="text-[10px] text-slate-300 mt-1 uppercase font-black">Be the first to comment</p>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-slate-100">
                <form onSubmit={addComment} className="relative">
                  <textarea 
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Contribute to this task..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pr-14 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none min-h-[100px]"
                  />
                  <button 
                    type="submit"
                    className="absolute bottom-5 right-5 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                    disabled={!commentText.trim()}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                <Filter size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-800">Select a Goal</h4>
              <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed max-w-[240px]">
                Review detailed status, leave feedback, and coordinate with your weekly plan.
              </p>
            </div>
          )}
        </aside>

        {/* Global Task Modal */}
        {isAddingTask && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
              <form onSubmit={addTask} className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">New Monthly Goal</h3>
                    <p className="text-sm text-slate-400">Schedule this for any week in January.</p>
                  </div>
                  <button type="button" onClick={() => setIsAddingTask(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400">
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Task Objective</label>
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="e.g., Conduct user research"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                      value={newTask.text}
                      onChange={e => setNewTask({...newTask, text: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Assign to Week</label>
                      <select 
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        value={newTask.week}
                        onChange={e => setNewTask({...newTask, week: parseInt(e.target.value)})}
                      >
                        {weekData.map(w => <option key={w.id} value={w.id}>{w.label} ({w.range})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Urgency Level</label>
                      <select 
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        value={newTask.priority}
                        onChange={e => setNewTask({...newTask, priority: e.target.value})}
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest"
                >
                  Create Monthly Entry
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;